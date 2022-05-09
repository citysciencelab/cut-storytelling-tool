import GenericTool from "../../../src/modules/tools/indexTools";
import composeModules from "../../../src/app-store/utils/composeModules";
import actions from "./actionsStoryCreationTool";
import getters from "./gettersStoryCreationTool";
import mutations from "./mutationsStoryCreationTool";
import state from "./stateStoryCreationTool";

export default composeModules([
    GenericTool,
    {
        namespaced: true, // mandatory
        state,
        actions,
        mutations,
        getters
    }
]);
