import { resolve } from 'path';
import vscode, { MarkdownString, TreeItemCollapsibleState } from 'vscode';

import {
    CompositionNode,
    JsonValueNode,
    KeyframeNode,
    KeyframesNode,
    LayerNode,
    PropertyGroupNode,
    PropertyNode,
    ViewNode,
} from './aeModels';
import evalFile from './aeScript';
import configuration from './configuration';
import { JSX_DIR, SYSTEM } from './constants';
import { toFixed } from './utils';

export default class CompositionOutlineProvider implements vscode.TreeDataProvider<ViewNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<ViewNode | void> =
        new vscode.EventEmitter<ViewNode | void>();
    readonly onDidChangeTreeData: vscode.Event<ViewNode | void> = this._onDidChangeTreeData.event;

    private composition: CompositionNode | undefined | null;

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    copyPropertyPath(node: ViewNode) {
        if (node.type === 'PropertyGroup' || node.type === 'Property') {
            const propertyPath = (node as PropertyNode).path.slice(1).map((v) => {
                if (typeof v === 'string') {
                    return `'${v}'`;
                }
                return v;
            });
            vscode.env.clipboard.writeText(`[${propertyPath.join(', ')}]`);
        }
    }

    getTreeItem(node: ViewNode): vscode.TreeItem {
        if (node.type === 'Layer') {
            const layer = node as LayerNode;
            return {
                label: layer.name,
                tooltip: new MarkdownString('`Layer:` ' + layer.name),
                collapsibleState: TreeItemCollapsibleState.Collapsed,
                contextValue: 'Layer',
            };
        } else if (node.type === 'Property') {
            const property = node as PropertyNode;
            return {
                label: property.name,
                tooltip: new MarkdownString('`Property:` ' + property.matchName),
                collapsibleState: TreeItemCollapsibleState.Collapsed,
                contextValue: 'Property',
            };
        } else if (node.type === 'PropertyGroup') {
            const propertyGroup = node as PropertyGroupNode;
            return {
                label: propertyGroup.name,
                tooltip: new MarkdownString('`PropertyGroup:` ' + propertyGroup.matchName),
                collapsibleState: TreeItemCollapsibleState.Collapsed,
                contextValue: 'PropertyGroup',
            };
        } else if (node.type === 'Keyframes') {
            return {
                label: 'keyframes  [' + (node as KeyframesNode).frames.length + ']',
                collapsibleState: TreeItemCollapsibleState.Collapsed,
                contextValue: 'Keyframes',
            };
        } else if (node.type === 'Keyframe') {
            const keyframe = node as KeyframeNode;
            return {
                label: '[' + keyframe.index + `] - ${toFixed(keyframe.time)}`,
                collapsibleState: TreeItemCollapsibleState.Collapsed,
                contextValue: 'Keyframe',
            };
        } else if (node.type === 'JsonValue') {
            const jsonValue = node as JsonValueNode;
            if (Array.isArray(jsonValue.value)) {
                return {
                    label: jsonValue.key + ' [' + jsonValue.value.length + ']',
                    tooltip: jsonValue.value.toString(),
                    collapsibleState: TreeItemCollapsibleState.Collapsed,
                    contextValue: 'JsonValueArray',
                };
            } else if (jsonValue.value instanceof Object) {
                return {
                    label: jsonValue.key + ' {' + Object.keys(jsonValue.value).length + '}',
                    tooltip: JSON.stringify(jsonValue.value),
                    collapsibleState: TreeItemCollapsibleState.Collapsed,
                    contextValue: 'JsonValueObject',
                };
            } else {
                return {
                    label: `${jsonValue.key}: ${jsonValue.value}`,
                    tooltip: `${jsonValue.value}`,
                    collapsibleState: TreeItemCollapsibleState.None,
                    contextValue: 'JsonValue',
                };
            }
        }

        return {};
    }

    getJsonValueNodeChildren(jsonValueNode: JsonValueNode): ViewNode[] {
        if (Array.isArray(jsonValueNode.value)) {
            return jsonValueNode.value.map((e, i) => {
                return {
                    type: 'JsonValue',
                    key: `${i}`,
                    value: e,
                };
            });
        } else if (jsonValueNode.value instanceof Object) {
            return Object.keys(jsonValueNode.value).map((k) => {
                return {
                    type: 'JsonValue',
                    key: k,
                    value: jsonValueNode.value[k],
                };
            });
        } else {
            return [];
        }
    }

    async getChildren(node?: ViewNode): Promise<ViewNode[]> {
        // only support MacOS now
        if (SYSTEM === 'Window') return [];

        if (!node) {
            configuration.update();
            const scriptPath = resolve(JSX_DIR, 'getCompOutlineData.jsx');
            this.composition = await evalFile(scriptPath, {
                argumentObject: {
                    displayedLayerProperties: configuration.displayedLayerProperties,
                    excludePropertyPaths: configuration.excludePropertyPaths,
                },
            });
            if (this.composition === null) return [];

            const layers: LayerNode[] = this.composition!.layers;
            return layers;
        }

        if (node.type === 'Layer') {
            const properties = (node as LayerNode).properties;
            return properties;
        } else if (node.type === 'PropertyGroup') {
            const properties = (node as PropertyGroupNode).properties;
            return properties;
        } else if (node.type === 'Property') {
            const property = node as PropertyNode;
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
                        value: (node as JsonValueNode).value,
                    },
                ];
            }
            // contains keyframes
            else {
                return [...kys, keyframes as KeyframesNode];
            }
        } else if (node.type === 'Keyframes') {
            return (node as KeyframesNode).frames;
        } else if (node.type === 'Keyframe') {
            const keyframe = node as KeyframeNode;
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
        } else if (node.type === 'JsonValue') {
            return this.getJsonValueNodeChildren(node as JsonValueNode);
        }

        return [];
    }
}
