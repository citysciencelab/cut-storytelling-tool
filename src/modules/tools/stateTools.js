import AddWMS from "./addWMS/components/AddWMS.vue";
import BufferAnalysis from "./bufferAnalysis/components/BufferAnalysis.vue";
import CompareFeatures from "./compareFeatures/components/CompareFeatures.vue";
import Contact from "./contact/components/Contact.vue";
import CoordToolkit from "./coordToolkit/components/CoordToolkit.vue";
import Draw from "./draw/components/Draw.vue";
import FileImport from "./fileImport/components/FileImport.vue";
import GeneralFilter from "./generalFilter/components/GeneralFilter.vue";
import Gfi from "./gfi/components/Gfi.vue";
import LayerClusterToggler from "./layerClusterToggler/components/LayerClusterToggler.vue";
import LayerSlider from "./layerSlider/components/LayerSlider.vue";
import Measure from "./measure/components/Measure.vue";
import Print from "./print/components/Print.vue";
import SaveSelection from "./saveSelection/components/SaveSelection.vue";
import ScaleSwitcher from "./scaleSwitcher/components/ScaleSwitcher.vue";
import SearchByCoord from "./searchByCoord/components/SearchByCoord.vue";
import SelectFeatures from "./selectFeatures/components/SelectFeatures.vue";
import StyleVT from "./styleVT/components/StyleVT.vue";
import SupplyCoord from "./supplyCoord/components/SupplyCoord.vue";
import WfsSearch from "./wfsSearch/components/WfsSearch.vue";
import Routing from "./routing/components/Routing.vue";

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
        compareFeatures: CompareFeatures,
        contact: Contact,
        coordToolkit: CoordToolkit,
        draw: Draw,
        fileImport: FileImport,
        gfi: Gfi,
        generalFilter: GeneralFilter,
        layerClusterToggler: LayerClusterToggler,
        layerSlider: LayerSlider,
        measure: Measure,
        print: Print,
        saveSelection: SaveSelection,
        scaleSwitcher: ScaleSwitcher,
        searchByCoord: SearchByCoord,
        selectFeatures: SelectFeatures,
        styleVT: StyleVT,
        supplyCoord: SupplyCoord,
        wfsSearch: WfsSearch,
        routing: Routing
    },
    configuredTools: []
};

export default state;
