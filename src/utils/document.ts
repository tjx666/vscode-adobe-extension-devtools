import { Uri, workspace, window } from 'vscode';

export async function openDocument(document: Uri): Promise<void> {
    const textDocument = await workspace.openTextDocument(document);
    await window.showTextDocument(textDocument);
}
