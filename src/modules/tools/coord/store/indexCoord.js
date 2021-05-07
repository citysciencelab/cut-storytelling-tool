import getters from "./gettersCoord";
import mutations from "./mutationsCoord";
import actions from "./actionsCoord";
import state from "./stateCoord";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    actions,
    getters
};
