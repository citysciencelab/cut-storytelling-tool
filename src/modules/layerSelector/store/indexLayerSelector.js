import state from "./stateLayerSelector";
import getters from "./gettersLayerSelector";
import actions from "./actionsLayerSelector";
import mutations from "./mutationsLayerSelector";

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
