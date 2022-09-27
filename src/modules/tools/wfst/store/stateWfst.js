/**
 * @typedef {Object} ButtonConfig
 * @type {Object}
 * @param {String} layerId Id of the layer this configuration belongs to.
 * @param {Boolean} show Whether the button should be visible for the layer with this layerId.
 * @param {String} [caption] Caption to be shown for the button. Deprecated in v3.0.0 in favour of text.
 * @param {String} [text] Text to be displayed for the button
 * @param {String} [icon] Bootstrap icon displayed inside the button.
 * @param {Boolean} [multi] Whether the drawn geometries should be Multi-X.
 */

/**
 * @typedef {Object} FeatureProperty
 * @type {Object}
 * @property {String} label Label to be displayed for the property.
 * @property {String} key Name of the feature property to be described.
 * @property {("string"|"integer"|"int"|"decimal"|"geometry"|"boolean"|"date")} type Input type.
 * @property {Boolean} required Whether the input of this value is required.
 * @property {*} value Value of the property.
 */

/**
 * @typedef {Object} TransactionLayer
 * @type {Object}
 * @property {String} featureNS Namespace of the features.
 * @property {String} featurePrefix Prefix used in combination with the featureType.
 * @property {String} featureType Used featureType.
 * @property {"showAll"|"ignore"|object} gfiAttributes How the properties of a feature should be displayed.
 * @property {Boolean} isSelected Whether the layer is currently selected in the layer tree.
 * @property {String} name Human readable name.
 * @property {String} url Base url path of the service.
 * @property {String} version WFS version used.
 * @property {String} id Unique id of the service.
 * @property {Boolean} isSecured Whether the access to the service has to be done with authorization.
 */

/**
 * WfsTransaction tool state definition.
 * @typedef {Object} WfsTransactionState
 * @type {Object}
 * @property {String} id Unique identifier of the store.
 * @property {Boolean} active Whether the tool is currently active.
 * @property {Boolean} deactivateGFI Whether the gfi tool should be deactivated when this tool is started.
 * @property {String} name Title of the tool.
 * @property {String} icon Icon used together with `name`.
 * @property {ButtonConfig[]} areaButton Deprecated configuration of the different layers whether they should display the button to add polygons.
 * @property {(ButtonConfig[]|Boolean)} edit Whether the features of the WFS-T layers should be editable. Deprecated in v3.0.0.
 * @property {(ButtonConfig[]|Boolean)} delete Whether it should be possible to delete features of the WFS-T layers.
 * @property {String[]} layerIds Ids of the configured WFS-T layers.
 * @property {String} layerSelectLabel Label used for the layer select. Deprecated in v3.0.0.
 * @property {(ButtonConfig[]|Boolean)} lineButton Configuration of the different layers whether they should display the button to add lines.
 * @property {(ButtonConfig[]|Boolean)} pointButton Configuration of the different layers whether they should display the button to add points.
 * @property {(ButtonConfig[]|Boolean)} polygonButton Configuration of the different layers whether they should display the button to add polygons.
 * @property {(ButtonConfig[]|Boolean)} update Whether the features of the WFS-T layers should be to be updated.
 * @property {Boolean} useProxy Whether a proxy should be used for requests. Deprecated in v3.0.0.
 * @property {Boolean} toggleLayer Whether the already added features should be displayed while inserting new features.
 * @property {Number} currentLayerIndex Index of the currently selected layer.
 * @property {FeatureProperty[]} featureProperties Possible properties to be set on a feature for the current layer.
 * @property {TransactionLayer[]} layerInformation Information about the different WFS-T layers configured for the tool.
 * @property {("LineString"|"Point"|"Polygon"|"delete"|"updated"|"selectedUpdate"|null)} selectedInteraction Which selection is currently active, if any.
 */
const state = {
    id: "wfst",
    // General configuration
    active: false,
    deactivateGFI: true,
    name: "WfsTransaction",
    icon: "bi-globe",
    // Module specific configuration
    areaButton: [],
    edit: false,
    update: false,
    delete: false,
    layerIds: [],
    layerSelectLabel: "common:modules.tools.wfsTransaction.layerSelectLabel",
    lineButton: [],
    pointButton: [],
    polygonButton: [],
    useProxy: false,
    toggleLayer: false,
    // Actual state
    currentLayerIndex: -1,
    featureProperties: [],
    layerInformation: [],
    selectedInteraction: null
};

export default state;
