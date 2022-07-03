import vscode from 'vscode';

import { replaceEditorWholeText } from '../utils/editor';
import { invokePsService } from './utils';

export async function viewSystemInfo() {
    const document = await vscode.workspace.openTextDocument(
        vscode.Uri.parse(`untitled:/Photoshop System Info`),
    );
    const editor = await vscode.window.showTextDocument(document);
    const systemInfo = (await invokePsService<any>('getSystemInfo')).systemInfo;
    await replaceEditorWholeText(editor, systemInfo);
    await vscode.languages.setTextDocumentLanguage(document, 'properties');
}
