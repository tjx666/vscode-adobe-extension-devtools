import vscode from 'vscode';

class Configuration {
    displayedLayerProperties: string[] = [];
    excludePropertyPaths: string[] = [];

    constructor() {
        this.update();
    }

    update() {
        const latestConfiguration = vscode.workspace.getConfiguration('adobeExtensionDevtools');
        this.displayedLayerProperties =
            latestConfiguration.get('aeCompositionOutline.displayedLayerProperties') ?? [];
        this.excludePropertyPaths =
            latestConfiguration.get('aeCompositionOutline.excludePropertyPaths') ?? [];
    }
}

const configuration = new Configuration();

export default configuration;
