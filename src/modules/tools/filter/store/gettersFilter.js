
import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import filterState from "./stateFilter";

const getters = {
    ...generateSimpleGetters(filterState)

    // NOTE overwrite getters here if you need a special behaviour in a getter
};

export default getters;
