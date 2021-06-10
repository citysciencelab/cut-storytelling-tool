import state from "./stateWmst";
import getters from "./gettersWmst";
import mutations from "./mutationsWmst";

import TimeSlider from "./timeSlider/store/indexTimeSlider";

export default {
    namespaced: true,
    modules: {
        TimeSlider
    },
    state,
    getters,
    mutations
};
