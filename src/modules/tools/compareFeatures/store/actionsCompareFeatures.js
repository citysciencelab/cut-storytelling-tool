export default {
    /**
     * Sets the zoom level to the map.
     * @param {Object} _ actions context object.
     * @param {Object} gfiFeature - feature
     * @returns {void}
     */
    isFeatureOnCompareList: function ({state, commit, getters}, gfiFeature) {
        const layerId = gfiFeature.layerId;


        if (state.layerFeatures[layerId] === undefined) {
            if (!getters.isFeatureSelected(gfiFeature)) {
                commit("addFeatureToLayer", gfiFeature);
            }
        }
        else if (state.layerFeatures[layerId] !== undefined) {
            if (!getters.isFeatureSelected(gfiFeature) && state.layerFeatures[layerId].length < state.numberOfFeaturesToShow) {
                commit("addFeatureToLayer", gfiFeature);
            }
        }
    },
    removeFeature: function ({commit}, gfiFeature) {
        commit("removeFeatureFromLayer", gfiFeature);
    },
    selectLayerWithFeatures: function ({state}, selectedLayer) {
        state.layerWithFeaturesToShow = [];
        state.layerWithFeaturesToShow.push(state.layerFeatures[selectedLayer]);
        console.log(state.layerFeatures[selectedLayer]);
    }
};

