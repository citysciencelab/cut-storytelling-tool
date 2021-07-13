import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsSearch";

const getters = {
    ...generateSimpleGetters(initialState),
    /**
     * Tests whether all required values contain a value.
     * The result is used for the disable button of the search.
     *
     * @param {Object} requiredValues The object containing the values which should be set before starting the search.
     * @returns {Boolean} Whether all required values have been set or not.
     */
    requiredFields ({requiredValues}) {
        return requiredValues === null || Object.values(requiredValues).some(val => typeof val !== "string" || val === "");
    },
    /**
     * Returns the currently selected searchInstance.
     *
     * @param {Object[]} instances Array of searchInstances.
     * @param {Number} currentInstanceIndex Index of the current searchInstance inside the array of instances.
     * @returns {Object} The current searchInstance.
     */
    currentInstance ({instances, currentInstanceIndex}) {
        return instances[currentInstanceIndex];
    }
};

export default getters;
