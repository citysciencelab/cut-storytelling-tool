import store from "../../../../app-store";
import {intersects} from "ol/extent.js";
import LayerGroup from "ol/layer/Group";

/**
 * Returns the map projection.
 * @returns {String} the projection
 */
function getMapProjection () {
    return store.getters["Maps/projection"].getCode();
}

/**
 * Returns all features of a layer specified with the given layerId.
 * @param {String} layerId the id of the layer
 * @returns {ol/Feature[]} the features
 */
function getFeaturesByLayerId (layerId) {
    let layer = Radio.request("ModelList", "getModelByAttributes", {id: layerId});

    if (!layer || !layer?.has("layer")) {
        return [];
    }

    if (layer.get("isClustered")) {
        return layer.get("layer").getSource().getSource().getFeatures();
    }

    if (layer.layer instanceof LayerGroup) {
        const layerSource = layer.get("layerSource");

        layerSource.forEach(childLayer => {
            if (childLayer.id === layerId) {
                layer = childLayer;
            }
        });

        return layer.layer.getSource().getFeatures();
    }

    return layer.get("layer").getSource().getFeatures();
}

/**
 * Returns the current browser extent.
 * @returns {ol/Extent} The current browser extent.
 */
function getCurrentExtent () {
    return store.getters["Maps/getCurrentExtent"];
}

/**
 * Checks if the given feature is in the current map extent of the browser.
 * @param {ol/Feature} feature the feature to check
 * @returns {Boolean} true if the feature is in the current map extent of the browser
 */
function isFeatureInMapExtent (feature) {
    const mapExtent = getCurrentExtent();

    return intersects(mapExtent, feature.getGeometry().getExtent());
}

/**
 * Checks if the given geometry intersects with the extent of the given feature.
 * @param {ol/Feature} feature the feature to check
 * @param {ol/Geometry} geometry the geometry to intersect with
 * @returns {Boolean} true if the feature intersects the geometry
 */
function isFeatureInGeometry (feature, geometry) {
    if (typeof geometry?.intersectsExtent !== "function") {
        return false;
    }
    return geometry.intersectsExtent(feature.getGeometry().getExtent());
}

/**
 * Returns the layer for the given layerId.
 * @param {String} layerId the id of the layer
 * @returns {ol/Layer} the layer
 */
function getLayerByLayerId (layerId) {
    return Radio.request("ModelList", "getModelByAttributes", {id: layerId});
}

/**
 * Shows the features with the given ids on the given layer
 * @param {String} layerId the id of the layer
 * @param {String[]} ids a list of feature ids
 * @returns {void}
 */
function showFeaturesByIds (layerId, ids) {
    Radio.trigger("ModelList", "showFeaturesById", layerId, ids);
}

/**
 * Creates a new layer or returns the existing one for a specific layer name.
 * @param {String} layername the id of the new layer
 * @returns {ol/Layer} the layer
 */
function createLayerIfNotExists (layername) {
    return Radio.request("Map", "createLayerIfNotExists", layername);
}

/**
 * Zooms to an extent of a feature considering the min scale.
 * @param {Number} minScale the minimum scale
 * @param {String[]} featureIds the filtered feature Ids
 * @param {String} layerId the layer Id
 * @param {Function} callback the callback to call when zoom has finished
 * @returns {void}
 */
function liveZoom (minScale, featureIds, layerId, callback) {
    // eslint-disable-next-line new-cap
    const minResolution = store.getters["Maps/getResolutionByScale"](minScale);

    store.dispatch("Maps/zoomToFilteredFeatures", {ids: featureIds, layerId: layerId, zoomOptions: {
        minResolution,
        callback
    }});
}

/**
 * Adds a layer model by the given layerId.
 * @param {String} layerId the layer Id
 * @returns {void}
 */
function addLayerByLayerId (layerId) {
    Radio.trigger("ModelList", "addModelsByAttributes", {id: layerId});
}

/**
 * Sets the given value at the key position of the layer configuration.
 * This affects only the parser and not the layer if it already exists.
 * Use this function to manipulate the layer config before layer creation.
 * @param {String} layerId the layer Id
 * @param {String} key the config key to change
 * @param {*} value the value to change the old value to
 * @returns {void}
 */
function setParserAttributeByLayerId (layerId, key, value) {
    const lightModels = Radio.request("Parser", "getItemsByAttributes", {id: layerId});

    if (Array.isArray(lightModels) && lightModels.length === 1) {
        lightModels[0][key] = value;
    }
}

/**
 * Returns all current layers.
 * @returns {ol/Layer[]} a list of layers
 */
function getLayers () {
    return mapCollection.getMap("2D").getLayers();
}

/**
 * Check if current ui style is table
 * @returns {Boolean} true/false if current ui style of portal is table
 */
function isUiStyleTable () {
    return store.getters.uiStyle === "TABLE";
}

/**
 * Setting the filter in table Menu
 * @param {Object} element the html element in Object
 * @returns {void}
 */
function setFilterInTableMenu (element) {
    Radio.trigger("TableMenu", "appendFilter", element);
}

/**
 * Returns the infos from info.json.
 * @returns {Object} an object with key value pairs as attrName and text content
 */
function getSnippetInfos () {
    return Radio.request("Parser", "getSnippetInfos");
}

export {
    getMapProjection,
    createLayerIfNotExists,
    getFeaturesByLayerId,
    getLayerByLayerId,
    getCurrentExtent,
    isFeatureInMapExtent,
    isFeatureInGeometry,
    liveZoom,
    showFeaturesByIds,
    addLayerByLayerId,
    setParserAttributeByLayerId,
    getLayers,
    isUiStyleTable,
    setFilterInTableMenu,
    getSnippetInfos
};
