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
import FeatureLister from "./featureLister/store/indexFeatureLister";
import FileImport from "./fileImport/store/indexFileImport";
import Filter from "./filter/store/indexFilter";
import Gfi from "./gfi/store/indexGfi";
import LayerClusterToggler from "./layerClusterToggler/store/indexLayerClusterToggler";
import LayerSlider from "./layerSlider/store/indexLayerSlider";
import Measure from "./measure/store/indexMeasure";
import Print from "./print/store/indexPrint";
import Routing from "./routing/store/indexRouting";
import SaveSelection from "./saveSelection/store/indexSaveSelection";
import ScaleSwitcher from "./scaleSwitcher/store/indexScaleSwitcher";
import SearchByCoord from "./searchByCoord/store/indexSearchByCoord";
import SelectFeatures from "./selectFeatures/store/indexSelectFeatures";
import Shadow from "./shadowTool/store/indexShadowTool";
import StyleVT from "./styleVT/store/indexStyleVT";
import SupplyCoord from "./supplyCoord/store/indexSupplyCoord";
import WfsSearch from "./wfsSearch/store/indexWfsSearch";
import Wfst from "./wfst/store/indexWfst";

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
        FeatureLister,
        FileImport,
        Filter,
        Gfi,
        LayerClusterToggler,
        LayerSlider,
        Measure,
        Print,
        Routing,
        SaveSelection,
        ScaleSwitcher,
        SearchByCoord,
        SelectFeatures,
        Shadow,
        StyleVT,
        SupplyCoord,
        WfsSearch,
        Wfst
    },
    state,
    getters,
    mutations,
    actions
};
