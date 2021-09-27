import {generateSimpleGetters} from "../../../../../app-store/utils/generators";
import directionsState from "./stateDirections";
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
    ...generateSimpleGetters(directionsState),
    /**
     * Gets all valid coordinates from the given waypoints.
     * @param {Object} params with waypoints
     * @returns {[Number, Number][]} coordinate array
     */
    directionsCoordinates ({waypoints}) {
        return waypoints
            .map(waypoint => waypoint.getCoordinates())
            .filter(coords => coords.length === 2);
    },
    /**
     * Gets the avoid speed profile options for the currently selected speed profile.
     * @param {Object} params with settings (String[]) and routingAvoidFeaturesOptions (String[])
     * @returns {String[]} avoid speed profile options
     */
    selectedAvoidSpeedProfileOptions ({settings, routingAvoidFeaturesOptions}) {
        return constantsRouting.avoidSpeedProfileOptions.filter((option) => option.availableProfiles.includes(settings.speedProfile) && routingAvoidFeaturesOptions.includes(option.id)
        );
    },
    /**
     * Checks if input is disabled.
     * @param {Object} params with isLoadingDirections (Boolean)
     * @returns {Boolean} true is input is disabled
     */
    isInputDisabled ({isLoadingDirections}) {
        return isLoadingDirections;
    }
};

export default getters;
