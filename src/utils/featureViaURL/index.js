import addGeoJSON from "../addGeoJSON.js";
import store from "../../app-store";

const gfiAttributes = {
        featureLabel: "",
        coordLabel: "",
        typeLabel: ""
    },
    layerIds = [];

/**
 * Creates a basic GeoJSON structure and adds the features given by the user from the URL to it.
 *
 * @param {Object[]} features The features given by the user to be added to the map.
 * @param {String} geometryType Geometry type of the given features.
 * @param {Number} [epsg=4326] The EPSG-Code in which the features are coded.
 * @returns {Object} GeoJSON containing the features.
 */
function createGeoJSON (features, geometryType, epsg = 4326) {
    const geoJSON = {
        type: "FeatureCollection",
        crs: {
            type: "link",
            properties: {
                href: "http://spatialreference.org/ref/epsg/" + epsg + "/proj4/",
                type: "proj4"
            }
        },
        features: []
    };
    let coordinates,
        featureJSON,
        flag = false;

    features.forEach(feature => {
        coordinates = feature.coordinates;
        if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0 || !feature.label) {
            flag = true;
            return;
        }

        featureJSON = {
            type: "Feature",
            geometry: {
                type: geometryType,
                coordinates: coordinates
            },
            properties: {
                featureLabel: feature.label,
                coordLabel: coordinates,
                typeLabel: geometryType
            }
        };
        geoJSON.features.push(featureJSON);
    });

    if (flag) {
        console.warn(i18next.t("common:modules.featureViaURL.messages.featureParsing"));
    }

    return geoJSON;
}

/**
 * Gets the layer for the given layerId and extracts the Ids of the features.
 *
 * @param {String} layerId Unique Id of the layer in which the features reside.
 * @returns {String[]} Array of FeatureIds.
 */
function getFeatureIds (layerId) {
    const featureArray = [],
        layer = Radio.request("Map", "getLayers").getArray().find(l => l.get("id") === layerId);

    if (typeof layer === "undefined") {
        console.warn(i18next.t("common:modules.featureViaURL.messages.layerNotFound"));
        return featureArray;
    }
    layer.getSource().getFeatures().forEach(feature => {
        featureArray.push(feature.getId());
    });
    return featureArray;
}

/**
 * Translates the values of this module, namely "coordLabel", "featureLabel", "folderName" and "typeLabel"
 * and updates the gfiAttributes on the added layers.
 *
 * @returns {void}
 */
function translate () {
    gfiAttributes.coordLabel = i18next.t("common:modules.featureViaURL.coordLabel");
    gfiAttributes.featureLabel = i18next.t("common:modules.featureViaURL.featureLabel");
    gfiAttributes.folderName = i18next.t("common:modules.featureViaURL.coordLabel");
    gfiAttributes.typeLabel = i18next.t("common:modules.featureViaURL.typeLabel");
    updateLayers();
}

/**
 * Updates the labels for the features for all layers.
 * NOTE: When the gfi-window is still open, the values are not yet translated.
 * It needs to be reopened so that the changes take effect.
 *
 * @returns {void}
 */
function updateLayers () {
    let layer;

    layerIds.forEach(id => {
        layer = Radio.request("Map", "getLayers").getArray().find(l => l.get("id") === id);
        if (typeof layer !== "undefined") {
            layer.get("gfiAttributes").featureLabel = gfiAttributes.featureLabel;
            layer.get("gfiAttributes").coordLabel = gfiAttributes.coordLabel;
            layer.get("gfiAttributes").typeLabel = gfiAttributes.typeLabel;
        }
    });
}

/**
 * Creates a basic GeoJSON structure and adds the features given by the user from the URL to it.
 *
 * @param {Object[]} features The features given by the user to be added to the map.
 * @param {String} geometryType Geometry type of the given features.
 * @param {Number} [epsg=4326] The EPSG-Code in which the features are coded.
 * @returns {Object} GeoJSON containing the features.
 */
export default function ({layers, epsg, zoomTo}) {
    Radio.on("i18next", "languageChanged", translate);

    store.watch(state => state.urlParams, params => {
        const urlLayers = params.featureViaURL ? JSON.parse(params.featureViaURL) : [],
            treeType = Radio.request("Parser", "getTreeType");
        let features,
            geoJSON,
            geometryType,
            layerId,
            parentId = "tree",
            pos;

        if (treeType === "custom") {
            Radio.trigger("Parser", "addFolder", gfiAttributes.folderName, "featureViaURLFolder", "Overlayer", 0, true, "modules.featureViaURL.folderName");
            parentId = "featureViaURLFolder";
        }

        urlLayers.forEach(layer => {
            layerId = layer.layerId;
            features = layer.features;
            pos = layers.findIndex(element => element.id === layerId);
            if (pos === -1) {
                console.error(i18next.t("common:modules.featureViaURL.messages.layerNotFound", {layerId}));
                return;
            }
            if (!layers[pos].name) {
                console.error(i18next.t("common:modules.featureViaURL.messages.noNameDefined", {layerId}));
                return;
            }
            geometryType = layer.type !== undefined ? layer.type : layers[pos].geometryType;
            if (geometryType !== "LineString" && geometryType !== "Point" && geometryType !== "Polygon" && geometryType !== "MultiPoint" && geometryType !== "MultiLineString" && geometryType !== "MultiPolygon") {
                console.error(i18next.t("common:modules.featureViaURL.messages.geometryNotSupported"), {layerId, geometryType});
                return;
            }
            if (!features || !Array.isArray(features) || features.length === 0) {
                Radio.trigger("Alert", "alert", i18next.t("common:modules.featureViaURL.messages.featureParsingAll"));
                return;
            }
            geoJSON = createGeoJSON(features, geometryType, epsg);
            if (geoJSON.features.length === 0) {
                Radio.trigger("Alert", "alert", i18next.t("common:modules.featureViaURL.messages.featureParsingNoneAdded"));
            }
            layerIds.push(layerId);
            addGeoJSON(layers[pos].name, layers[pos].id, geoJSON, layers[pos].styleId, parentId, gfiAttributes);
            if (typeof zoomTo !== "undefined" && (zoomTo === layerId || zoomTo.indexOf(layerId) !== -1)) {
                Radio.trigger("Map", "zoomToFilteredFeatures", getFeatureIds(layerId), layerId);
            }
        });
    }, {deep: true, immediate: true});
}
