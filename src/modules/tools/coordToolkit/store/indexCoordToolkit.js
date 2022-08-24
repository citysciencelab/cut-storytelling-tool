import getters from "./gettersCoordToolkit";
import mutations from "./mutationsCoordToolkit";
import actions from "./actionsCoordToolkit";
import state from "./stateCoordToolkit";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    actions,
    getters
};
