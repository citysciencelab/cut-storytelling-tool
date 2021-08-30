import {generateSimpleMutations} from "../../../app-store/utils/generators";
import initialState from "./stateQuickHelp";


const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
