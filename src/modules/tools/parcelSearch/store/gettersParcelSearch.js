import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import initialState from "./stateParcelSearch";

const getters = {
    ...generateSimpleGetters(initialState)
};

export default getters;
