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
    selectLayerWithFeatures: function (state, selectedLayer) {
        console.log(selectedLayer);
        state.layerWithFeaturesToShow = [];
        state.layerWithFeaturesToShow.push(state.layerFeatures[selectedLayer]);
    },
    hasLayers: (state) => {
        if (Object.keys(state.layerFeatures).length <= 1) {
            state.hasMultipleLayers = false;
        }
    }
};

export default mutations;
