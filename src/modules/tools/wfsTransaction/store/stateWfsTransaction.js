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
    areaButton: [], // TODO(roehlipa): deprecate this --> polygonButton is the new one
    edit: false,
    delete: false,
    featuresProperties: [ // TODO(roehlipa): These values should be the default but it should be configurable (values depend on used service)
        {
            label: "common:modules.tools.wfsTransaction.form.featuresProperties.name",
            key: "name" // TODO(roehlipa): Check the actual needed property defaults
        },
        {
            label: "common:modules.tools.wfsTransaction.form.featuresProperties.number",
            key: "number"
        },
        {
            label: "common:modules.tools.wfsTransaction.form.featuresProperties.annotation",
            key: "annotation"
        },
        {
            label: "common:modules.tools.wfsTransaction.form.featuresProperties.date",
            key: "date"
        }
    ],
    layerIds: [],
    lineButton: [],
    pointButton: [],
    polygonButton: [],
    toggleLayer: false,
    // Actual state
    currentLayerIndex: 0,
    selectedInteraction: null
};

export default state;
