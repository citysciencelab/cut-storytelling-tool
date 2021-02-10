import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsSearch";

const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
