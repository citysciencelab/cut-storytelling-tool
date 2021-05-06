import axios from "axios";
import handleAxiosResponse from "../../../../utils/handleAxiosResponse";

/**
 * Makes sure that the filter is ready to be used.
 * When in the config no outer clause is defined, this is added here.
 *
 * @param {(XML | XML[])} filter The filter to be adjusted.
 * @returns {XML} The adjusted Filter.
 */
function adjustFilter (filter) {
    if (Array.isArray(filter)) {
        // TODO: Add case for when the filter array is empty because a user didn't insert a value -> all features!
        return filter.length > 1 ? `<And>${filter.join("")}</And>` : filter[0];
    }

    return filter;
}

/**
 * Returns the version, storedQuery and filter to the request url for a WFS@2.0.0.
 *
 * @param {String} filter The filter consisting of Url parameters to be added to the request url.
 * @param {String} storedQueryId The Id of the stored Query of the service.
 * @returns {String} The added parts for the request url.
 */
function storedFilter (filter, storedQueryId) {
    return `&version=2.0.0&StoredQuery_ID=${storedQueryId + filter}`;
}

/**
 * Returns the version and filter to the request url for a WFS@1.1.0
 *
 * @param {XML} filter The filter written in XML.
 * @returns {String} The added parts for the request Url.
 */
function xmlFilter (filter) {
    return `&version=1.1.0&filter=${adjustFilter(filter)}`;
}

/**
 * Builds the request url and sends a GetFeature request via GET to the service.
 *
 * @param {Object} service The service to send the request to.
 * @param {String} service.url The base Url as defined in the services.json or rest-services.json.
 * @param {String} service.typeName If the Url was defined in the services.json, the typeName is set to be added to the Url.
 * @param {(XML | String)} filter The filter to constrain the returned features.
 * @param {Boolean} fromServicesJson Whether the service was defined in the services.json or the rest-service.json.
 * @param {String} storedQueryId The Id of the Stored Query. Present when using a WFS@2.0.0.
 * @param {Number} [maxFeatures=8] Maximum amount of features to be returned by the service.
 * @returns {Promise} If the request was successful, the data of the response gets resolved.
 *                    If an error occurs (e.g. the service is not reachable or there was no such feature) the promise gets rejected.
 */
export function sendRequest ({url, typeName}, filter, fromServicesJson, storedQueryId, maxFeatures = 8) {
    let requestUrl = url;

    if (fromServicesJson) {
        requestUrl += `?service=WFS&request=GetFeature&typeName=${typeName}`;
    }
    requestUrl += `&maxFeatures=${maxFeatures}`;
    requestUrl += storedQueryId ? storedFilter(filter, storedQueryId) : xmlFilter(filter);

    return axios.get(requestUrl)
        .then(response => handleAxiosResponse(response, "WfsSearch, searchFeatures, sendRequest"))
        .catch(err => console.error("OHOH", err)); // TODO: Proper Error handling
}
