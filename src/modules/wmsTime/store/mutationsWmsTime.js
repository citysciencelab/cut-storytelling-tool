import {generateSimpleMutations} from "../../../app-store/utils/generators";
import initialState from "./stateWmsTime";
import findCurrentTimeSliderObject from "../utils/findCurrentTimeSliderObject";

const mutations = {
    ...generateSimpleMutations(initialState),
    setWindowWidth (state) {
        state.windowWidth = window.innerWidth;
    },
    // TimeSlider mutations
    addTimeSliderObject (state, object) {
        state.timeSlider.objects.push(object);
    },
    setTimeSliderActive ({timeSlider}, {active, currentLayerId}) {
        timeSlider.active = active;
        timeSlider.currentLayerId = currentLayerId;
    },
    setTimeSliderDefaultValue ({timeSlider: {currentLayerId, objects}}, newValue) {
        const currentObject = findCurrentTimeSliderObject(currentLayerId, objects);

        // NOTE: This is needed when the LayerSwiper is closed and no new value was selected in the second
        // TimeSlider thus newValue would be the same as defaultValue and would not trigger the update Event.
        currentObject.defaultValue = currentObject.timeRange[0];
        // If the timeout is not, no update is triggered.
        setTimeout(() => {
            currentObject.defaultValue = newValue;
        }, 1);
    },
    setTimeSliderPlaying ({timeSlider}, playing) {
        timeSlider.playing = playing;
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
