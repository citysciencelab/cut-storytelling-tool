import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsSearch";

const getters = {
    ...generateSimpleGetters(initialState)
};

export default getters;
