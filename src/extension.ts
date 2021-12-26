import { resolve } from 'path';
import vscode from 'vscode';

import evalFile from './aeScript';
import { JSX_DIR } from './constants';
import JsxModuleDefinitionProvider from './jsxModuleDefinitionProvider';

async function test() {
    const scriptPath = resolve(JSX_DIR, 'getProjectOutlineData.jsx');
    const result = await evalFile(scriptPath);
    console.log(result);
}

export function activate(context: vscode.ExtensionContext) {
    console.log(`Activate extension ${context.extension.id}`);

    const jsxModuleDefinitionProvider = vscode.languages.registerDefinitionProvider(
        ['javascript'],
        new JsxModuleDefinitionProvider(),
    );

    context.subscriptions.push(jsxModuleDefinitionProvider);

    test();
}

// this method is called when your extension is deactivated
export function deactivate() {
    // nothing to do for now
}
