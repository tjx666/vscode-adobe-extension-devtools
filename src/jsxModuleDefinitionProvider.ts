import pathUtils from 'path';
import type {
  CancellationToken,
  DefinitionLink,
  DefinitionProvider,
  TextDocument,
} from 'vscode';
import { Position, Range, Uri } from 'vscode';

import { pathExists } from './utils/common';
import { getFileWholeRange } from './utils/editor';

class JsxModuleDefinitionProvider implements DefinitionProvider {
    async provideDefinition(
        document: TextDocument,
        position: Position,
        _token: CancellationToken,
    ): Promise<DefinitionLink[] | undefined> {
        const { fileName } = document;
        // only support javascript file which extension is .jsx
        if (!fileName || !fileName.endsWith('.jsx')) return;

        const directory = pathUtils.dirname(fileName);
        const line = document.lineAt(position);
        const lineText = line.text;
        // see https://extendscript.docsforadobe.dev/extendscript-tools-features/preprocessor-directives.html#include-file
        // eslint-disable-next-line no-useless-escape
        const jsxImportCommentRegexp = /^\s*\/\/\s*@include\s+['"]([.\\\/\w]+\.jsx)['"]\s*$/;
        const matchResult = lineText.match(jsxImportCommentRegexp);
        if (!matchResult) return;

        const modulePath = matchResult[1];
        const definitionFilePath = pathUtils.resolve(directory, modulePath);

        if (await pathExists(definitionFilePath)) {
            const modulePathIndex = lineText.indexOf(modulePath);
            const startPosition = new Position(line.range.start.line, modulePathIndex);
            const endPosition = new Position(
                line.range.start.line,
                modulePathIndex + modulePath.length,
            );
            const definitionLink: DefinitionLink = {
                originSelectionRange: new Range(startPosition, endPosition),
                targetUri: Uri.file(definitionFilePath),
                targetRange: await getFileWholeRange(definitionFilePath),
            };

            return [definitionLink];
        }

        return undefined;
    }
}

export default JsxModuleDefinitionProvider;
