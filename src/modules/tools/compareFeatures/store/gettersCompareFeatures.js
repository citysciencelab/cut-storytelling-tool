import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import compareFeaturesState from "./statecompareFeatures";

const getters = {
    ...generateSimpleGetters(compareFeaturesState),
    isFeatureSelected: (state) => (gfiFeature) => {
        const layerId = gfiFeature.layerId;

        if (state.layerFeatures.hasOwnProperty(layerId)) {

            for (const feature of state.layerFeatures[layerId]) {
                if (feature.featureId === gfiFeature.featureId) {
                    return true;
                }
            }
        }
        return false;
    },
    hasFeatures: (state) => {
        if (Object.keys(state.layerFeatures).length > 0) {
            return true;
        }
        return false;
    },
    selectableLayers: (state) => {
        const layerArray = [];

        Object.keys(state.layerFeatures).forEach(function (key) {
            if (state.layerFeatures[key][0] !== undefined) {
                layerArray.push(state.layerFeatures[key][0]);
            }
        });
        return layerArray;
    }
    // NOTE overwrite getters here if you need a special behaviour in a getter
};

export default getters;
