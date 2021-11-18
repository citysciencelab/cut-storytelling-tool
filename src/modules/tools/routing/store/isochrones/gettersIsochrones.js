import {generateSimpleGetters} from "../../../../../app-store/utils/generators";
import stateIsochrones from "./stateIsochrones";
import * as constantsRouting from "../constantsRouting";

const getters = {
    /**
     * Returns an object of simple getters for a state object, where
     * simple means that they will just return an entry for any key.
     * For example, given a state object {key: value}, an object
     * {key: state => state[key]} will be returned.
     * This is useful to avoid writing basic operations.
     * @param {object} state state to generate getters for
     * @returns {object.<string, function>} object of getters
     */
    ...generateSimpleGetters(stateIsochrones),
    /**
     * Gets the avoid speed profile options for the currently selected speed profile.
     * @param {Object} params with the configured settings
     * @param {Object} [params.settings] settings from stateIsochrones
     * @param {String} [params.settings.speedProfile] selected speedProfile
     * @param {String[]} [params.routingAvoidFeaturesOptions] selected avoid options
     * @returns {String[]} avoid speed profile options
     */
    selectedAvoidSpeedProfileOptions ({settings, routingAvoidFeaturesOptions}) {
        return constantsRouting.avoidSpeedProfileOptions.filter((option) => option.availableProfiles.includes(settings.speedProfile) && routingAvoidFeaturesOptions.includes(option.id));
    },
    /**
     * Checks if input is disabled.
     * @param {Object} params from stateIsochrones
     * @param {Boolean} [params.isLoadingDirections] if the directions are currently loaded
     * @returns {Boolean} true if input is disabled
     */
    isInputDisabled ({isLoadingIsochrones}) {
        return isLoadingIsochrones;
    }
};

export default getters;
