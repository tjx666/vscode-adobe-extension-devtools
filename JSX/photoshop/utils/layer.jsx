vscDevtools.layer = (function(){
    /**
     * 获取图层的 ActionDescriptor
     * @param {number} id
     * @param {string} property
     * @returns {ActionDescriptor}
     */
     function getLayerDesc(id, property) {
        var layerReference = new ActionReference();
        if (typeof property !== 'undefined') {
            layerReference.putProperty(s2t('property'), s2t(property));
        }
        layerReference.putIdentifier(s2t('layer'), id);
        return executeActionGet(layerReference);
    }

    return {
        getLayerDesc: getLayerDesc
    }
})();