import pathUtils from 'path';
import vscode from 'vscode';

const EXTENSION_DIR = vscode.extensions.getExtension(
    'yutengjing.adobe-extension-devtools',
)!.extensionPath;
const JSX_DIR = pathUtils.resolve(EXTENSION_DIR, 'JSX');
const SYSTEM = process.platform === 'win32' ? 'Window' : 'MacOS';
const DEBUG_MODE = process.env.VSCODE_DEBUG_MODE === 'true';

export { EXTENSION_DIR, JSX_DIR, SYSTEM, DEBUG_MODE };
