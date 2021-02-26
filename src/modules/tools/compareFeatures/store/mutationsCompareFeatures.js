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
        const layerId = feature.layerId;

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
     * Removes feature from the comparison list.
     * @param {Object} state context object.
     * @param {Object} gfiFeature feature.
     * @returns {void}
     */
    removeFeatureFromLayer: (state, gfiFeature) => {
        const layerId = gfiFeature.layerId,
            index = state.layerFeatures[layerId].indexOf(gfiFeature);

        state.layerFeatures[layerId].splice(index, 1);
        if (state.layerFeatures[layerId].length === 0) {
            delete state.layerFeatures[layerId];
        }

        if (Object.keys(state.layerFeatures).length <= 1) {
            state.hasMultipleLayers = false;
        }
    },
    /**
     * Selects the layer with its features.
     * @param {Object} state context object.
     * @param {Object} selectedLayer from user selected layer.
     * @returns {void}
     */
    selectLayerWithFeatures: function (state, selectedLayer) {
        state.showMoreInfo = false;
        state.layerWithFeaturesToShow = [];
        state.layerWithFeaturesToShow.push(state.layerFeatures[selectedLayer]);
        state.selectedLayer = selectedLayer;
        if (Object.keys(state.layerFeatures[selectedLayer][0].properties).length > state.numberOfAttributesToShow) {
            state.showMoreInfoButton = true;
        }
        else {
            state.showMoreInfoButton = false;
        }
    },
    /**
     * If multiple layers are present the state variable will be true.
     * @param {Object} state context object.
     * @returns {void}
     */
    hasLayers: (state) => {
        if (Object.keys(state.layerFeatures).length <= 1) {
            state.hasMultipleLayers = false;
        }
    },
    /**
     * Toggle mutation for the 'moreInfo' Button.
     * @param {Object} state context object.
     * @returns {void}
     */
    moreInfo: function (state) {
        state.showMoreInfo = !state.showMoreInfo;
    },
    /**
     * Opens the Compare Features Tool from within the Feedback Modal.
     * @param {Object} state context object.
     * @returns {void}
     */
    switchToList: function (state) {
        state.active = true;
    }
};

export default mutations;
