export interface ViewNode {
    type:
        | 'CompItem'
        | 'Layer'
        | 'PropertyGroup'
        | 'Property'
        | 'Keyframes'
        | 'Keyframe'
        | 'JsonValue';
}

export interface CompositionNode extends ViewNode {
    type: 'CompItem';
    id: number;
    name: string;
    path: any[];
    layers: LayerNode[];
}

export interface LayerNode extends ViewNode {
    type: 'Layer';
    layerType: string;
    path: number[];
    name: string;
    index: number;
    properties: Array<PropertyNode | PropertyGroupNode>;
}

export interface PropertyGroupNode extends ViewNode {
    type: 'PropertyGroup';
    index: number;
    name: string;
    matchName: string;
    path: Array<number | string>;
    properties: Array<PropertyNode | PropertyGroupNode>;
}

export interface PropertyNode extends ViewNode {
    type: 'Property';
    index: number;
    name: string;
    matchName: string;
    path: Array<number | string>;
    value?: any;
    keyframes?: KeyframesNode;
}

export interface KeyframesNode extends ViewNode {
    type: 'Keyframes';
    frames: KeyframeNode[];
}

export interface KeyframeNode extends ViewNode {
    type: 'Keyframe';
    path: Array<number | string>;
    index: number;
    time: number;
    value: any;
}

export interface JsonValueNode extends ViewNode {
    key: string;
    value: any;
}
