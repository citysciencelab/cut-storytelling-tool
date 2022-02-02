import axios from "axios";
import {errorHandling} from "../utils/errorHandling";
import {WFS} from "ol/format.js";

/**
 * Handles the WFS GetFeature request by GET.
 * @param {String} url - URL that will be used for the request.
 * @param {Object} payload - The URL parameters(KVP) to be sent with the request.
 * @param {String} payload.version - The version of the WFS.
 * @param {String|String[]} payload.featureType - Name(s) of the feature type(s).
 * @param {String} [payload.propertyNames] - A comma separated list of feature properties to restrict the request.
 * @param {String} [payload.bbox] - A extent to restrict the request.
 * @returns {Promise<Object|String|undefined>} Promise object represents the GetFeature request.
 */
export function getFeatureGET (url, payload) {
    if (typeof url !== "string") {
        console.error(`api/wfs/getFeatureGET: Url is ${url}. Url has to be defined and a string.`);
        return undefined;
    }
    if (typeof payload !== "object" || Array.isArray(payload) === true || payload === null) {
        console.error(`api/wfs/getFeatureGET: Payload is ${payload}. Payload has to be defined and an object (not null).`);
        return undefined;
    }
    if (typeof payload.version !== "string") {
        console.error(`api/wfs/getFeatureGET: Version is ${payload.version}. Payload has to have the version attribute and it has to be a string.`);
        return undefined;
    }
    if (typeof payload.featureType !== "string" && Array.isArray(payload.featureType) === false) {
        console.error(`api/wfs/getFeatureGET: FeatureType is ${payload.featureType}. Payload has to have the featureType attribute and it has to be defined and a string or an array.`);
        return undefined;
    }

    const {featureType, version, propertyNames, bbox} = payload,
        options = {
            url,
            method: "GET",
            params: {
                // mandatory parameters
                service: "WFS",
                request: "GetFeature",
                version,
                typeName: Array.isArray(featureType) ? featureType.join(",") : featureType, // WFS 1.x.x
                typeNames: Array.isArray(featureType) ? featureType.join(",") : featureType, // WFS 2.x.x
                // optional parameters
                propertyName: propertyNames, // WFS 1.x.x
                propertyNames, // WFS 2.x.x
                bbox
            }
        };

    return axios(options)
        .then(response => response.data)
        .catch(error => errorHandling(error, "api/wfs/getFeatureGET"));
}

/**
 * Handles the WFS GetFeature request by POST.
 * @param {String} url - URL that will be used for the request.
 * @param {Object} payload - The URL parameters(KVP) to be sent with the request.
 * @param {String[]|module:ol/format/WFS~FeatureType[]} payload.featureTypes - The feature type names or FeatureType objects.
 * @see {@link https://openlayers.org/en/latest/apidoc/module-ol_format_WFS-WFS.html#writeGetFeature} For further information.
 * @returns {Promise<Object|String|undefined>} Promise object represents the GetFeature request.
 */
export function getFeaturePOST (url, payload) {
    if (typeof url !== "string") {
        console.error(`api/wfs/getFeaturePOST: Url is ${url}. Url has to be defined and a string.`);
        return undefined;
    }
    if (typeof payload !== "object" || Array.isArray(payload) === true || payload === null) {
        console.error(`api/wfs/getFeaturePOST: Payload is ${payload}. Payload has to be defined and an object (not null).`);
        return undefined;
    }
    if (Array.isArray(payload.featureTypes) === false) {
        console.error(`api/wfs/getFeaturePOST: FeatureTypes is ${payload.featureTypes}. FeatureTypes has to be defined and an array.`);
        return undefined;
    }

    // For now only implemented for version 1.1.0. WFS format by default, supports WFS version 1.1.0 (ol v6.10.0).
    const {featureTypes, srsName, featureNS, propertyNames, geometryName, bbox, filter} = payload,
        requestBody = new WFS().writeGetFeature({
            srsName,
            featureNS,
            featureTypes,
            propertyNames,
            geometryName,
            bbox,
            filter
        }),
        options = {
            method: "POST",
            // axios content-type default is 'application/x-www-form-urlencoded'
            headers: {"content-type": "text/xml"},
            data: new XMLSerializer().serializeToString(requestBody),
            url
        };

    return axios(options)
        .then(response => response.data)
        .catch(error => errorHandling(error, "api/wfs/getFeaturePOST"));
}
