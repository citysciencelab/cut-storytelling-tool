import getters from "./gettersLayerSlider";
import mutations from "./mutationsLayerSlider";
import actions from "./actionsLayerSlider";
import state from "./stateLayerSlider";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    actions,
    getters
};
