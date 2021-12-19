import vscode from 'vscode';
import JsxModuleDefinitionProvider from './jsxModuleDefinitionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log(`Activate extension ${context.extension.id}`);

    const jsxModuleDefinitionProvider = vscode.languages.registerDefinitionProvider(
        ['javascript'],
        new JsxModuleDefinitionProvider(),
    );

    context.subscriptions.push(jsxModuleDefinitionProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {
    // nothing to do for now
}
