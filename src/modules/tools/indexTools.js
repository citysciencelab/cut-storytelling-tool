
import state from "./stateTools";
import getters from "./gettersTools";
import mutations from "./mutationsTools";
import actions from "./actionsTools";

/**
 * The imported tools.
 */
import Draw from "./draw/store/indexDraw";
import FileImport from "./fileImport/store/indexFileImport";
import Gfi from "./gfi/store/indexGfi";
import WfsSearch from "./wfsSearch/store/indexWfsSearch";
import SaveSelection from "./saveSelection/store/indexSaveSelection";
import ScaleSwitcher from "./scaleSwitcher/store/indexScaleSwitcher";
import SupplyCoord from "./supplyCoord/store/indexSupplyCoord";
import Measure from "./measure/store/indexMeasure";

/**
 * This is here to test app-store/utils/composeModules.
 * Also provides actions.
 */
export default {
    namespaced: true,
    modules: {
        Draw,
        FileImport,
        Gfi,
        Measure,
        SaveSelection,
        ScaleSwitcher,
        SupplyCoord,
        WfsSearch
    },
    state,
    getters,
    mutations,
    actions
};
