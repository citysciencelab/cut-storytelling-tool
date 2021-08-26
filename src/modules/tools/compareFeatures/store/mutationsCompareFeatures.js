import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import stateCompareFeatures from "./stateCompareFeatures";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(stateCompareFeatures),
    /**
     * Adds feature to the comparison list.
     * @param {Object} state context object.
     * @param {Object} feature feature.
     * @returns {void}
     */
    addFeatureToLayer: (state, feature) => {
        const {layerId} = feature;

        state.layerFeatures = {
            ...state.layerFeatures,
            [layerId]: [
                ...state.layerFeatures[layerId] || [],
                feature
            ]
        };
        if (Object.keys(state.layerFeatures).length > 1) {
            state.hasMultipleLayers = true;
        }
    },
    /**
     * Removes feature from comparison list by clicking its X icon and also
     * removes it from the layerFeatures array so the star icon will be deselected.
     * @param {Object} state context object.
     * @param {Object} payload - current layer and its objects
     * @returns {void}
     */
    removeFeatureFromPreparedList: function (state, payload) {
        const {featureId} = payload,
            {features} = payload,
            {selectedLayer} = payload;

        for (const feature of features) {
            if (Object.keys(feature).includes(featureId)) {
                delete feature[featureId];
            }
        }

        if (!state.hasMultipleLayers) {
            for (const feature of state.layerFeatures[Object.keys(state.layerFeatures)[0]]) {
                if (feature.featureId === featureId) {
                    const index = state.layerFeatures[feature.layerId].indexOf(feature);

                    state.layerFeatures[feature.layerId].splice(index, 1);
                    // Necessary to trigger a rerendering of the UI, otherwise the feature gets deleted in the state but the UI won´t change.
                    state.preparedList = {[feature.layerId]: [...features]};

                    if (state.layerFeatures[feature.layerId].length === 0) {
                        state.preparedList = {};
                        delete state.layerFeatures[feature.layerId];
                    }
                }
            }
        }
        else {
            for (const feature of state.layerFeatures[selectedLayer]) {
                if (feature.featureId === featureId) {
                    const index = state.layerFeatures[selectedLayer].indexOf(feature);

                    state.layerFeatures[selectedLayer].splice(index, 1);
                    // Necessary to trigger a rerendering of the UI, otherwise the feature gets deleted in the state but the UI won´t change.
                    state.preparedList = {
                        ...state.preparedList,
                        [selectedLayer]: [...features]
                    };
                }
                if (state.layerFeatures[selectedLayer].length === 0) {
                    delete state.preparedList[selectedLayer];
                    delete state.layerFeatures[selectedLayer];
                    state.selectedLayer = Object.keys(state.layerFeatures)[0];
                }
            }
        }
        if (Object.keys(state.layerFeatures).length <= 1) {
            state.hasMultipleLayers = false;
        }
        if (Object.keys(state.layerFeatures).length === 0) {
            state.hasFeatures = false;
        }
    },
    /**
     * Selects the layer with its features.
     * @param {Object} state context object.
     * @param {Object} selectedLayer from user selected layer.
     * @returns {void}
     */
    selectLayerWithFeatures: (state, selectedLayer) => {
        state.showMoreInfo = false;
        state.layerWithFeaturesToShow = [state.layerFeatures[selectedLayer]];
        state.selectedLayer = selectedLayer;
        state.showMoreInfoButton = Object.keys(state.layerFeatures[selectedLayer][0].properties).length > state.numberOfAttributesToShow;
    },
    /**
     * Sets hasMultipleLayers to false if list gets reduced to one layer
     * after removing features from comparison list.
     * @param {Object} state context object.
     * @returns {void}
     */
    resetLayerSelection: state => {
        if (Object.keys(state.layerFeatures).length <= 1) {
            state.hasMultipleLayers = false;
        }
    },
    /**
     * Toggle mutation for the 'moreInfo' Button.
     * @param {Object} state context object.
     * @returns {void}
     */
    moreInfo: state => {
        state.showMoreInfo = !state.showMoreInfo;
    },
    /**
     * Sets the compare List.
     * @param {Object} state context object.
     * @param {Object} payload object with prepared list and selected layerId.
     * @returns {void}
     */
    setList: (state, payload) => {
        const layerId = payload.a,
            list = payload.b;

        state.preparedList[layerId] = list;
    },
    /**
     * Enables the more Info Button if there are more Attributes to show.
     * @param {Object} state context object.
     * @param {Object} payload object with prepared list and selected layerId.
     * @returns {void}
     */
    enableButton: state => {
        let firstObject = {},
            length = "";

        if (!state.hasMultipleLayers && Object.values(state.layerFeatures)[0] !== undefined) {
            firstObject = Object.values(state.layerFeatures)[0][0];
            length = Object.keys(firstObject.properties).length;
        }
        else if (state.hasMultipleLayers && state.layerFeatures[state.selectedLayer] !== undefined) {
            firstObject = state.layerFeatures[state.selectedLayer][0];
            length = Object.keys(firstObject.properties).length;
        }
        state.showMoreInfoButton = length > state.numberOfAttributesToShow;
    }
};

export default mutations;
