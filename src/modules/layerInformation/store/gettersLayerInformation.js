import {generateSimpleGetters} from "../../../app-store/utils/generators";
import layerInformationState from "./stateLayerInformation";

const getters = {
    ...generateSimpleGetters(layerInformationState)
};

export default getters;
