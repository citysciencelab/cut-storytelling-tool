import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import layerClusterTogglerState from "./stateLayerClusterToggler";

const getters = {
    ...generateSimpleGetters(layerClusterTogglerState)

    // NOTE overwrite getters here if you need a special behaviour in a getter
};

export default getters;
