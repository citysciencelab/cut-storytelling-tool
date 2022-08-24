/**
 * User type definition
 * @typedef {Object} LayerselectorState
 * @property {Object[]} events
 * @property {String} events.event The name of the event. It has to be equal to the attribute the source module sets.
 * @property {String[]} events.showLayerId Layer IDs of Layer to be selected in the layer tree.
 * @property {String[]} events.layerIds Layer ID of the layer to be shown in the layer tree.
 * @property {String} events.openFolderForLayerIds List of Layer IDs to open their folders in the layer tree.
 * @property {String} events.deselectPreviousLayers Deselects the previous layers if it has the value always.
 * @property {Integer[]} events.extent Bounding Box to zoom to when this event is triggered.
 * @property {Object} default Object to overwrite the missing parts in the events objects.
 * @property {Object} eventMap Map of registered parameters.
 */
const state = {
    events: [],
    default: {
        showLayerId: null,
        deselectPreviousLayers: "always",
        layerIds: [],
        openFolderForLayerIds: [],
        extent: null
    },
    eventMap: {
        "comparefeatures_select": "Tools/CompareFeatures/selectedLayer",
        "fileimport_imported": "Tools/FileImport/importedFileNames",
        "measure_geometry": "Tools/Measure/selectedGeometry"
    },
    initialized: false
};

export default state;
