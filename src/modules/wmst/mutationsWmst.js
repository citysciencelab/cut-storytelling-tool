import {generateSimpleMutations} from "../../app-store/utils/generators";
import initialState from "./stateWmst";

const mutations = {
    ...generateSimpleMutations(initialState),
    setTimeSliderActive (state, active) {
        state.timeSlider.active = active;
    }
};

export default mutations;
