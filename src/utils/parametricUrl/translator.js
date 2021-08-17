import convert from "./converter";
import requestConfig from "../configLoader";
import {toMapMode} from "../../modules/map/store/enums";

/**
 * Translates key and value to vuex state readable kind. Converts the value from string to type.
 * @param {String} urlParamsKey key of url params
 * @param {String} urlParamsValue value of url params
 * @returns {Object} containes translated key and value
 */
export async function translate (urlParamsKey, urlParamsValue) {
    const checked = check(urlParamsKey, urlParamsValue),
        checkedKey = checked.key,
        checkedValue = checked.value;

    switch (checkedKey.toLowerCase()) {
        case "isinitopen":
        case "startupmodul": {
            const key = "Tools/" + checkedValue + "/active",
                value = true;

            if (checkedKey.toLowerCase() === "startupmodul") {
                console.warn("Url Parameter 'STARTUPMODUL' is deprecated in version 3.0.0. Please use '" + key + "=true' instead.");
            }

            return {key: key, value: value};
        }
        case "lng": {
            checkIfLanguageEnabled();
            return {key: checkedKey.toLowerCase(), value: convert(checkedValue)};
        }
        case "style": {
            return {key: "uiStyle", value: convert(checkedValue)};
        }
        case "center":
        case "map/center": {
            const key = "Map/center",
                value = convert(urlParamsValue);

            return {key: key, value: value};
        }
        case "zoomlevel":
        case "map/zoomlevel": {
            const key = "Map/zoomLevel",
                value = parseInt(urlParamsValue, 10);

            return {key: key, value: value};
        }
        case "zoomtoextent":
        case "map/zoomtoextent": {
            const key = "Map/zoomToExtent",
                value = convert(urlParamsValue);

            return {key: key, value: value};
        }
        case "zoomtogeometry":
        case "bezirk":
        case "map/zoomtogeometry": {
            const key = "Map/zoomToGeometry",
                value = urlParamsValue;

            if (checkedKey.toLowerCase() === "bezirk") {
                console.warn("Url Parameter 'BEZIRK' is deprecated in version 3.0.0. Please use 'Map/zoomToGeometry' instead.");
            }
            return {key: key, value: value};
        }
        case "map":
        case "mapmode":
        case "map/mapmode": {
            const key = "Map/mapMode",
                value = toMapMode(urlParamsValue);

            return {key: key, value: value};
        }
        case "layerids":
        case "map/layerids": {
            const key = "Map/layerIds",
                value = convert(urlParamsValue);

            return {key: key, value: value};
        }
        case "featureid":
        case "zoomtofeatureid":
        case "map/zoomtofeatureid": {
            const key = "Map/zoomToFeatureId",
                value = convert(urlParamsValue);

            return {key: key, value: value};
        }
        case "featureviaurl": {
            const key = "featureViaURL",
                value = urlParamsValue;

            return {key: key, value: value};
        }
        case "highlightfeature":
        case "map/highlightfeature": {
            const key = "Map/highlightFeature",
                value = urlParamsValue;

            return {key: key, value: value};
        }
        case "projection":
        case "map/projection": {
            const key = "projection",
                value = convert(urlParamsValue);

            return {key: key, value: value};
        }
        case "config":
        case "configjson": {
            const key = "configJson",
                value = requestConfig(urlParamsValue).then(response => {
                    return response.data;
                });

            return {key: key, value: await value};
        }
        case "marker":
        case "mapmarker": {
            const key = "MapMarker/coordinates",
                value = convert(urlParamsValue);

            return {key: key, value: value};
        }
        default: {
            return {key: checkedKey, value: convert(checkedValue)};
        }
    }
}

/**
 * Checks key and value for translation, e.g. kmlimport is translated to FileImport.
 * @param {String} key key of url params
 * @param {String} value value of url params
 * @returns {Object} containes checked and modified key and value
 */
function check (key, value) {
    let checkedKey = checkForTools(key);
    const checkedValue = checkForKmlImport(value);

    checkedKey = checkForKmlImport(checkedKey);
    return {key: checkedKey, value: checkedValue};

}
/**
 * Checks string matching 'tools' and replaces it with 'Tools'.
 * @param {String} string a string
 * @returns {String} modified string
 */
function checkForTools (string) {
    if (typeof string === "string" && string.match(/tools/gi) !== null) {
        return string.replace(/tools/i, "Tools");
    }
    return string;
}
/**
 * Checks string matching 'kmlimport' and replaces it with 'FileImport'.
 * @param {String} string a string
 * @returns {String} modified string
 */
function checkForKmlImport (string) {
    if (typeof string === "string" && string.match(/kmlimport/gi) !== null) {
        return string.replace(/kmlimport/i, "FileImport");
    }
    return string;
}

/**
     * Checks, if the language is dis- or enabled in the config.js
     * @returns {void}
     */
function checkIfLanguageEnabled () {
    if (Config.portalLanguage !== undefined && !Config.portalLanguage.enabled) {
        console.warn("You specified the URL-parameter lng, but disabled the language in the config.js.");
    }
}
