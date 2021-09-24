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
    selectedAvoidSpeedProfileOptions ({settings, routingAvoidFeaturesOptions}) {
        return constantsRouting.avoidSpeedProfileOptions.filter((option) => option.availableProfiles.includes(settings.speedProfile) && routingAvoidFeaturesOptions.includes(option.id)
        );
    },
    isInputDisabled ({isLoadingIsochrones}) {
        return isLoadingIsochrones;
    }
};

export default getters;
