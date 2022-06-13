import fs from 'fs/promises';
import pathUtils from 'path';

import execa from 'execa';
import { stringify } from 'javascript-stringify';

import configuration from './configuration';
import { EXTENSION_DIR } from './constants';
import { uuidV4, escapeStringAppleScript } from './utils';

async function findAe() {
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

    return null;
}

function getFileNameWithoutExt(path: string) {
    const basename = pathUtils.basename(path);
    return basename.slice(0, basename.lastIndexOf(pathUtils.extname(path)));
}

interface EvalFileOptions {
    argumentObject?: Record<string, any>;
    placeholders?: Record<string, any>;
}

let isPolyfill = false;
async function evalFile(scriptPath: string, options?: EvalFileOptions) {
    if (!isPolyfill) {
        isPolyfill = true;
        const jsonPolyfillScript = pathUtils.resolve(EXTENSION_DIR, 'JSX/json2.jsx');
        await evalFile(jsonPolyfillScript);
    }

    const defaultOptions: EvalFileOptions = {
        argumentObject: {},
        placeholders: {},
    };
    options = Object.assign(defaultOptions, options);

    const ae = await findAe();
    const uuid = uuidV4();

    const jsxOutputFolder = pathUtils.resolve(configuration.globalStoragePath, 'jsx/output');
    await fs.mkdir(jsxOutputFolder, { recursive: true });
    const jsxOutputFilePath = pathUtils.resolve(
        jsxOutputFolder,
        `${getFileNameWithoutExt(scriptPath)}-${uuid}.txt`,
    );

    // a script to inject some helper functions
    // for example: print function, which print string as result
    const injectApiScriptPath = pathUtils.resolve(EXTENSION_DIR, 'JSX/inject.jsx');
    const injectApiScript = await fs.readFile(injectApiScriptPath, 'utf-8');
    let script = await fs.readFile(scriptPath, 'utf-8');
    script = injectApiScript.replace('// ${executeScriptCode}', script);

    // args
    if (options.argumentObject) {
        const argumentObjectStr = stringify(options.argumentObject, null, 4)!;
        script = script.replace('// ${args}', `var args = ${argumentObjectStr};`);
    }

    // placeholders
    script = script.replaceAll('__output_file__', `"${jsxOutputFilePath}"`);
    for (const [key, value] of Object.entries(options.placeholders!)) {
        script = script.replaceAll(`__${key}__`, value);
    }

    const appleScriptsFolder = pathUtils.resolve(configuration.globalStoragePath, 'apple_scripts');
    await fs.mkdir(appleScriptsFolder, { recursive: true });
    const appleScriptPath = pathUtils.resolve(appleScriptsFolder, `ae-command-${uuid}.scpt`);
    const appleScript = `tell application "${ae}"
    DoScript "${escapeStringAppleScript(script)}"
    end tell`;
    await Promise.all([
        await fs.writeFile(jsxOutputFilePath, '', 'utf-8'),
        await fs.writeFile(appleScriptPath, appleScript, 'utf-8'),
    ]);

    let result: any;
    await execa('osascript', [appleScriptPath]);
    const output = await fs.readFile(jsxOutputFilePath, 'utf-8');
    try {
        result = JSON.parse(output);
    } catch {
        return output;
    }

    // if execute failed, keep the scripts
    await Promise.all([fs.rm(appleScriptPath), fs.rm(jsxOutputFilePath)]);

    return result;
}

export default evalFile;
