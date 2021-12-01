
import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import coordState from "./stateLayerSlider";

const getters = {
    ...generateSimpleGetters(coordState)
};

export default getters;
