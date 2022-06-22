import { Uri, workspace, window, TextEditor, Range } from 'vscode';

export async function openDocument(document: Uri): Promise<void> {
    const textDocument = await workspace.openTextDocument(document);
    await window.showTextDocument(textDocument);
}

export async function replaceEditorWholeText(editor: TextEditor, replace: string) {
    return editor.edit((editBuilder) => {
        const document = editor.document;
        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const wholeTextRange = new Range(firstLine.range.start, lastLine.range.end);
        editBuilder.replace(wholeTextRange, replace);
    });
}
