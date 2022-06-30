import path from 'path';
import configuration from '../configuration';
import { JSX_DIR } from '../constants';
import { arrangeKeys, dateFormat } from '../utils/common';
import evalFile, { EvalOptions } from '../utils/evalJsx';

export function createDescriptorInfoStr(time: Date, layerInfo: object) {
    const layerInfoJSON = JSON.stringify(layerInfo, null, 4);
    if (!configuration.ps.descriptorInfoInsertTimeStr) {
        return layerInfoJSON;
    }

    const createdTimeStr = dateFormat(time, '%H:%M:%S', false);
    return `// ${createdTimeStr}\n` + layerInfoJSON;
}

export async function invokePsService<T>(serviceFileBaseName: string, options?: EvalOptions) {
    const result = await evalFile(
        'PS',
        path.resolve(JSX_DIR, `photoshop/service/${serviceFileBaseName}.jsx`),
        options,
    );
    return result as T;
}

export async function getLayerDescriptorInfo() {
    return invokePsService<object>('getLayerDescriptorInfo');
}

export async function getDocumentDescriptorInfo() {
    let documentDescriptorInfoObject = await invokePsService<any>('getDocumentDescriptorInfo');
    if (typeof documentDescriptorInfoObject === 'object') {
        documentDescriptorInfoObject = arrangeKeys(
            documentDescriptorInfoObject,
            [
                'title',
                'documentID',
                'itemIndex',
                'count',
                'numberOfLayers',
                'width',
                'height',
                'selection',
                'fileReference',
            ],
            ['histogram'],
        );
    }
    return documentDescriptorInfoObject;
}
