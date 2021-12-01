import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import printState from "./statePrint";

const getters = {
    ...generateSimpleGetters(printState)

    // NOTE overwrite getters here if you need a special behaviour in a getter
};

export default getters;
