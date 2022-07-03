import vscode from 'vscode';

import { replaceEditorWholeText } from '../utils/editor';
import { invokePsService } from './utils';

export async function viewXMPMetadataXML() {
    const document = await vscode.workspace.openTextDocument(
        vscode.Uri.parse(`untitled:/XMP Metadata`),
    );
    const editor = await vscode.window.showTextDocument(document);
    const XMPMetadataXML = (await invokePsService<any>('getXMPMetadataXML')).xmpMetadata;
    await replaceEditorWholeText(editor, XMPMetadataXML);
    await vscode.languages.setTextDocumentLanguage(document, 'xml');
}
