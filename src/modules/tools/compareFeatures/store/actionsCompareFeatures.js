export default {
    /**
     * Checks if feature is on compare list and adds it to the list when star icon gets clicked.
     * @param {Object} gfiFeature - feature
     * @returns {void}
     */
    isFeatureOnCompareList: function ({state, commit, dispatch, getters}, gfiFeature) {
        const {layerId} = gfiFeature;

        commit("setShowAlert", true);
        commit("setListFull", false);
        if (!getters.isFeatureSelected(gfiFeature) && state.layerFeatures[layerId] === undefined || state.layerFeatures[layerId].length < state.numberOfFeaturesToShow) {
            commit("addFeatureToLayer", gfiFeature);
            commit("setCurrentFeatureName", gfiFeature.properties.Name || gfiFeature.properties.name);
            commit("setSelectedLayer", gfiFeature.layerId);
            for (const feature of state.layerFeatures[layerId]) {
                dispatch("prepareFeatureListToShow", feature);
            }
        }
        else {
            commit("setListFull", true);
        }
    },
    /**
     * Removes the feature if star icon is clicked.
     * @param {Object} gfiFeature - feature
     * @returns {void}
     */
    removeFeature: function ({state, commit}, gfiFeature) {
        const features = state.hasMultipleLayers ? state.preparedList[gfiFeature.layerId] : state.preparedList[Object.keys(state.preparedList)[0]];

        commit("removeFeatureFromPreparedList", {features: features, featureId: gfiFeature.featureId, selectedLayer: gfiFeature.layerId});
    },
    /**
     * prepares the list for rendering using the 'gfiAttributes'
     * one object attribute is created for each feature (column)
     * the feature with the most attributes dictates the number of infos that are shown.
     * @param {object} gfiAttributes -
     * @returns {object[]} list - one object per row
     */
    prepareFeatureListToShow: function ({state, commit}, gfiAttributes) {
        const list = [],
            layerId = parseInt(gfiAttributes.layerId.split("_")[0], 10),
            featureList = state.layerFeatures[layerId],
            lengths = [];
        let payload = {},
            indexOfFeatureWithMostAttributes = "";

        Object.values(featureList).forEach(element => {
            lengths.push(Object.keys(element.properties).length);
        });
        indexOfFeatureWithMostAttributes = lengths.indexOf(Math.max(...lengths));
        Object.keys(featureList[indexOfFeatureWithMostAttributes].properties).forEach(function (key) {
            const row = {"col-1": key};

            featureList.forEach(function (feature) {
                row[feature.featureId] = feature.properties[key];
            });
            list.push(row);
        });
        payload = {
            a: layerId,
            b: list
        };
        commit("setHasFeatures", true);
        commit("setList", payload);
    }
};

