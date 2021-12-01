
import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import generalFilterState from "./stateGeneralFilter";

const getters = {
    ...generateSimpleGetters(generalFilterState)

    // NOTE overwrite getters here if you need a special behaviour in a getter
};

export default getters;
