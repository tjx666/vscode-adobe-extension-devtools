import fs from 'fs/promises';
import pathUtils, { resolve } from 'path';

import execa from 'execa';
import { stringify } from 'javascript-stringify';

import { EXTENSION_DIR, JSX_DIR } from '../constants';
import { dateFormat, escapeStringAppleScript, pathExists, uuidV4 } from '../utils/common';
import configuration from '../configuration';

type HostApp = 'AE' | 'PS';

async function loadPreloadScript(host: HostApp, preloadScriptPath: string) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return evalScript(
        host,
        `(function(){
        $.evalFile('__preload__');
    })();`,
        {
            placeholders: {
                preload: preloadScriptPath,
            },
        },
    );
}

interface EvalScriptAdapter {
    findApp(): Promise<string | undefined>;
    createOsascript(app: string, script: string): string;
    /** eval only once whole extension lifecycle */
    preloadScript?: string;
    /** eval every time */
    preEvalScript?: string;
}

class EvalAeScriptAdapter implements EvalScriptAdapter {
    preloadScript = resolve(JSX_DIR, 'afterEffects/utils/index.jsx');

    async findApp() {
        if (configuration.aeAppPath) return configuration.aeAppPath;

        const appsDir = '/Applications';
        const appFolderNames = await fs.readdir(appsDir);

        for (const appFolderName of appFolderNames) {
            if (!appFolderName.includes('Adobe After Effects')) continue;

            const appFolderPath = pathUtils.resolve(appsDir, appFolderName);
            const fileNamesInAppDir = await fs.readdir(appFolderPath);
            for (const fileName of fileNamesInAppDir) {
                if (fileName.includes('Adobe After Effects') && fileName.endsWith('.app'))
                    return pathUtils.resolve(appFolderPath, fileName);
            }
        }
        return undefined;
    }

    createOsascript(app: string, script: string): string {
        return `tell application "${app}"
DoScript "${script}"
end tell`;
    }
}

class EvalPsScriptAdapter implements EvalScriptAdapter {
    preEvalScript = resolve(JSX_DIR, 'photoshop/utils/index.jsx');

    /**
     * find host app path, only support MacOS
     * @param appName like: Adobe Photoshop
     * @returns Adobe Photoshop 2021.app
     */
    async findApp() {
        if (configuration.psAppFolderPath) return configuration.psAppFolderPath;
        const appsDir = '/Applications';
        const appFolderNames = await fs.readdir(appsDir);

        const appFolderName = appFolderNames.find((folderName) =>
            folderName.includes('Adobe Photoshop'),
        );
        return appFolderName;
    }

    createOsascript(app: string, script: string): string {
        return `tell application "${app}"
        do javascript "${script}"
    end tell`;
    }
}

const adapterMap = new Map<HostApp, EvalScriptAdapter>([
    ['AE', new EvalAeScriptAdapter()],
    ['PS', new EvalPsScriptAdapter()],
]);

interface EvalOptions {
    argumentObject?: Record<string, any>;
    placeholders?: Record<string, any>;
}

const preloadScriptLoadedMap: Map<HostApp, boolean> = new Map();

export async function evalScript(host: HostApp, script: string, options?: EvalOptions) {
    const evalScriptAdapter = adapterMap.get(host)!;
    if (evalScriptAdapter.preloadScript && preloadScriptLoadedMap.get(host) !== true) {
        preloadScriptLoadedMap.set(host, true);
        await loadPreloadScript(host, evalScriptAdapter.preloadScript);
    }

    const defaultOptions: EvalOptions = {
        argumentObject: {},
        placeholders: {},
    };
    options = Object.assign(defaultOptions, options);

    // a script to inject some helper functions
    // for example: print function, which print string as result
    const injectApiScriptPath = pathUtils.resolve(EXTENSION_DIR, 'JSX/inject.jsx');
    const injectApiScript = await fs.readFile(injectApiScriptPath, 'utf8');
    script = injectApiScript.replace('// ${executeScriptCode}', script);

    if (evalScriptAdapter.preEvalScript) {
        script = `\n// @include '${evalScriptAdapter.preEvalScript}'\n` + script;
    }

    const app = await evalScriptAdapter.findApp();
    if (!app) {
        throw new Error(`can't find ${host} to eval script!`);
    }

    const uuid = uuidV4();

    const jsxOutputFolder = pathUtils.resolve(configuration.globalStoragePath, 'jsx/output');
    if (!(await pathExists(jsxOutputFolder))) {
        await fs.mkdir(jsxOutputFolder, { recursive: true });
    }
    const dateStr = dateFormat(new Date(), '%Y-%m-%d-%H:%M:%S', false);
    const jsxOutputFilePath = pathUtils.resolve(jsxOutputFolder, `${dateStr}-${uuid}.txt`);

    // args
    const argumentObjectStr = stringify(options.argumentObject, null, 4)!;
    script = script.replace('// ${args}', `var args = ${argumentObjectStr};`);

    // placeholders
    script = script.replaceAll('__output_file__', `"${jsxOutputFilePath}"`);
    for (const [key, value] of Object.entries(options.placeholders!)) {
        script = script.replaceAll(`__${key}__`, value);
    }

    const appleScriptsFolder = pathUtils.resolve(configuration.globalStoragePath, 'apple_scripts');
    if (!(await pathExists(appleScriptsFolder))) {
        await fs.mkdir(appleScriptsFolder, { recursive: true });
    }
    const appleScriptPath = pathUtils.resolve(
        appleScriptsFolder,
        `${dateStr}-command-${uuid}.scpt`,
    );
    const appleScript = evalScriptAdapter.createOsascript(app, escapeStringAppleScript(script));
    await Promise.all([
        await fs.writeFile(jsxOutputFilePath, '', 'utf8'),
        await fs.writeFile(appleScriptPath, appleScript, 'utf8'),
    ]);

    let result: any;
    await execa('osascript', [appleScriptPath]);
    const output = await fs.readFile(jsxOutputFilePath, 'utf8');
    try {
        result = JSON.parse(output);
    } catch {
        return output;
    }

    // if execute failed, keep the scripts
    // await Promise.all([fs.rm(appleScriptPath), fs.rm(jsxOutputFilePath)]);

    return result;
}

export default async function evalFile(host: HostApp, scriptPath: string, options?: EvalOptions) {
    const script = await fs.readFile(scriptPath, 'utf8');
    return evalScript(host, script, options);
}
