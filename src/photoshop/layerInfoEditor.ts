import vscode from 'vscode';

import { replaceEditorWholeText } from '../utils/editor';
import { createLayerInfoStr, getLatestLayerInfo } from './utils';

class LayerInfoEditor {
    async open() {
        const createdTime = new Date();
        const latestLayerDescriptorInfo = await getLatestLayerInfo();
        const text = createLayerInfoStr(createdTime, latestLayerDescriptorInfo);

        const document = await vscode.workspace.openTextDocument(
            vscode.Uri.parse(`untitled:/Layer Info`),
        );
        const editor = await vscode.window.showTextDocument(document);
        await replaceEditorWholeText(editor, text);
        // !: wait vscode to fix https://github.com/microsoft/vscode/issues/152776
        await vscode.languages.setTextDocumentLanguage(document, 'jsonc');
    }
}

export const layerInfoEditor = new LayerInfoEditor();
