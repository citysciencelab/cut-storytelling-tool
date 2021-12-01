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
import GeneralFilter from "./generalFilter/store/indexGeneralFilter";
import Gfi from "./gfi/store/indexGfi";
import LayerClusterToggler from "./layerClusterToggler/store/indexLayerClusterToggler";
import Measure from "./measure/store/indexMeasure";
import Print from "./print/store/indexPrint";
import SaveSelection from "./saveSelection/store/indexSaveSelection";
import ScaleSwitcher from "./scaleSwitcher/store/indexScaleSwitcher";
import SearchByCoord from "./searchByCoord/store/indexSearchByCoord";
import SelectFeatures from "./selectFeatures/store/indexSelectFeatures";
import StyleVT from "./styleVT/store/indexStyleVT";
import SupplyCoord from "./supplyCoord/store/indexSupplyCoord";
import WfsSearch from "./wfsSearch/store/indexWfsSearch";
import Routing from "./routing/store/indexRouting";

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
        GeneralFilter,
        Gfi,
        Measure,
        Print,
        SaveSelection,
        ScaleSwitcher,
        SearchByCoord,
        SelectFeatures,
        StyleVT,
        SupplyCoord,
        WfsSearch,
        Routing,
        LayerClusterToggler
    },
    state,
    getters,
    mutations,
    actions
};
