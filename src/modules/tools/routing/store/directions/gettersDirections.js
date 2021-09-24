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
    directionsCoordinates ({waypoints}) {
        return waypoints
            .map(waypoint => waypoint.getCoordinates())
            .filter(coords => coords.length === 2);
    },
    selectedAvoidSpeedProfileOptions ({settings, routingAvoidFeaturesOptions}) {
        return constantsRouting.avoidSpeedProfileOptions.filter((option) => option.availableProfiles.includes(settings.speedProfile) && routingAvoidFeaturesOptions.includes(option.id)
        );
    },
    isInputDisabled ({isLoadingDirections}) {
        return isLoadingDirections;
    }
};

export default getters;
