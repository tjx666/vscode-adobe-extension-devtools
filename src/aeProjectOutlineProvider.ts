import vscode from 'vscode';

export class JsonOutlineProvider implements vscode.TreeDataProvider<number> {
    private _onDidChangeTreeData: vscode.EventEmitter<number | null> = new vscode.EventEmitter<
        number | null
    >();
    readonly onDidChangeTreeData: vscode.Event<number | null> = this._onDidChangeTreeData.event;

    getTreeItem(element: number): vscode.TreeItem | Thenable<vscode.TreeItem> {
        throw new Error('Method not implemented.');
    }
    
    getChildren(element?: number): vscode.ProviderResult<number[]> {
        throw new Error('Method not implemented.');
    }
}
