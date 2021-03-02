import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import compareFeaturesState from "./statecompareFeatures";

const getters = {
    ...generateSimpleGetters(compareFeaturesState),
    /**
     * Checks if layer a feature is selected.
     * @param {Object} state context object.
     * @param {Object} gfiFeature - feature
     * @returns {void}
     */
    isFeatureSelected: (state) => (gfiFeature) => {
        const layerId = gfiFeature.layerId;
        console.log(gfiFeature);

        if (state.layerFeatures.hasOwnProperty(layerId)) {

            for (const feature of state.layerFeatures[layerId]) {
                if (feature.featureId === gfiFeature.featureId) {
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * Checks if features are on the comparison list.
     * @param {Object} state context object.
     * @returns {void}
     */
    hasFeatures: (state) => {
        if (Object.keys(state.layerFeatures).length > 0) {
            return true;
        }
        return false;
    },
    /**
     * Gets the currently available layers.
     * @param {Object} state context object.
     * @returns {void}
     */
    selectableLayers: (state) => {
        const layerArray = [];

        Object.keys(state.layerFeatures).forEach(function (key) {
            if (state.layerFeatures[key][0] !== undefined) {
                layerArray.push(state.layerFeatures[key][0]);
            }
        });
        return layerArray;
    }
};

export default getters;
