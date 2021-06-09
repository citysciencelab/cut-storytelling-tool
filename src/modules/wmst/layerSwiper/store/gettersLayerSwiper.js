import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import layerSwiperState from "./stateLayerSwiper";

const getters = {
    ...generateSimpleGetters(layerSwiperState)
};

export default getters;
