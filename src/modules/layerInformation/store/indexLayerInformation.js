import actions from "./actionsLayerInformation";
import mutations from "./mutationsLayerInformation";
import getters from "./gettersLayerInformation";
import state from "./stateLayerInformation";


export default {
    namespaced: true,
    state: {...state},
    getters,
    actions,
    mutations
};
