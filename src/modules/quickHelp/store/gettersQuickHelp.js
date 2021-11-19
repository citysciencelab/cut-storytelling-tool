import stateMap from "./stateQuickHelp";
import {generateSimpleGetters} from "../../../app-store/utils/generators";

const gettersMap = {
    ...generateSimpleGetters(stateMap),

    /**
     * checks if the quickHelp is configured by config.js and thereby ready to go
     * @returns {Boolean} true if quickHelp buttons should be visible, false if not
     */
    isSet () {
        return typeof Config === "object" && Config !== null && (
            Config.quickHelp === true ||
            typeof Config.quickHelp === "object" && Config.quickHelp !== null
        );
    }
};

export default gettersMap;
