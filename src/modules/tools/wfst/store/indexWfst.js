import state from "./stateWfst";
import actions from "./actionsWfst";
import getters from "./gettersWfst";
import mutations from "./mutationsWfst";

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};
