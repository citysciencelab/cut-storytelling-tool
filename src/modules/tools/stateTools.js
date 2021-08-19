import AddWMS from "./addWMS/components/AddWMS.vue";
import BufferAnalysis from "./bufferAnalysis/components/BufferAnalysis.vue";
import Contact from "./contact/components/Contact.vue";
import CoordToolkit from "./coordToolkit/components/CoordToolkit.vue";
import Draw from "./draw/components/Draw.vue";
import CompareFeatures from "./compareFeatures/components/CompareFeatures.vue";
import FileImport from "./fileImport/components/FileImport.vue";
import Gfi from "./gfi/components/Gfi.vue";
import Measure from "./measure/components/Measure.vue";
import SaveSelection from "./saveSelection/components/SaveSelection.vue";
import ScaleSwitcher from "./scaleSwitcher/components/ScaleSwitcher.vue";
import SearchByCoord from "./searchByCoord/components/SearchByCoord.vue";
import SelectFeatures from "./selectFeatures/components/SelectFeatures.vue";
import StyleVT from "./styleVT/components/StyleVT.vue";
import SupplyCoord from "./supplyCoord/components/SupplyCoord.vue";
import WfsSearch from "./wfsSearch/components/WfsSearch.vue";
import Print from "./print/components/Print.vue";
/**
 * User type definition
 * @typedef {Object} ToolsState
 * @property {Object} componentMap contains all tool components
 * @property {Object[]} configuredTools gets all tools that should be initialized
 */
const state = {
    componentMap: {
        addWMS: AddWMS,
        bufferAnalysis: BufferAnalysis,
        contact: Contact,
        coordToolkit: CoordToolkit,
        draw: Draw,
        compareFeatures: CompareFeatures,
        fileImport: FileImport,
        gfi: Gfi,
        measure: Measure,
        saveSelection: SaveSelection,
        scaleSwitcher: ScaleSwitcher,
        searchByCoord: SearchByCoord,
        selectFeatures: SelectFeatures,
        styleVT: StyleVT,
        supplyCoord: SupplyCoord,
        wfsSearch: WfsSearch,
        print: Print
    },
    configuredTools: []
};

export default state;
