export default {
    /**
     * Sets the zoom level to the map.
     * @param {Object} _ actions context object.
     * @param {Object} feature - feature
     * @returns {void}
     */
    isFeatureOnCompareList: function ({state, commit, getters}, gfiFeature) {

        if (!getters.isFeatureSelected(gfiFeature)) {
            commit("addFeatureToLayer", gfiFeature);
            console.log("getter wird von action angesteuert");
            console.log(state.layerFeatures);
        }
        // if (featureIndex === -1) {
        //     console.log(feature);
        // }
        // else {
        //     console.log(feature);
        // }
    },
    removeFeature: function ({state, commit}, gfiFeature) {
        console.log(state.layerFeatures);
        commit("removeFeatureFromLayer", gfiFeature);
    }
};

