import { DescriptorInfoDiffEditor } from './descriptorInfoDiffEditor';
import { getLayerDescriptorInfo } from './utils';

class LayerInfoDiffEditor extends DescriptorInfoDiffEditor {
    title = 'Layer Info';

    getDescriptorInfo(): Promise<object> {
        return getLayerDescriptorInfo();
    }
}

export const layerInfoDiffEditor = new LayerInfoDiffEditor();
