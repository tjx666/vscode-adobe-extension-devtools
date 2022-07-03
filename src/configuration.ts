import vscode, { ExtensionContext } from 'vscode';

interface PsConfiguration {
    descriptorInfoInsertTimeStr: boolean;
    includeXMPNamespaces: string[];
}

class Configuration {
    displayedLayerProperties: string[] = [];
    excludePropertyPaths: string[] = [];
    showEmptyPropertyGroup = false;
    aeAppPath: string | undefined;
    psAppFolderPath: string | undefined;
    globalStoragePath = '';
    ps: PsConfiguration = {
        descriptorInfoInsertTimeStr: true,
        includeXMPNamespaces: [],
    };

    constructor() {
        this.update();
    }

    update(extensionContext?: ExtensionContext) {
        if (extensionContext) {
            this.globalStoragePath = extensionContext.globalStorageUri.fsPath;
        }

        const latestConfiguration = vscode.workspace.getConfiguration('adobeExtensionDevtools');
        this.displayedLayerProperties =
            latestConfiguration.get('aeCompositionOutline.displayedLayerProperties') ?? [];
        this.excludePropertyPaths =
            latestConfiguration.get('aeCompositionOutline.excludePropertyPaths') ?? [];
        this.showEmptyPropertyGroup =
            latestConfiguration.get('aeCompositionOutline.showEmptyPropertyGroup') ?? false;
        this.aeAppPath = latestConfiguration.get('aeAppPath');
        this.psAppFolderPath = latestConfiguration.get('psAppFolderPath');
        this.ps.descriptorInfoInsertTimeStr =
            latestConfiguration.get('ps.descriptorInfoInsertTimeStr') ?? true;
        this.ps.includeXMPNamespaces = latestConfiguration.get('ps.includeXMPNamespaces') ?? [];
    }
}

const configuration = new Configuration();
export default configuration;
