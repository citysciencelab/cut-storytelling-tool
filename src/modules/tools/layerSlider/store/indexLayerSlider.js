import getters from "./gettersLayerSlider";
import mutations from "./mutationsLayerSlider";
import state from "./stateLayerSlider";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    getters
};
