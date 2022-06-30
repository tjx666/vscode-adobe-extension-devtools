import { DescriptorInfoEditor } from './descriptorInfoEditor';
import { getLayerDescriptorInfo } from './utils';

class LayerInfoEditor extends DescriptorInfoEditor {
    title = 'Layer Info';

    async getDescriptorInfo() {
        return getLayerDescriptorInfo();
    }
}

export const layerInfoEditor = new LayerInfoEditor();
