import { homedir } from 'os';
import pathUtils from 'path';
import vscode from 'vscode';

const DATA_DIR = pathUtils.resolve(homedir(), '.adobe-extension-devtools');
const EXTENSION_DIR = vscode.extensions.getExtension(
    'yutengjing.adobe-extension-devtools',
)!.extensionPath;
const JSX_DIR = pathUtils.resolve(EXTENSION_DIR, 'JSX');
const SYSTEM = process.platform === 'win32' ? 'Window': 'MacOS'

export { DATA_DIR, EXTENSION_DIR, JSX_DIR, SYSTEM };
