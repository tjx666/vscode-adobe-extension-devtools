import { DescriptorInfoEditor } from './descriptorInfoEditor';
import { getDocumentDescriptorInfo } from './utils';

class DocumentInfoEditor extends DescriptorInfoEditor {
    title = 'Document Info';

    async getDescriptorInfo() {
        return getDocumentDescriptorInfo();
    }
}

export const documentInfoEditor = new DocumentInfoEditor();
