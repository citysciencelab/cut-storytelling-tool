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
     * Adds the layer model briefly to the model to run prepareLayerObject and then removes the model again.
     * @param {Object} _ the vuex state.
     * @param {String} layerId Id of the layer
     * @returns {void}
     */
    addLayerModel: (_, layerId) => {
        Radio.trigger("ModelList", "addModelsByAttributes", {id: layerId});
    },

    /**
     * Checks if all layers that the layerSlider should use are also defined.
     * Non-existing layers are removed.
     * @param {Object[]} layerIds The configuration of the layers from config.json.
     * @returns {void}
     */
    checkIfAllLayersAvailable: ({commit, dispatch}, layerIds) => {
        const validLayerIds = [];

        layerIds.forEach((layer) => {
            if (Radio.request("ModelList", "getModelsByAttributes", {id: layer.layerId}).length === 0) {
                dispatch("addLayerModel", layer.layerId);
                if (Radio.request("ModelList", "getModelsByAttributes", {id: layer.layerId}).length > 0) {
                    validLayerIds.push(layer);
                }
                else {
                    console.error(`The configuration of the LayerSlider tool is invalid. The layer with the id: "${layer.layerId}" must be configured in the "Themenconfig".`);
                }
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
    sendModification: (_, {layerId, status, transparency}) => {
        Radio.trigger("ModelList", "setModelAttributesById", layerId, {
            isSelected: status,
            isVisibleInMap: status,
            transparency: transparency || 0
        });
    },

    /**
     * Finds the activeLayerId based on the index and initiates storage.
     * @param {Number} index Index in layerIds.
     * @returns {void}
     */
    setActiveIndex: ({commit, dispatch, state}, index) => {
        commit("setActiveLayer", state.layerIds[index]);
        dispatch("toggleLayerVisibility", state.activeLayer.layerId);
    },

    /**
     * Determines the visibility of the layerIds
     * @param {String} activeLayerId Id des activeLayer.
     * @returns {void}
     */
    toggleLayerVisibility: ({dispatch, state}, activeLayerId) => {
        state.layerIds.forEach(layer => {
            dispatch("sendModification", {
                layerId: layer.layerId,
                status: layer.layerId === activeLayerId
            });
        });
    }
};
