import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import compareFeaturesState from "./statecompareFeatures";

const getters = {
    ...generateSimpleGetters(compareFeaturesState),
    isFeatureSelected: (state) => (gfiFeature) => {
        const layerId = gfiFeature.layerId;

        if (state.layerFeatures.hasOwnProperty(layerId)) {

            for (const feature of state.layerFeatures[layerId]) {
                if (feature.featureId === gfiFeature.featureId) {
                    console.log("feature id gefunden");
                    return true;
                }
                return false;
            }
        }
    }
    // hasFeatures: (state) => {
    //     console.log(state.layerFeatures);
    // }

    // NOTE overwrite getters here if you need a special behaviour in a getter
};

export default getters;
