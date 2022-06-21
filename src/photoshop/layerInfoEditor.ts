import path from 'path';
import vscode from 'vscode';

import { JSX_DIR } from '../constants';
import { dateFormat } from '../utils/common';
import evalFile from '../utils/evalJsx';

class LayerInfoEditor {
    async getLatestLayerInfo() {
        return evalFile(
            'PS',
            path.resolve(JSX_DIR, 'photoshop/service/getLayerDescriptorInfo.jsx'),
        );
    }

    async open() {
        const createdTimeStr = dateFormat(new Date(), '%H:%M:%S', false);
        const latestLayerDescriptorInfo = await this.getLatestLayerInfo();
        const document = await vscode.workspace.openTextDocument(
            vscode.Uri.parse(`untitled:/Layer Descriptor Info`),
        );
        const layerInfoJSON = JSON.stringify(latestLayerDescriptorInfo, null, 4);
        const text = `// ${createdTimeStr}
${layerInfoJSON}`;
        const editor = await vscode.window.showTextDocument(document);
        await editor.edit((editBuilder) => {
            const firstLine = document.lineAt(0);
            const lastLine = document.lineAt(document.lineCount - 1);
            const wholeTextRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
            editBuilder.replace(wholeTextRange, text);
        });
        await vscode.languages.setTextDocumentLanguage(document, 'jsonc');
    }
}

export const layerInfoEditor = new LayerInfoEditor();
