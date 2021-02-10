import Draw from "./draw/components/Draw.vue";
import FileImport from "./fileImport/components/FileImport.vue";
import Gfi from "./gfi/components/Gfi.vue";
import Measure from "./measure/components/Measure.vue";
import WfsSearch from "./wfsSearch/components/WfsSearch.vue";
import SaveSelection from "./saveSelection/components/SaveSelection.vue";
import ScaleSwitcher from "./scaleSwitcher/components/ScaleSwitcher.vue";
import SupplyCoord from "./supplyCoord/components/SupplyCoord.vue";

/**
 * User type definition
 * @typedef {Object} ToolsState
 * @property {Object} componentMap contains all tool components
 * @property {Object[]} configuredTools gets all tools that should be initialized
 */
const state = {
    componentMap: {
        draw: Draw,
        fileImport: FileImport,
        gfi: Gfi,
        measure: Measure,
        saveSelection: SaveSelection,
        scaleSwitcher: ScaleSwitcher,
        supplyCoord: SupplyCoord,
        wfsSearch: WfsSearch
    },
    configuredTools: []
};

export default state;
