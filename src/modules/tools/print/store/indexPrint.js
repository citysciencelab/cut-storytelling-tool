import actions from "./actionsPrint";
import mutations from "./mutationsPrint";
import getters from "./gettersPrint";
import state from "./statePrint";


export default {
    namespaced: true,
    state: {...state},
    mutations,
    actions,
    getters
};
