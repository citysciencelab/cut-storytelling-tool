import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import compareFeaturesState from "./statecompareFeatures";

const getters = {
    ...generateSimpleGetters(compareFeaturesState)

    // NOTE overwrite getters here if you need a special behaviour in a getter
};

export default getters;
