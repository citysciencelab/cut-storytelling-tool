import mutations from "./mutationsDirections";
import actions from "./actionsDirections";
import getters from "./gettersDirections";
import state from "./stateDirections";

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
