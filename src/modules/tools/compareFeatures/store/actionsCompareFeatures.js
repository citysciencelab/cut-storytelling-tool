export default {
    /**
     * Sets the zoom level to the map.
     * @param {Object} _ actions context object.
     * @param {Object} gfiFeature - feature
     * @returns {void}
     */
    isFeatureOnCompareList: function ({state, commit, dispatch, getters}, gfiFeature) {
        const layerId = gfiFeature.layerId;

        if (state.layerFeatures[layerId] === undefined) {
            if (!getters.isFeatureSelected(gfiFeature)) {
                commit("addFeatureToLayer", gfiFeature);
                for (const feature of state.layerFeatures[layerId]) {
                    dispatch("prepareFeatureListToShow", feature);
                }
                // dispatch("prepareTableBody", state.layerFeatures[layerId]);
            }
        }
        else if (state.layerFeatures[layerId] !== undefined) {
            if (!getters.isFeatureSelected(gfiFeature) && state.layerFeatures[layerId].length < state.numberOfFeaturesToShow) {
                commit("addFeatureToLayer", gfiFeature);
                for (const feature of state.layerFeatures[layerId]) {
                    dispatch("prepareFeatureListToShow", feature);
                }
                // dispatch("prepareTableBody", state.layerFeatures[layerId]);
            }
        }
    },
    removeFeature: function ({state, dispatch}, gfiFeature) {
        const payload1 = {"features": state.preparedList[Object.keys(state.preparedList)[0]], "featureId": gfiFeature.featureId, "selectedLayer": gfiFeature.layerId},
            payload2 = {"features": state.preparedList[gfiFeature.layerId], "featureId": gfiFeature.featureId, "selectedLayer": gfiFeature.layerId};

        if (!state.hasMultipleLayers) {
            dispatch("removeFeatureFromPreparedList", payload1);
        }
        else {
            dispatch("removeFeatureFromPreparedList", payload2);
        }
    },
    /**
     * prepares the list for rendering using the 'gfiAttributes'
     * creates a JSON where an object matches to a row
     * one object attribute is created for each feature (column)
     * @param {object} gfiAttributes -
     * @returns {object[]} list - one object per row
     */
    prepareFeatureListToShow: function ({state}, gfiAttributes) {
        const list = [],
            // In reaction to modules/tools/gfi/model.js @ prepareVectorGfiParam(), only use 1st part of underscore delimited layerId
            layerId = parseInt(gfiAttributes.layerId.split("_")[0], 10),
            featureList = state.layerFeatures[layerId];

        Object.keys(gfiAttributes.properties).forEach(function (key) {
            const row = {};

            row["col-1"] = key;
            featureList.forEach(function (feature) {
                row[feature.featureId] = feature.properties[key];
            });
            list.push(row);
        });

        state.preparedList[layerId] = list;
        return list;
    },
    // prepareTableBody: function ({state}, features) {
    //     const tableBody = [],
    //         rowsToShow = state.numberOfAttributesToShow;

    //     features.forEach(function (rowFeature, rowIndex) {
    //         const row = [];

    //         if (rowIndex < rowsToShow) {
    //             Object.keys(rowFeature.properties).forEach(function (key) {
    //                 if (typeof rowFeature.properties[key] === "undefined") {
    //                     row.push("");
    //                 }
    //                 else if (Array.isArray(rowFeature.properties[key])) {
    //                     row.push(String(rowFeature.properties[key]).replace(/,/g, ",\n"));
    //                 }
    //                 else {
    //                     row.push(String(rowFeature.properties[key]));
    //                 }
    //             });
    //             tableBody.push(row);
    //         }
    //     });
    //     return tableBody;
    // },
    removeFeatureFromPreparedList: function ({state, commit}, payload) {
        const key = payload.featureId,
            preparedList = payload.features,
            selected = payload.selectedLayer;

        if (!state.hasMultipleLayers) {
            for (const feature of state.layerFeatures[Object.keys(state.layerFeatures)[0]]) {
                if (feature.featureId === key) {
                    const index = state.layerFeatures[feature.layerId].indexOf(feature);

                    state.layerFeatures[feature.layerId].splice(index, 1);
                    if (state.layerFeatures[feature.layerId].length === 0) {
                        state.preparedList = {};
                        delete state.layerFeatures[feature.layerId];
                    }
                    else {
                        state.preparedList = {preparedList};
                    }
                }
            }
            for (const feature of preparedList) {
                if (Object.keys(feature).includes(key)) {
                    delete feature[key];
                }
            }
        }
        else {
            for (const feature of state.layerFeatures[selected]) {
                if (feature.featureId === key) {
                    const index = state.layerFeatures[feature.layerId].indexOf(feature);

                    state.layerFeatures[selected].splice(index, 1);
                }
                if (state.layerFeatures[selected].length === 0) {
                    delete state.preparedList[selected];
                    delete state.layerFeatures[selected];
                    commit("hasLayers");
                }
            }

            for (const feature of preparedList) {
                if (Object.keys(feature).includes(key)) {
                    delete feature[key];
                }
            }
        }
    }
};

