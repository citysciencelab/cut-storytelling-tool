import axios from "axios";
import {WFS} from "ol/format";
import store from "../../../../app-store";
import handleAxiosResponse from "../../../../utils/handleAxiosResponse";
import {buildFilter, buildStoredFilter} from "./buildFilter";

/**
 * Makes sure that the filter is ready to be used.
 * When in the config no outer clause is defined, this is added here.
 *
 * @param {(XML | XML[])} filter The filter to be adjusted.
 * @returns {String} The adjusted Filter.
 */
function adjustFilter (filter) {
    if (Array.isArray(filter)) {
        // If the user didn't insert a value, the array will be empty
        if (filter.length === 0) {
            return "";
        }
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
 * Searches the service for features based on the build or given filter.
 *
 * @param {Object} currentInstance The currently selected searchInstance.
 * @param {Object[]} currentInstance.literals Array of literals.
 * @param {String} currentInstance.requestConfig.layerId Id of the layer defined in the services.json. Here it is used to check if that is the case or if the layer was defined in the rest-service.json.
 * @param {Number} currentInstance.requestConfig.maxFeatures The maximum amount of features allowed.
 * @param {String} currentInstance.requestConfig.storedQueryId Id of the stored Query. If given, a WFS@2.0.0 is queried.
 * @param {Object} service The service to send the request to.
 * @param {?String} singleValueFilter If given, this filter should be used.
 * @returns {Promise} If the send request was successful, the found features are converted from XML to OL Features and returned.
 */
export function searchFeatures ({literals, requestConfig: {layerId, maxFeatures, storedQueryId}}, service, singleValueFilter = null) {
    const fromServicesJson = Boolean(layerId);
    let filter;

    if (singleValueFilter) {
        filter = singleValueFilter;
    }
    else {
        filter = storedQueryId ? buildStoredFilter(literals) : buildFilter(literals);
    }

    return sendRequest(service, filter, fromServicesJson, storedQueryId, maxFeatures)
        .then(data => new WFS({version: storedQueryId ? "2.0.0" : "1.1.0"}).readFeatures(data));
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
 * @param {(Number | String)} [maxFeatures = 8] Maximum amount of features to be returned by the service. If it is the String 'showAll' there are no restrictions.
 * @param {String} [featureType = undefined] FeatureType of the features which should be requested. Only given for queries for suggestions.
 * @returns {Promise} If the request was successful, the data of the response gets resolved.
 *                    If an error occurs (e.g. the service is not reachable or there was no such feature) the error is caught and the message is displayed as an alert.
 */
function sendRequest ({url, typeName}, filter, fromServicesJson, storedQueryId, maxFeatures = 8, featureType = undefined) {
    let requestUrl = url;

    if (fromServicesJson) {
        requestUrl += `?service=WFS&request=GetFeature&typeName=${featureType ? featureType : typeName}`;
    }
    requestUrl += maxFeatures === "showAll" ? "" : `&maxFeatures=${maxFeatures}`;
    requestUrl += storedQueryId ? storedFilter(filter, storedQueryId) : xmlFilter(filter);

    return axios.get(requestUrl)
        .then(response => handleAxiosResponse(response, "WfsSearch, searchFeatures, sendRequest"))
        .catch(error => store.dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.wfsSearch.searchError", {error})));
}
