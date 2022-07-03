import fs from 'fs/promises';
import { resolve } from 'path';
import { parseStringPromise } from 'xml2js';
import getIn from '../../src/utils/common';

async function main() {
    const xmlStr = await fs.readFile(resolve(__dirname, './xmpMetadata.xml'), {
        encoding: 'utf-8',
    });
    const result = await parseStringPromise(xmlStr);
    const d = getIn(result, ['x:xmpmeta', 'rdf:RDF', 0, 'rdf:Description', 0], {});
    console.log(JSON.stringify(d, null, 4));
}

main();
