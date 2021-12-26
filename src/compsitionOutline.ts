import vscode, { TextDocument } from 'vscode';

interface Entry {
    type: 'CompItem' | 'Layer' | 'PropertyGroup' | 'Property' | 'value'
    path: Array<number|string>;
    value: number | boolean | string | number[] | TextDocument
}

export class CompositionOutlineProvider implements vscode.TreeDataProvider<Entry> {
    private _onDidChangeTreeData: vscode.EventEmitter<Entry | null> = new vscode.EventEmitter<
        Entry | null
    >();
    readonly onDidChangeTreeData: vscode.Event<Entry | null> = this._onDidChangeTreeData.event;

    getTreeItem(element: Entry): vscode.TreeItem | Thenable<vscode.TreeItem> {
        throw new Error('Method not implemented.');
    }
    
    getChildren(element?: Entry): vscode.ProviderResult<Entry[]> {
        throw new Error('Method not implemented.');
    }
}
