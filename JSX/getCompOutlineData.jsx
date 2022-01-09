(function () {
    'use strict';

    var configuration = {
        displayedLayerProperties: [
            'ADBE Transform Group',
            'ADBE Audio Group',
            'ADBE Effect Parade',
            'ADBE Layer Styles',
            'ADBE Mask Parade',
            'ADBE Text Properties',
        ],
        excludePropertyPaths: [],
        showEmptyPropertyGroup: false,
    };

    if (typeof __adobeExtensionDevtools__ !== 'undefined') {
        configuration.displayedLayerProperties = args.displayedLayerProperties;
        configuration.excludePropertyPaths = args.excludePropertyPaths;
    }

    var LayerTypes = {
        Solid: 'Solid',
        Shape: 'Shape',
        Still: 'Still',
        Text: 'Text',
        Audio: 'Audio',
        Video: 'Video',
        ImageSequence: 'ImageSequence',
        NullObject: 'NullObject',
        PlaceholderStill: 'PlaceholderStill',
        PlaceholderVideo: 'PlaceholderVideo',
        PreCompose: 'PreCompose',
        Guide: 'Guide',
        Adjustment: 'Adjustment',
        Camera: 'Camera',
        Light: 'Light',
        Data: 'Data',
    };

    /**
     * @param {Layer} layer
     * @returns {keyof LayerType}
     */
    function resolveAVLayerType(layer) {
        var source = layer.source;
        if (source instanceof CompItem) {
            return LayerTypes.PreCompose;
        }

        var mainSource = source.mainSource;
        if (!layer.hasVideo) {
            if (layer.hasAudio) {
                return LayerTypes.Audio;
            } else {
                return LayerTypes.Data;
            }
        } else if (source.frameDuration < 1) {
            if (mainSource instanceof PlaceholderSource) {
                return LayerTypes.PlaceholderVideo;
            } else if (mainSource.isStill) {
                return LayerTypes.Still;
            }
            // ImageSequence Layer source name is xxx-[00000-000xx].xxx or xxx-{00000-000xx}.xxx
            else if (
                /[[{]\d+-\d+[}\]].\w+$/.test(source.name) ||
                /_\d{5}.\w+?$/.test(source.file.name)
            ) {
                return LayerTypes.ImageSequence;
            } else {
                return LayerTypes.Video;
            }
        } else if (source.frameDuration === 1) {
            if (mainSource instanceof PlaceholderSource) {
                return LayerTypes.PlaceholderStill;
            } else if (mainSource.color) {
                return LayerTypes.Solid;
            } else {
                return LayerTypes.Still;
            }
        }
    }

    /**
     * @param {Layer} layer
     * @returns {keyof LayerType}
     */
    function resolveLayerType(layer) {
        'use strict';

        var LayerConstructors = [AVLayer, CameraLayer, LightLayer, ShapeLayer, TextLayer];
        var result;

        if (layer.adjustmentLayer) {
            return LayerTypes.Adjustment;
        }

        if (layer.nullLayer) {
            return LayerTypes.NullObject;
        }

        var i;
        for (i = 0; i < LayerConstructors.length; i++) {
            if (layer instanceof LayerConstructors[i]) {
                result = LayerConstructors[i].name;
                break;
            }
        }
        if (result === 'AVLayer') {
            result = resolveAVLayerType(layer);
        } else if (result === 'CameraLayer') {
            result = LayerTypes.Camera;
        } else if (result === 'LightLayer') {
            result = LayerTypes.Light;
        } else if (result === 'ShapeLayer') {
            result = LayerTypes.Shape;
        } else if (result === 'TextLayer') {
            result = LayerTypes.Text;
        }
        return result;
    }

    function isLayer(object) {
        return 'nullLayer' in object;
    }

    /**
     * @param {Array<number|string>} path1
     * @param {Array<number|string>} path2
     * @returns {boolean}
     */
    function propertyPathEqual(path1, path2) {
        if (path1.length !== path2.length) return false;

        for (var i = 0, len = path1.length; i < len; i++) {
            if (path1[i] !== path2[i]) return false;
        }

        return true;
    }

    /**
     * @param {Property|PropertyGroup} property
     * @param {Array<number|string>} propertyPath
     * @returns {boolean}
     */
    function showProperty(property, propertyPath) {
        if (!configuration.showEmptyPropertyGroup && property.numProperties === 0) return false;

        var shouldDisplay = property.enabled;
        var i;

        if (shouldDisplay) {
            var isLayerProperty = propertyPath.length === 1;
            if (isLayerProperty) {
                for (i = 0; i < configuration.displayedLayerProperties.length; i++) {
                    if (configuration.displayedLayerProperties[i] === propertyPath[0]) {
                        break;
                    }
                }
            }
        } else {
            return false;
        }

        if (i === configuration.displayedLayerProperties.length) {
            return false;
        }

        for (i = 0; i < configuration.excludePropertyPaths.length; i++) {
            if (propertyPathEqual(configuration.excludePropertyPaths[i], propertyPath)) {
                return false;
            }
        }

        return true;
    }

    function getObjectKeys(object) {
        var isObject = object !== null && typeof object === 'object';
        if (!isObject) {
            throw new TypeError(object + ' is not object!');
        }

        var ownKeys = [];
        for (var key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                ownKeys.push(key);
            }
        }

        return ownKeys;
    }

    /**
     * @param {Property} property
     * @param {number} [keyIndex]
     */
    function parsePropertyValue(property, keyIndex) {
        var propertyValueType = property.propertyValueType;
        if (propertyValueType === PropertyValueType.NO_VALUE) {
            return null;
        }

        var value = keyIndex === undefined ? property.value : property.keyValue(keyIndex);
        if (propertyValueType === PropertyValueType.TEXT_DOCUMENT) {
            /** @type {TextDocument} */
            var textDocument = value;
            var obj = {};
            var textDocumentKeys = getObjectKeys(textDocument);
            for (var i = 0, key; i < textDocumentKeys.length; i++) {
                key = textDocumentKeys[i];
                if (!textDocument.boxText && (key === 'boxTextPos' || key === 'boxTextSize')) {
                    continue;
                } else if (key === 'strokeColor' && !textDocument.applyStroke) {
                    continue;
                } else if (key === 'fillColor' && !textDocument.applyFill) {
                    continue;
                } else {
                    obj[key] = textDocument[key];
                }
            }
            return obj;
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
                value: parsePropertyValue(property, i),
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
        /** @type {Property} */
        var property;
        var matchName;
        var currentPath;
        var result;
        var props;

        if (!containsProperties) {
            property = layer;
            matchName = layer.matchName;
            currentPath = path.concat(matchName);
            shouldDisplay = showProperty(property, currentPath.slice(1));
            if (!shouldDisplay) return null;

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
                result.value = parsePropertyValue(property);
            }

            return result;
        }

        var isRealLayer = isLayer(layer);
        var i;
        var shouldDisplay;
        if (isRealLayer) {
            result = [];
            for (i = 1; i <= layer.numProperties; i++) {
                property = layer.property(i);
                props = getProperties(property, path);
                if (props) {
                    result.push(props);
                }
            }
            return result;
        } else {
            matchName = layer.matchName;
            currentPath = path.concat(matchName);
            shouldDisplay = showProperty(layer, currentPath.slice(1));

            if (!shouldDisplay) return null;

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
                props = getProperties(property, currentPath);
                if (props) {
                    result.properties.push(props);
                }
            }

            return result;
        }
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
                layerType: resolveLayerType(layer),
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
        // $.writeln(JSON.stringify(getCompOutlineData(), null, 2));
    }

    main();
})();
