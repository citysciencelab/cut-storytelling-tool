import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import compareFeaturesState from "./stateCompareFeatures";

const getters = {
    ...generateSimpleGetters(compareFeaturesState),
    /**
     * Checks if a feature is selected.
     * @param {Object} state context object.
     * @param {Object} gfiFeature - feature
     * @returns {void}
     */
    isFeatureSelected: state => ({featureId, layerId}) => {
        if (Object.prototype.hasOwnProperty.call(state.layerFeatures, layerId)) {
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
        return (state.hasFeatures && !state.hasMultipleFeatures) || (state.hasMultipleFeatures && state.selectedLayer);
    }
};

export default getters;
