import vscode from 'vscode';

import {  replaceEditorWholeText } from '../utils/editor';
import { createDescriptorInfoStr } from './utils';

export abstract class DescriptorInfoEditor {
    abstract title: string;
    abstract getDescriptorInfo(): Promise<object>;

    async open() {
        const createdTime = new Date();
        const descriptorInfo = await this.getDescriptorInfo();
        const text = createDescriptorInfoStr(createdTime, descriptorInfo);

        const document = await vscode.workspace.openTextDocument(
            vscode.Uri.parse(`untitled:/${this.title}`),
        );
        const editor = await vscode.window.showTextDocument(document);
        await replaceEditorWholeText(editor, text);
        await vscode.commands.executeCommand('editor.foldLevel2');
        // !: wait vscode to fix https://github.com/microsoft/vscode/issues/152776
        await vscode.languages.setTextDocumentLanguage(document, 'jsonc');
    }
}
