import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import initialState from "./stateShadowTool";

const getters = {
    ...generateSimpleGetters(initialState)
};

export default getters;
