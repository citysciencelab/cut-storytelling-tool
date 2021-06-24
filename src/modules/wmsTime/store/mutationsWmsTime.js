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
    // LayerSwiper mutations
    setLayerSwiperActive (state, active) {
        state.layerSwiper.active = active;
    },
    setLayerSwiperValueX (state, clientX) {
        state.layerSwiper.valueX = clientX;
    },
    setLayerSwiperStyleLeft (state, clientX) {
        state.layerSwiper.swiper.style.left = clientX + "px";
    },
    setLayerSwiperTargetLayer (state, layer) {
        state.layerSwiper.targetLayer = layer;
    },
    move (state, target) {
        state.layerSwiper.isMoving = true;
        state.layerSwiper.swiper = target;
    },
    moveStop (state) {
        state.layerSwiper.isMoving = false;
    }
};

export default mutations;
