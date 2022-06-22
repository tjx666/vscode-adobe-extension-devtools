import path from 'path';
import { JSX_DIR } from '../constants';
import { dateFormat } from '../utils/common';
import evalFile, { EvalOptions } from '../utils/evalJsx';

export async function getLatestLayerInfo() {
    return evalFile('PS', path.resolve(JSX_DIR, 'photoshop/service/getLayerDescriptorInfo.jsx'));
}

export function createLayerInfoStr(time: Date, layerInfo: object) {
    const createdTimeStr = dateFormat(time, '%H:%M:%S', false);
    const layerInfoJSON = JSON.stringify(layerInfo, null, 4);
    return `// ${createdTimeStr}\n` + layerInfoJSON;
}

export async function invokePsService<T>(serviceFileBaseName: string, options: EvalOptions) {
    const result = await evalFile(
        'PS',
        path.resolve(JSX_DIR, `photoshop/service/${serviceFileBaseName}.jsx`),
        options,
    );
    return result as T;
}
