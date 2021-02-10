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
                dispatch("prepareTableBody", state.layerFeatures[layerId]);
            }
        }
        else if (state.layerFeatures[layerId] !== undefined) {
            if (!getters.isFeatureSelected(gfiFeature) && state.layerFeatures[layerId].length < state.numberOfFeaturesToShow) {
                commit("addFeatureToLayer", gfiFeature);
                for (const feature of state.layerFeatures[layerId]) {
                    dispatch("prepareFeatureListToShow", feature);
                }
                dispatch("prepareTableBody", state.layerFeatures[layerId]);
            }
        }
    },
    removeFeature: function ({commit, state, dispatch}, gfiFeature) {
        const layerId = gfiFeature.layerId;

        commit("removeFeatureFromLayer", gfiFeature);
        if (state.layerFeatures[layerId] !== undefined) {
            for (const feature of state.layerFeatures[layerId]) {
                dispatch("prepareFeatureListToShow", feature);
            }
        }
        else if (state.layerFeatures[layerId] !== undefined) {
            state.preparedList = [];
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

        console.log(gfiAttributes);
        Object.keys(gfiAttributes.properties).forEach(function (key) {
            const row = {};

            row["col-1"] = key;
            featureList.forEach(function (feature, index) {
                row["col-" + (index + 2)] = feature.properties[key];
            });
            list.push(row);
        });
        state.preparedList[layerId] = list;
        console.log(state.preparedList);
        console.log(list);
        return list;
    },
    prepareTableBody: function ({state}, features) {
        const tableBody = [],
            rowsToShow = state.numberOfAttributesToShow;

        features.forEach(function (rowFeature, rowIndex) {
            const row = [];

            if (rowIndex < rowsToShow) {
                Object.keys(rowFeature.properties).forEach(function (key) {
                    if (typeof rowFeature.properties[key] === "undefined") {
                        row.push("");
                    }
                    else if (Array.isArray(rowFeature.properties[key])) {
                        row.push(String(rowFeature.properties[key]).replace(/,/g, ",\n"));
                    }
                    else {
                        row.push(String(rowFeature.properties[key]));
                    }
                });
                tableBody.push(row);
            }
        });
        return tableBody;
    }
};

