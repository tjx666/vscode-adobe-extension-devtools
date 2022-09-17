import vscode from 'vscode';
import { parseStringPromise } from 'xml2js';

import configuration from '../configuration';
import { getIn } from '../utils/common';
import { replaceEditorWholeText } from '../utils/editor';
import { invokePsService } from './utils';

export async function viewXMPMetadata() {
    const document = await vscode.workspace.openTextDocument(
        vscode.Uri.parse(`untitled:/XMP Metadata`),
    );
    const editor = await vscode.window.showTextDocument(document);
    const XMPMetadataXML = (await invokePsService<any>('getXMPMetadataXML')).xmpMetadata;
    const result = await parseStringPromise(XMPMetadataXML);
    const namespaces = configuration.ps.includeXMPNamespaces;

    if (namespaces.length === 0) {
        vscode.window.showErrorMessage(
            'You may forget to set adobeExtensionDevtools.ps.includeXMPNamespaces!',
        );
    }

    const data = getIn<Record<string, string[]>>(
        result,
        ['x:xmpmeta', 'rdf:RDF', 0, 'rdf:Description', 0],
        {},
    );
    const metadata: Record<string, Record<string, string>> = {};
    for (const namespace of namespaces) {
        for (const [key, value] of Object.entries(data)) {
            if (!Reflect.has(metadata, namespace)) {
                metadata[namespace] = {};
            }

            if (key.startsWith(namespace)) {
                metadata[namespace][key] = value[0];
            }
        }
    }
    await replaceEditorWholeText(editor, JSON.stringify(metadata, null, 4));
    await vscode.languages.setTextDocumentLanguage(document, 'json');
}
