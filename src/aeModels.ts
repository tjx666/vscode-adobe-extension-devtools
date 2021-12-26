class AeNode {
    type: 'Composition' | 'Layer';
    name: string;
    index: number;
}

class Composition extends AeNode {
    id: number;
}

class Layer extends AeNode {}

class PropertyBase {
    enabled: boolean;
    isModified: boolean;
    selected: boolean;
    propertyIndex: number;
    propertyDepth: number;
    parentProperty: PropertyBase;
    propertyType: number;
    name: string;
}

class PropertyGroup extends PropertyBase {
    numProperties: number;
}

class Property extends PropertyBase {
    valueType: number;
    propertyValueType: number;
}
