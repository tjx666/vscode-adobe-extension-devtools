import fs from 'node:fs/promises';
import { Position, Range, Selection, TextEditor, Uri, window, workspace } from 'vscode';

export async function openDocument(document: Uri): Promise<void> {
    const textDocument = await workspace.openTextDocument(document);
    await window.showTextDocument(textDocument);
}

export function emptyEditorSelection(editor: TextEditor) {
    if (editor.selection) {
        const position = editor.selection.end;
        editor.selection = new Selection(position, position);
    }
}

export async function replaceEditorWholeText(
    editor: TextEditor,
    replace: string,
    emptySelection = true,
) {
    const editSuccess = await editor.edit((editBuilder) => {
        const document = editor.document;
        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const wholeTextRange = new Range(firstLine.range.start, lastLine.range.end);
        editBuilder.replace(wholeTextRange, replace);
    });

    if (editSuccess && emptySelection) {
        emptyEditorSelection(editor);
    }

    return editSuccess;
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

export async function getFileWholeRange(filePath: string) {
    const textContent = await fs.readFile(filePath, 'utf-8');
    const lines = textContent.split(/\r?\n/);
    const lastLine = lines.at(-1);
    return new Range(
        new Position(0, 0),
        new Position(
            Math.max(0, lines.length - 1),
            lastLine === undefined ? 0 : Math.max(0, lastLine.length - 1),
        ),
    );
}
