import state from "./stateGeneralFilter";
import actions from "./actionsGeneralFilter";
import getters from "./gettersGeneralFilter";
import mutations from "./mutationsGeneralFilter";

export default {
    namespaced: true,
    state: {...state},
    mutations,
    actions,
    getters
};
