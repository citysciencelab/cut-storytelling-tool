import state from "./stateLayerClusterToggler";
import getters from "./gettersLayerClusterToggler";
import mutations from "./mutationsLayerClusterToggler";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    getters
};
