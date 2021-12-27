import fs from 'fs/promises';
import { constants as FS_CONSTANTS } from 'fs';
import pathUtils from 'path';
import esc from 'escape-string-applescript';
import execa from 'execa';

import { DATA_DIR, EXTENSION_DIR } from './constants';
import { uuidV4 } from './utils';

async function findAe() {
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

function pathExists(path: string) {
    return fs
        .access(path, FS_CONSTANTS.F_OK)
        .then(() => true)
        .catch(() => false);
}

async function evalFile(scriptPath) {
    const ae = await findAe();
    const uuid = uuidV4();

    const jsxOutputFolder = pathUtils.resolve(DATA_DIR, 'jsx/output');
    await fs.mkdir(jsxOutputFolder, { recursive: true });
    const jsxOutputFilePath = pathUtils.resolve(
        jsxOutputFolder,
        `${getFileNameWithoutExt(scriptPath)}-${uuid}.txt`,
    );
    const injectApiScriptPath = pathUtils.resolve(EXTENSION_DIR, 'JSX/inject.jsx');
    const injectApiScript = await fs.readFile(injectApiScriptPath, 'utf-8');
    let script = await fs.readFile(scriptPath, 'utf-8');
    script = injectApiScript
        .replace('// ${executeScriptCode}', script)
        .replace('__output_file__', `"${jsxOutputFilePath}"`);

    const appleScriptsFolder = pathUtils.resolve(DATA_DIR, 'apple_scripts');
    await fs.mkdir(appleScriptsFolder, { recursive: true });
    const appleScriptPath = pathUtils.resolve(appleScriptsFolder, `ae-command-${uuid}.scpt`);
    const appleScript = `tell application "${ae}"
    DoScript "${esc(script, { quotes: 'double' })}"
    end tell`;
    await Promise.all([
        await fs.writeFile(jsxOutputFilePath, '', 'utf-8'),
        await fs.writeFile(appleScriptPath, appleScript, 'utf-8'),
    ]);
    await execa('osascript', [appleScriptPath]);

    const output = await fs.readFile(jsxOutputFilePath, 'utf-8');
    let result: any;
    try {
        result = JSON.parse(output);
    } catch {
        result = output;
    }
    await Promise.all([fs.rm(appleScriptPath), fs.rm(jsxOutputFilePath)]);

    return result;
}

export default evalFile;
