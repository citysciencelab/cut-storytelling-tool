import {generateSimpleGetters} from "../../app-store/utils/generators";
import initialState from "./stateWmst";

const getters = {
    ...generateSimpleGetters(initialState)
};

export default getters;
