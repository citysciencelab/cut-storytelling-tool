import state from "./stateFilter";
import actions from "./actionsFilter";
import getters from "./gettersFilter";
import mutations from "./mutationsFilter";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    actions,
    getters
};
