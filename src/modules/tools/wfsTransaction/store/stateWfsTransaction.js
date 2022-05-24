/**
 * WfsTransaction tool state definition.
 * @typedef {object} WfsTransactionState
 * @type {object}
 * @property {string} id Unique identifier of the store.
 * @property {boolean} active Whether the tool is currently active.
 * @property {string} name Title of the tool.
 * @property {string} icon Icon used together with `name`.
 * TODO(roehlipa): Add undocumented values here
 */
const state = {
    id: "wfsTransaction",
    // General configuration
    active: false,
    name: "WfsTransaction",
    icon: "bi-globe",
    // Module specific configuration
    layerIds: [],
    areaButton: [], // TODO(roehlipa): deprecate this --> polygonButton is the new one
    edit: false,
    delete: false,
    lineButton: [],
    pointButton: [],
    polygonButton: [],
    toggleLayer: false,
    // Actual state
    currentLayerIndex: 0,
    selectedInteraction: null
};

export default state;
