import { resolve } from 'path';
import vscode, { TreeItemCollapsibleState } from 'vscode';
import {
    LayerNode,
    PropertyGroupNode,
    PropertyNode,
    ViewNode,
    KeyframeNode,
    JsonValueNode,
    CompositionNode,
    KeyframesNode,
} from './aeModels';
import evalFile from './aeScript';
import { JSX_DIR } from './constants';

export default class CompositionOutlineProvider implements vscode.TreeDataProvider<ViewNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<ViewNode | void> =
        new vscode.EventEmitter<ViewNode | null>();
    readonly onDidChangeTreeData: vscode.Event<ViewNode | void> = this._onDidChangeTreeData.event;

    private composition: CompositionNode;

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ViewNode): vscode.TreeItem {
        if (element.type === 'Layer') {
            return {
                label: 'Layer  ' + (element as LayerNode).name,
                collapsibleState: TreeItemCollapsibleState.Collapsed,
            };
        } else if (element.type === 'Property') {
            return {
                label: 'Property  ' + (element as PropertyNode).name,
                collapsibleState: TreeItemCollapsibleState.Collapsed,
            };
        } else if (element.type === 'PropertyGroup') {
            return {
                label: 'PropertyGroup  ' + (element as PropertyGroupNode).name,
                collapsibleState: TreeItemCollapsibleState.Collapsed,
            };
        } else if (element.type === 'Keyframes') {
            return {
                label: 'Keyframes  [' + (element as KeyframesNode).frames.length + ']',
                collapsibleState: TreeItemCollapsibleState.Collapsed,
            };
        } else if (element.type === 'Keyframe') {
            const keyframe = element as KeyframeNode;
            return {
                label: '[' + keyframe.index + `] - ${keyframe.time.toFixed(3)}`,
                collapsibleState: TreeItemCollapsibleState.Collapsed,
            };
        } else if (element.type === 'JsonValue') {
            const jsonValue = element as JsonValueNode;
            if (Array.isArray(jsonValue.value)) {
                return {
                    label: jsonValue.key + ' [' + jsonValue.value.length + ']',
                    collapsibleState: TreeItemCollapsibleState.Collapsed,
                };
            } else if (jsonValue.value instanceof Object) {
                return {
                    label: jsonValue.key + ' {' + Object.keys(jsonValue.value).length + '}',
                    collapsibleState: TreeItemCollapsibleState.Collapsed,
                };
            } else {
                return {
                    label: `${jsonValue.key}: ${jsonValue.value}`,
                    collapsibleState: TreeItemCollapsibleState.None,
                };
            }
        }
        return null;
    }

    getJsonValueChildren(jsonValue: JsonValueNode): ViewNode[] {
        if (Array.isArray(jsonValue.value)) {
            return jsonValue.value.map((e, i) => {
                return {
                    type: 'JsonValue',
                    key: `${i}`,
                    value: e,
                };
            });
        } else if (jsonValue.value instanceof Object) {
            return Object.keys(jsonValue.value).map((k) => {
                return {
                    type: 'JsonValue',
                    key: k,
                    value: jsonValue.value[k],
                };
            });
        } else {
            return [];
        }
    }

    async getChildren(element?: ViewNode): Promise<ViewNode[]> {
        if (!element) {
            const scriptPath = resolve(JSX_DIR, 'getCompOutlineData.jsx');
            this.composition = await evalFile(scriptPath);
            if (this.composition === null) return [];

            const layers: LayerNode[] = this.composition.layers;
            return layers;
        }

        if (element.type === 'Layer') {
            const properties = (element as LayerNode).properties;
            return properties;
        } else if (element.type === 'PropertyGroup') {
            const properties = (element as PropertyGroupNode).properties;
            return properties;
        } else if (element.type === 'Property') {
            const property = element as PropertyNode;
            const { value, keyframes } = property;
            const kys: JsonValueNode[] = [
                {
                    type: 'JsonValue',
                    key: 'index',
                    value: property.index,
                },
                {
                    type: 'JsonValue',
                    key: 'matchName',
                    value: property.matchName,
                },
            ];
            if (value !== undefined) {
                return [
                    ...kys,
                    {
                        type: 'JsonValue',
                        key: 'value',
                        value: (element as JsonValueNode).value,
                    },
                ];
            } else {
                return [...kys, keyframes as KeyframesNode];
            }
        } else if (element.type === 'JsonValue') {
            return this.getJsonValueChildren(element as JsonValueNode);
        } else if (element.type === 'Keyframes') {
            return (element as KeyframesNode).frames;
        } else if (element.type === 'Keyframe') {
            const keyframe = element as KeyframeNode;
            const kvs: JsonValueNode[] = [
                {
                    type: 'JsonValue',
                    key: 'index',
                    value: keyframe.index,
                },
                {
                    type: 'JsonValue',
                    key: 'time',
                    value: keyframe.time,
                },
                {
                    type: 'JsonValue',
                    key: 'value',
                    value: keyframe.value,
                },
            ];
            return kvs;
        }
    }
}
