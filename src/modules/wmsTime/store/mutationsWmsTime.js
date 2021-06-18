import {generateSimpleMutations} from "../../../app-store/utils/generators";
import initialState from "./stateWmsTime";
import findCurrentTimeSliderObject from "../utils/findCurrentTimeSliderObject";

const mutations = {
    ...generateSimpleMutations(initialState),
    // TimeSlider mutations
    addTimeSliderObject (state, object) {
        state.timeSlider.objects.push(object);
    },
    setTimeSliderActive ({timeSlider}, {active, currentLayerId}) {
        timeSlider.active = active;
        timeSlider.currentLayerId = currentLayerId;
    },
    setTimeSliderDefaultValue ({timeSlider: {objects, currentLayerId}}, newValue) {
        findCurrentTimeSliderObject(objects, currentLayerId).defaultValue = newValue;
    },
    // Swiper mutations
    setSwiperActive (state, active) {
        state.swiper.active = active;
    }
};

export default mutations;
