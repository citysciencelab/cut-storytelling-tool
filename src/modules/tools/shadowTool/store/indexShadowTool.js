import state from "./stateShadowTool";
import actions from "./actionsShadowTool";
import getters from "./gettersShadowTool";
import mutations from "./mutationsShadowTool";

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
};
