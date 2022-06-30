import vscode, { TextEditor, window } from 'vscode';

import { replaceEditorWholeText } from '../utils/editor';
import { createDescriptorInfoStr } from './utils';

export abstract class DescriptorInfoDiffEditor {
    abstract title: string;
    abstract getDescriptorInfo(): Promise<object>;

    async open() {
        const beforeEditorName = `Before ${this.title}`;
        const afterEditorName = `After ${this.title}`;

        const existedBeforeEditor: TextEditor | undefined = window.visibleTextEditors.find(
            (editor) => editor.document.fileName.includes(beforeEditorName),
        );

        let beforeEditor: TextEditor;
        if (existedBeforeEditor === undefined) {
            await vscode.commands.executeCommand(
                'vscode.diff',
                vscode.Uri.parse(`untitled:/${beforeEditorName}`),
                vscode.Uri.parse(`untitled:/${afterEditorName}`),
            );
            beforeEditor = window.visibleTextEditors.find((editor) =>
                editor.document.fileName.includes(beforeEditorName),
            )!;
        } else {
            beforeEditor = existedBeforeEditor;
        }

        const afterEditor: TextEditor | undefined = window.visibleTextEditors.find((editor) =>
            editor.document.fileName.includes(afterEditorName),
        )!;

        const createdTime = new Date();
        const latestLayerInfo = await this.getDescriptorInfo();
        const text = createDescriptorInfoStr(createdTime, latestLayerInfo);
        const isBeforeEmpty = beforeEditor.document.getText().trim() === '';
        const isAfterEmpty = afterEditor.document.getText().trim() === '';
        if (!isAfterEmpty) {
            await replaceEditorWholeText(beforeEditor, afterEditor.document.getText());
            await replaceEditorWholeText(afterEditor, text);
        } else {
            if (isBeforeEmpty) {
                await replaceEditorWholeText(beforeEditor, text);
            } else {
                await replaceEditorWholeText(afterEditor, text);
            }
        }

        await vscode.languages.setTextDocumentLanguage(beforeEditor.document, 'jsonc');
        await vscode.languages.setTextDocumentLanguage(afterEditor.document, 'jsonc');
    }
}
