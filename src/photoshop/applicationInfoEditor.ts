import { DescriptorInfoEditor } from './descriptorInfoEditor';
import { getApplicationDescriptorInfo } from './utils';

class ApplicationInfoEditor extends DescriptorInfoEditor {
    title = 'Application Info';

    async getDescriptorInfo() {
        return getApplicationDescriptorInfo();
    }
}

export const applicationInfoEditor = new ApplicationInfoEditor();
