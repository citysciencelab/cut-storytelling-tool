/**
 * User type definition
 * @typedef {Object} layerInformationState
 * @property {boolean} active if true LayerInformation will be shown
 * @property {string} metaDataCatalogueId id of the MateDataCatalogue
 * @property {string} datePublication the date of the publication
 * @property {string} dateRevision the date of the revision
 * @property {array} downloadLinks the download Links
 * @property {string} periodicityKey the key for the periodicity
 * @property {Object} layerInfo additional layer Information
 * @property {Object} additionalLayer additional layer Information for group layer
 * @property {string} abstractText the abstract Info text
 * @property {string} title the layer Title
 * @property {string} noMetadataLoaded no metadata Loaded Text
 * @property {array} metaURLs the metadata URLs
 * @property {string} currentLayerName the current Layer Name in case of group layers
 * @property {boolean} showUrlGlobal parameter to globally toggle the dispaly of the service url for all layers
 */
export default {
    active: false,
    // default value 2, will be overwritten in mounted hook in LayerInformation.vue
    metaDataCatalogueId: "2",
    datePublication: "",
    dateRevision: "",
    downloadLinks: null,
    periodicityKey: "",
    layerInfo: {},
    additionalLayer: {},
    abstractText: "",
    title: "",
    noMetadataLoaded: "",
    metaURLs: [],
    currentLayerName: "",
    showUrlGlobal: null
};
