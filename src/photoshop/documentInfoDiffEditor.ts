import { DescriptorInfoDiffEditor } from './descriptorInfoDiffEditor';
import { getDocumentDescriptorInfo } from './utils';

class DocumentInfoDiffEditor extends DescriptorInfoDiffEditor {
    title = 'Document Info';

    getDescriptorInfo(): Promise<object> {
        return getDocumentDescriptorInfo();
    }
}

export const documentInfoDiffEditor = new DocumentInfoDiffEditor();
