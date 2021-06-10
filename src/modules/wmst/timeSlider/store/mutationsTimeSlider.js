import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateTimeSlider";

const mutations = {
    ...generateSimpleMutations(initialState)
};

export default mutations;
