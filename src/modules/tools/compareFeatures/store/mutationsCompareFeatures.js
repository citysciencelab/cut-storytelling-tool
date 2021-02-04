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
    },
    removeFeatureFromLayer: (state, gfiFeature) => {
        const layerId = gfiFeature.layerId,
            index = state.layerFeatures[layerId].indexOf(gfiFeature);

        state.layerFeatures[layerId].splice(index, 1);


    }
};

export default mutations;
