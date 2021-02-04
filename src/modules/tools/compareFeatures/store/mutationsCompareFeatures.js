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

        console.log("mutation vorher", state.layerFeatures);

        state.layerFeatures[layerId].splice(index, 1);
        console.log("mutation", state.layerFeatures);

        // if (feature.featureId === gfiFeature.featureId) {
        //     console.log("feature id gefunden");
        //     return true;
        // }


    }
};

export default mutations;
