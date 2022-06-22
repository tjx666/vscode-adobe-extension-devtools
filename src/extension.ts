import vscode, { workspace } from 'vscode';
import { JsonValueNode, PropertyGroupNode, PropertyNode } from './afterEffects/aeModels';

import CompositionOutlineProvider from './afterEffects/compositionOutline';
import configuration from './configuration';
import JsxModuleDefinitionProvider from './jsxModuleDefinitionProvider';
import { layerInfoDiffEditor } from './photoshop/layerInfoDiffEditor';
import { layerInfoEditor } from './photoshop/layerInfoEditor';

export function activate(context: vscode.ExtensionContext) {
    console.log(`Activate extension ${context.extension.id}`);

    configuration.update(context);
    workspace.onDidChangeConfiguration(() => {
        configuration.update(context);
    }, context.subscriptions);

    const compositionOutlineProvider = new CompositionOutlineProvider();
    vscode.window.createTreeView('aeCompositionOutline', {
        treeDataProvider: compositionOutlineProvider,
        showCollapseAll: true,
    });

    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            ['javascript'],
            new JsxModuleDefinitionProvider(),
        ),

        vscode.commands.registerCommand('adobeExtensionDevtools.refreshAeCompositionOutline', () =>
            compositionOutlineProvider.refresh(),
        ),

        vscode.commands.registerCommand(
            'adobeExtensionDevtools.copyPropertyPath',
            (node: PropertyNode | PropertyGroupNode) =>
                compositionOutlineProvider.copyPropertyPath(node),
        ),

        vscode.commands.registerCommand(
            'adobeExtensionDevtools.copyPropertyValue',
            (node: JsonValueNode) => compositionOutlineProvider.copyPropertyValue(node),
        ),

        vscode.commands.registerCommand('adobeExtensionDevtools.ps.viewLayerInfo', () =>
            layerInfoEditor.open(),
        ),

        vscode.commands.registerCommand('adobeExtensionDevtools.ps.viewLayerInfoDiff', () =>
            layerInfoDiffEditor.open(),
        ),
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
    // nothing to do for now
}
