import stateMap from "./stateQuickHelp";
import {generateSimpleGetters} from "../../../app-store/utils/generators";

const gettersMap = {
    ...generateSimpleGetters(stateMap)
};

export default gettersMap;
