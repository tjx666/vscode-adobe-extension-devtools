import vscode from 'vscode';
import { ViewNode } from './aeModels';

import CompositionOutlineProvider from './compositionOutline';
import configuration from './configuration';
import JsxModuleDefinitionProvider from './jsxModuleDefinitionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log(`Activate extension ${context.extension.id}`);

    configuration.update(context);

    const jsxModuleDefinitionProvider = vscode.languages.registerDefinitionProvider(
        ['javascript'],
        new JsxModuleDefinitionProvider(),
    );
    context.subscriptions.push(jsxModuleDefinitionProvider);

    const compositionOutlineProvider = new CompositionOutlineProvider();
    vscode.window.createTreeView('aeCompositionOutline', {
        treeDataProvider: compositionOutlineProvider,
        showCollapseAll: true,
    });
    vscode.commands.registerCommand('adobeExtensionDevtools.refreshAeCompositionOutline', () =>
        compositionOutlineProvider.refresh(),
    );
    vscode.commands.registerCommand('adobeExtensionDevtools.copyPropertyPath', (node: ViewNode) =>
        compositionOutlineProvider.copyPropertyPath(node),
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
    // nothing to do for now
}
