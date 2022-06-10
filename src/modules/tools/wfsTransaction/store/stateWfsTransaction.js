/**
 * @typedef {object} ButtonConfig
 * @type {object}
 * @param {string} layerId Id of the layer this configuration belongs to.
 * @param {boolean} show Whether the button should be visible for the layer with this layerId.
 * @param {boolean} multi Whether the drawn geometries should be Multi-X. TODO(roehlipa): Document me
 */

/**
 * @typedef {object} FeatureProperty
 * @type {object}
 * @property {string} label Label to be displayed for the property.
 * @property {string} key Name of the feature property to be described.
 * @property {("string"|"number"|"geometry"|"boolean")} type Input type.
 * @property {boolean} required Whether the input of this value is required.
 */

/**
 * @typedef {object} TransactionLayer
 * @type {object}
 * @property {string} featureNS Namespace of the features.
 * @property {string} featurePrefix Prefix used in combination with the featureType.
 * @property {string} featureType Used featureType.
 * @property {"showAll"|"ignore"|object} gfiAttributes How the properties of a feature should be displayed.
 * @property {boolean} isSelected Whether the layer is currently selected in the layer tree.
 * @property {string} name Human readable name.
 * @property {string} url Base url path of the service.
 * @property {string} version WFS version used.
 * @property {string} id Unique id of the service.
 * @property {boolean} isSecured Whether the access to the service has to be done with authorization.
 */

/**
 * WfsTransaction tool state definition.
 * @typedef {object} WfsTransactionState
 * @type {object}
 * @property {string} id Unique identifier of the store.
 * @property {boolean} active Whether the tool is currently active.
 * @property {string} name Title of the tool.
 * @property {string} icon Icon used together with `name`.
 * @property {ButtonConfig[]} areaButton Deprecated configuration of the different layers whether they should display the button to add polygons.
 * @property {boolean} edit Whether the features of the WFS-T layers should be editable.
 * @property {boolean} delete Whether it should be possible to delete features of the WFS-T layers.
 * @property {string[]} layerIds Ids of the configured WFS-T layers.
 * @property {ButtonConfig[]} lineButton Configuration of the different layers whether they should display the button to add lines.
 * @property {ButtonConfig[]} pointButton Configuration of the different layers whether they should display the button to add points.
 * @property {ButtonConfig[]} polygonButton Configuration of the different layers whether they should display the button to add polygons.
 * @property {boolean} toggleLayer Whether the already added features should be displayed while inserting new features.
 * @property {number} currentLayerIndex Index of the currently selected layer.
 * @property {FeatureProperty[]} featureProperties Possible properties to be set on a feature for the current layer.
 * @property {TransactionLayer[]} layerInformation Information about the different WFS-T layers configured for the tool.
 * @property {string|null} selectedInteraction Which selection is currently active, if any.
 */
const state = {
    id: "wfsTransaction",
    // General configuration
    active: false,
    name: "WfsTransaction",
    icon: "bi-globe",
    // Module specific configuration
    areaButton: [], // TODO(roehlipa): deprecate this --> polygonButton is the new one
    edit: false, // TODO(roehlipa): edit and delete should receive the same configuration possibilities as the buttons
    delete: false,
    layerIds: [],
    lineButton: [],
    pointButton: [],
    polygonButton: [],
    toggleLayer: false, // TODO(roehlipa): Implement me
    // Actual state
    currentLayerIndex: -1,
    featureProperties: [],
    layerInformation: [],
    selectedInteraction: null
};

export default state;
