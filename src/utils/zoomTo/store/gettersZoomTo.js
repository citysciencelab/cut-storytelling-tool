import {generateSimpleGetters} from "../../../app-store/utils/generators";
import initialState from "./stateZoomTo";

const getters = {
    ...generateSimpleGetters(initialState)
};

export default getters;
