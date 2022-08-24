import {generateSimpleGetters} from "../../../app-store/utils/generators";
import state from "./stateLayerSelector";

const getters = {
    ...generateSimpleGetters(state)

    // NOTE overwrite getters here if you need a special behaviour in a getter
};

export default getters;
