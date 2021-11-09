export default {
    /**
     * Adds an index to the layer ids.
     * @param {Object[]} layerIds The configuration of the layers from config.json.
     * @returns {void}
     */
    addIndexToLayerIds: ({commit}, layerIds) => {
        const layerIdsWithIndex = layerIds.map((layerId, index) => {
            layerId.index = index;

            return layerId;
        });

        commit("setLayerIds", layerIdsWithIndex);
    },

    /**
     * Checks if the layer model already exists, non-existing layers are removed.
     * @param {Object[]} layerIds The configuration of the layers from config.json.
     * @returns {void}
     */
    removeNotExistingLayermodels: ({commit}, layerIds) => {
        const validLayerIds = [];

        layerIds.forEach((layer) => {
            if (Radio.request("ModelList", "getModelsByAttributes", {id: layer.layerId}).length === 0) {
                console.error(`The configuration of the LayerSlider tool is invalid. The layer with the id: "${layer.layerId}" must be configured in the "Themenconfig".`);
            }
            else {
                validLayerIds.push(layer);
            }
        });

        commit("setLayerIds", validLayerIds);
    },

    /**
     * Triggers the new visibility over the radio
     * @param {Object} _ the vuex state.
     * @param {String} layerId The layerId
     * @param {Boolean} status Visibility true / false
     * @param {Number} [transparency=0] Transparency of layer.
     * @returns {void}
     */
    sendModification: (_, {layerId, status, transparency = 0}) => {
        Radio.trigger("ModelList", "setModelAttributesById", layerId, {
            isSelected: status,
            isVisibleInMap: status,
            transparency: transparency
        });
    }
};
