/**
 * User type definition
 * @typedef {Object} CoordToolkitState
 * @property {Boolean} active if true, CoordToolkit will rendered
 * @property {String} id id of the CoordToolkit component
 * @property {module:ol/interaction/Pointer} selectPointerMove contains interaction listener to map
 * @property {Object[]} projections list of available projections
 * @property {Object} mapProjection projection of the map
 * @property {Number[]} positionMapProjection position of the projection in the map
 * @property {Boolean} updatePosition if true, position is updated in tool
 * @property {Object} currentProjection the current projection
 * @property {String} currentSelection currently selected projection value
 * @property {String} coordinatesEastingField label of the easting field
 * @property {String} coordinatesNorthingField label of the northing field
 * @property {String} name displayed as title (config-param)
 * @property {String} glyphicon icon next to title (config-param)
 * @property {Boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {Boolean} resizableWindow if true, window is resizable (config-param)
 * @property {Boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {Boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 */
const state = {
    active: false,
    id: "coordToolkit",
    mode: "supply",
    selectPointerMove: null,
    projections: [],
    mapProjection: null,
    positionMapProjection: [],
    updatePosition: true,
    currentProjection: {id: "EPSG:25832", name: "EPSG:25832", projName: "utm"},
    eastingNoCoord: false,
    eastingNoMatch: false,
    northingNoCoord: false,
    northingNoMatch: false,
    coordinatesEasting: {id: "easting", value: ""},
    coordinatesNorthing: {id: "northing", value: ""},
    coordinatesEastingExample: "",
    coordinatesNorthingExample: "",
    selectedCoordinates: [],
    height: "",
    heightLayer: null,

    // must be set in config.json to display the height
    heightLayerId: null,
    heightInfoFormat: "application/vnd.ogc.gml",
    heightAttributeKey: null,
    heightValueWater: null,
    heightValueBuilding: null,

    // defaults for config.json parameters
    name: "common:menu.tools.coordToolkit",
    glyphicon: "glyphicon-globe",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: true
};

export default state;
