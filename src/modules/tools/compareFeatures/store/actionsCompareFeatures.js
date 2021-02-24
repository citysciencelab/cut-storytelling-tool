export default {
    /**
     * Checks if feature is on compare list and adds it to the list when star icon gets clicked.
     * @param {Object} _ actions context object.
     * @param {Object} gfiFeature - feature
     * @returns {void}
     */
    isFeatureOnCompareList: function ({state, commit, dispatch, getters}, gfiFeature) {
        const layerId = gfiFeature.layerId;

        commit("setShowAlert", true);
        commit("setListFull", false);
        if (state.layerFeatures[layerId] === undefined) {
            if (!getters.isFeatureSelected(gfiFeature)) {
                commit("addFeatureToLayer", gfiFeature);
                for (const feature of state.layerFeatures[layerId]) {
                    dispatch("prepareFeatureListToShow", feature);
                }
            }
        }
        else if (state.layerFeatures[layerId] !== undefined) {
            if (!getters.isFeatureSelected(gfiFeature) && state.layerFeatures[layerId].length < state.numberOfFeaturesToShow) {
                commit("addFeatureToLayer", gfiFeature);
                for (const feature of state.layerFeatures[layerId]) {
                    dispatch("prepareFeatureListToShow", feature);
                }
            }
            else {
                commit("setListFull", true);
            }
        }
    },
    /**
     * Removes the feature if star icon is clicked.
     * @param {Object} _ actions context object.
     * @param {Object} gfiFeature - feature
     * @returns {void}
     */
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
    /**
     * Prepares the Pdf file from currently selected layer and its features on the comparison list.
     * @param {Object} _ actions context object.
     * @returns {void}
     */
    preparePrint: async function ({state, dispatch}) {
        const layerId = !state.hasMultipleLayers ? Object.keys(state.layerFeatures)[0] : state.selectedLayer,
            tableBody = await dispatch("prepareTableBody", state.layerFeatures[layerId]),
            pdfDef = {
                "layout": "A4 Hochformat",
                "outputFormat": "pdf",
                "attributes": {
                    "title": "Vergleichsliste",
                    "datasource": [
                        {
                            "table": {
                                "columns": ["attr", "feature1", "feature2", "feature3"],
                                "data": tableBody
                            }
                        }
                    ]
                }
            };

        Radio.trigger("Print", "createPrintJob", encodeURIComponent(JSON.stringify(pdfDef)), "compareFeatures", "pdf");
    },
    /**
     * Prepares the table body which is used for printing the pdf file from comparison list.
     * @param {Object} _ actions context object.
     * @param {Object} features - features
     * @returns {void}
     */
    prepareTableBody: function ({state}, features) {
        const tableBody = [],
            rowsToShow = state.numberOfAttributesToShow;

        for (const feature of features) {
            if (features.indexOf(feature) === 0) {
                Object.keys(feature.properties).forEach((key, index) => {

                    tableBody.push([key, Object.values(feature.properties)[index]]);
                });
            }
            else {
                Object.keys(feature.properties).forEach((key, index) => {
                    tableBody[index].push(Object.values(feature.properties)[index]);
                });
            }
        }
        if (!state.showMoreInfo) {
            return tableBody.slice(0, rowsToShow);
        }
        return tableBody;
    },
    /**
     * Removes feature from comparison list by clicking its X icon and also
     * removes it from the layerFeatures array so the star icon will be deselected.
     * @param {Object} _ actions context object.
     * @param {Object} payload - current layer and its objects
     * @returns {void}
     */
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

