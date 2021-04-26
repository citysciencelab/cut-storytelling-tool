import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import compareFeaturesState from "./statecompareFeatures";

const getters = {
    ...generateSimpleGetters(compareFeaturesState),
    /**
     * Checks if a feature is selected.
     * @param {Object} state context object.
     * @param {Object} gfiFeature - feature
     * @returns {void}
     */
    isFeatureSelected: state => ({featureId, layerId}) => {
        if (state.layerFeatures.hasOwnProperty(layerId)) {
            for (const feature of state.layerFeatures[layerId]) {
                if (feature.featureId === featureId) {
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * Gets the currently available layers.
     * @param {Object} state context object.
     * @returns {void}
     */
    selectableLayers: state => {
        const layers = [];

        Object.keys(state.layerFeatures).forEach((key) => {
            if (state.layerFeatures[key][0]) {
                layers.push(state.layerFeatures[key][0]);
            }
        });
        return layers;
    },
    /**
     * Getter for only showing moreInfo & PDF button when in comparison list.
     * @param {Object} state context object.
     * @returns {void}
     */
    showButtons: state => {
        if (state.hasFeatures && !state.hasMultipleLayers) {
            return true;
        }
        else if (state.hasMultipleLayers && state.selectedLayer) {
            return true;
        }
        return false;
    }
};

export default getters;
