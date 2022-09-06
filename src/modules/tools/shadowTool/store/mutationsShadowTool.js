import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateShadowTool";

const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
