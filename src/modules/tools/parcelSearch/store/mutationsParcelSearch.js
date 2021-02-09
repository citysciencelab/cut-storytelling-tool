import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateParcelSearch";

const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
