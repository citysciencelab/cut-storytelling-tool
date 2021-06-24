import state from "./stateTools";
import getters from "./gettersTools";
import mutations from "./mutationsTools";
import actions from "./actionsTools";

/**
 * The imported tools.
 */
import AddWMS from "./addWMS/store/indexAddWMS";
import BufferAnalysis from "./bufferAnalysis/store/indexBufferAnalysis";
import CompareFeatures from "./compareFeatures/store/indexCompareFeatures";
import Contact from "./contact/store/indexContact";
import CoordToolkit from "./coordToolkit/store/indexCoordToolkit";
import Draw from "./draw/store/indexDraw";
import FileImport from "./fileImport/store/indexFileImport";
import Gfi from "./gfi/store/indexGfi";
import Measure from "./measure/store/indexMeasure";
import SaveSelection from "./saveSelection/store/indexSaveSelection";
import ScaleSwitcher from "./scaleSwitcher/store/indexScaleSwitcher";
import SearchByCoord from "./searchByCoord/store/indexSearchByCoord";
import SelectFeatures from "./selectFeatures/store/indexSelectFeatures";
import StyleVT from "./styleVT/store/indexStyleVT";
import SupplyCoord from "./supplyCoord/store/indexSupplyCoord";
import Print from "./print/store/indexPrint";
import WfsSearch from "./wfsSearch/store/indexWfsSearch";
/**
 * This is here to test app-store/utils/composeModules.
 * Also provides actions.
 */
export default {
    namespaced: true,
    modules: {
        AddWMS,
        BufferAnalysis,
        CompareFeatures,
        Contact,
        CoordToolkit,
        Draw,
        FileImport,
        Gfi,
        Measure,
        SaveSelection,
        ScaleSwitcher,
        SearchByCoord,
        SelectFeatures,
        Print,
        StyleVT,
        SupplyCoord,
        WfsSearch
    },
    state,
    getters,
    mutations,
    actions
};
