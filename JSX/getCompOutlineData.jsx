(function () {
    'use strict';

    function isLayer(object) {
        return 'nullLayer' in object;
    }

    /**
     * @param {PropertyValueType} propertyValueType
     * @param {any} value
     */
    function parsePropertyValue(propertyValueType, value) {
        if (propertyValueType === PropertyValueType.NO_VALUE) {
            return null;
        } else if (propertyValueType === PropertyValueType.TEXT_DOCUMENT) {
            return {};
        }

        return value;
    }

    /**
     * @param {Property} property
     * @param {Array<number|string>} path
     * @returns
     */
    function getKeyframes(property, path) {
        var keyframes = [];
        for (var i = 1; i <= property.numKeys; i++) {
            keyframes.push({
                type: 'Keyframe',
                path: path.concat(i),
                index: i,
                time: property.keyTime(i),
                value: parsePropertyValue(property.propertyType, property.keyValue(i)),
            });
        }
        return {
            type: 'Keyframes',
            frames: keyframes,
        };
    }

    /**
     * @param {AVLayer|PropertyGroup|Property} layer
     */
    function getProperties(layer, path) {
        var containsProperties = layer.numProperties !== undefined;
        var displayProperties = ['ADBE Transform Group'];
        /** @type {Property} */
        var property;
        var matchName;
        var currentPath;
        var result;

        if (!containsProperties) {
            property = layer;
            matchName = layer.matchName;
            currentPath = path.concat(matchName);
            result = {
                type: 'Property',
                index: property.propertyIndex,
                name: property.name,
                matchName: matchName,
                path: currentPath,
            };

            var containsKeyframe = !!property.numKeys;
            if (containsKeyframe) {
                result.keyframes = getKeyframes(property, currentPath);
            } else {
                result.value = parsePropertyValue(property.propertyType, property.value);
            }

            return result;
        }

        var isRealLayer = isLayer(layer);
        var i, j;
        var shouldDisplay;
        if (isRealLayer) {
            result = [];
            for (i = 1; i <= layer.numProperties; i++) {
                property = layer.property(i);
                shouldDisplay = property.enabled;
                if (shouldDisplay) {
                    for (j = 0; j < displayProperties.length; j++) {
                        if (property.matchName === displayProperties[j]) {
                            break;
                        }
                    }
                }
                if (j === displayProperties.length) {
                    shouldDisplay = false;
                }

                if (shouldDisplay) {
                    result.push(getProperties(property, path));
                }
            }
        } else {
            matchName = layer.matchName;
            currentPath = path.concat(matchName);
            result = {
                type: 'PropertyGroup',
                index: layer.propertyIndex,
                name: layer.name,
                matchName: matchName,
                path: currentPath,
                properties: [],
            };

            for (i = 1; i <= layer.numProperties; i++) {
                property = layer.property(i);
                if (property.enabled) result.properties.push(getProperties(property, currentPath));
            }
        }

        return result;
    }

    function getCompOutlineData() {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return null;

        var compData = {
            type: 'CompItem',
            id: comp.id,
            name: comp.name,
            path: [],
            layers: [],
        };

        var j, layer, layerData, layerPath;
        for (j = 1; j <= comp.numLayers; j++) {
            layer = comp.layers[j];
            layerPath = [layer.index];
            layerData = {
                type: 'Layer',
                path: layerPath,
                name: layer.name,
                index: layer.index,
                properties: getProperties(layer, layerPath),
            };
            compData.layers.push(layerData);
        }

        return compData;
    }

    function main() {
        print(JSON.stringify(getCompOutlineData()));
    }

    main();
})();
