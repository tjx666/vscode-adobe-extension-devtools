import vscode from 'vscode';

class Configuration {
    displayedLayerProperties: string[] = [];
    excludePropertyPaths: string[] = [];
    showEmptyPropertyGroup = false;

    constructor() {
        this.update();
    }

    update() {
        const latestConfiguration = vscode.workspace.getConfiguration('adobeExtensionDevtools');
        this.displayedLayerProperties =
            latestConfiguration.get('aeCompositionOutline.displayedLayerProperties') ?? [];
        this.excludePropertyPaths =
            latestConfiguration.get('aeCompositionOutline.excludePropertyPaths') ?? [];
        this.showEmptyPropertyGroup =
            latestConfiguration.get('aeCompositionOutline.showEmptyPropertyGroup') ?? false;
    }
}

const configuration = new Configuration();

export default configuration;
