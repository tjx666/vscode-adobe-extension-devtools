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

export async function replaceActiveEditorSelectionsText(
    getReplaceTextList: (selectionsTextList: string[]) => Promise<string[]>,
) {
    const editor = window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const selections = editor.selections;
    const selectedTextList = selections.map((s) => document.getText(s));
    const replaceTextList = await getReplaceTextList(selectedTextList);
    await editor.edit((editBuilder) => {
        replaceTextList.forEach((replaceText, index) =>
            editBuilder.replace(selections[index], String(replaceText)),
        );
    });
}
