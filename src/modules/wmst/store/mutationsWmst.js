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
    // LayerSwiper mutations
    setSwiperActive (state, active) {
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
    setLayerSwiperMapObject (state, map) {
        state.layerSwiper.mapObject = map;
    },
    move (state, event) {
        const {target} = event;

        state.layerSwiper.isMoving = true;
        state.layerSwiper.swiper = target;
    },
    moveStop (state) {
        state.layerSwiper.isMoving = false;
    }
};

export default mutations;
