import {generateSimpleMutations} from "../../../app-store/utils/generators";
import initialState from "./stateWmst";

const mutations = {
    ...generateSimpleMutations(initialState),
    // TimeSlider mutations
    setTimeSliderActive (state, active) {
        state.timeSlider.active = active;
    },
    setDefaultValue (state, defaultValue) {
        state.timeSlider.defaultValue = defaultValue;
    },
    setLayerId (state, layerId) {
        state.timeSlider.layerId = layerId;
    },
    setMin (state, min) {
        state.timeSlider.min = min;
    },
    setMax (state, max) {
        state.timeSlider.max = max;
    },
    setStep (state, step) {
        state.timeSlider.step = step;
    },
    // Swiper mutations
    setSwiperActive (state, active) {
        state.swiper.active = active;
    }
};

export default mutations;
