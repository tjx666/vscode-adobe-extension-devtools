import { DescriptorInfoDiffEditor } from './descriptorInfoDiffEditor';
import { getApplicationDescriptorInfo } from './utils';

class ApplicationInfoDiffEditor extends DescriptorInfoDiffEditor {
    title = 'Application Info';

    getDescriptorInfo(): Promise<object> {
        return getApplicationDescriptorInfo();
    }
}

export const applicationInfoDiffEditor = new ApplicationInfoDiffEditor();
