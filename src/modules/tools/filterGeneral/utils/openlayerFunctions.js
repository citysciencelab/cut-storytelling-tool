import {intersects} from "ol/extent.js";

/**
 * Returns all features of a layer specified with the given layerId.
 * @param {String} layerId the id of the layer
 * @returns {ol/Feature[]} the features
 */
function getFeaturesByLayerId (layerId) {
    const layer = Radio.request("ModelList", "getModelByAttributes", {id: layerId});

    if (!layer || !layer?.has("layer")) {
        return [];
    }
    return layer.get("layer").getSource().getFeatures();
}

/**
 * Checks if the given feature is in the current map extent of the browser.
 * @param {ol/Feature} feature the feature to check
 * @returns {Boolean} true if the feature is in the current map extent of the browser
 */
function isFeatureInMapExtent (feature) {
    const mapExtent = Radio.request("MapView", "getCurrentExtent");

    return intersects(mapExtent, feature.getGeometry().getExtent());
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
 * @param {ol/Layer} layer the layer to show the features on
 * @param {String[]} ids a list of feature ids
 * @returns {void}
 */
function showFeaturesByIds (layer, ids) {
    Radio.trigger("ModelList", "showFeaturesById", layer, ids);
}

/**
 * Creates a new layer or returns the existing one for a specific layer name.
 * @param {String} layername the id of the new layer
 * @returns {ol/Layer} the layer
 */
function createLayerIfNotExists (layername) {
    return Radio.request("Map", "createLayerIfNotExists", layername);
}


export {
    getFeaturesByLayerId,
    isFeatureInMapExtent,
    getLayerByLayerId,
    showFeaturesByIds,
    createLayerIfNotExists
};
