import isObject from "../../../../utils/isObject.js";
import axios from "axios";
import hash from "object-hash";

/**
 * InterfaceGeojsonExtern is the filter interface for Geojson services
 * @class
 */
export default class InterfaceGeojsonExtern {
    /**
     * @constructor
     */
    constructor () {
        this.cache = {};
        this.waitinglist = {};
    }

    /**
     * Returns an object {attrName: Type} with all attributes and their types.
     * @param {Object} service the service to call, identical to filterQuestion.service
     * @param {Function} onsuccess a function({attrName: Type}[])
     * @param {Function} onerror a function(errorMsg)
     * @param {Object} [axiosMock=false] an object to mock axios with
     * @returns {void}
     */
    getAttrTypes (service, onsuccess, onerror, axiosMock = false) {
        this.handleGeojsonRequest(service, geojson => {
            if (
                !isObject(geojson)
                || geojson.type !== "FeatureCollection"
                || !Array.isArray(geojson.features)
                || !geojson.features.length
                || !isObject(geojson.features[0])
                || !isObject(geojson.features[0].properties)
            ) {
                if (typeof onerror === "function") {
                    onerror(new Error("InterfaceGeojsonExtern.getUniqueValues: The received geojson has not the expected format."));
                }
                return;
            }
            const result = {};

            Object.entries(geojson.features[0].properties).forEach(([key, value]) => {
                result[key] = typeof value;
            });
            if (typeof onsuccess === "function") {
                onsuccess(result);
            }
        }, onerror, axiosMock);
    }

    /**
     * Returns the min and max value of the given service and attrName.
     * @param {Object} service the service to call, identical to filterQuestion.service
     * @param {String} attrName the attribute to receive the min and max value from
     * @param {Function} onsuccess a function({min, max}) with the received value
     * @param {Function} onerror a function(errorMsg)
     * @param {Boolean} [minOnly=false] if only min is of interest
     * @param {Boolean} [maxOnly=false] if only max is of interest
     * @param {Object} [axiosMock=false] an object to mock axios
     * @returns {void}
     */
    getMinMax (service, attrName, onsuccess, onerror, minOnly = false, maxOnly = false, axiosMock = false) {
        this.handleGeojsonRequest(service, geojson => {
            if (
                !isObject(geojson)
                || geojson.type !== "FeatureCollection"
                || !Array.isArray(geojson.features)
            ) {
                if (typeof onerror === "function") {
                    onerror(new Error("InterfaceGeojsonExtern.getUniqueValues: The received geojson has not the expected format."));
                }
                return;
            }
            let min = false,
                max = false;
            const result = {};

            geojson.features.forEach(feature => {
                if (!isObject(feature.properties) || !Object.prototype.hasOwnProperty.call(feature.properties, attrName)) {
                    return;
                }
                const value = feature.properties[attrName];

                if (min === false || value < min) {
                    min = value;
                }
                if (max === false || value > max) {
                    max = value;
                }
            });
            if (minOnly && maxOnly || !minOnly && !maxOnly) {
                result.min = min;
                result.max = max;
            }
            else if (minOnly) {
                result.min = min;
            }
            else if (maxOnly) {
                result.max = max;
            }
            if (typeof onsuccess === "function") {
                onsuccess(result);
            }
        }, onerror, axiosMock);
    }

    /**
     * Returns a list of unique value (unsorted) of the given service and attrName.
     * @param {Object} service the service to call, identical to filterQuestion.service
     * @param {String} attrName the attribute to receive unique value from
     * @param {Function} onsuccess a function([]) with the received unique value as Array of value
     * @param {Function} onerror a function(errorMsg)
     * @param {Object} [axiosMock=false] an object to mock axios
     * @returns {void}
     */
    getUniqueValues (service, attrName, onsuccess, onerror, axiosMock = false) {
        this.handleGeojsonRequest(service, geojson => {
            if (
                !isObject(geojson)
                || geojson.type !== "FeatureCollection"
                || !Array.isArray(geojson.features)
            ) {
                if (typeof onerror === "function") {
                    onerror(new Error("InterfaceGeojsonExtern.getUniqueValues: The received geojson has not the expected format."));
                }
                return;
            }
            const result = {};

            geojson.features.forEach(feature => {
                if (!isObject(feature.properties) || !Object.prototype.hasOwnProperty.call(feature.properties, attrName)) {
                    return;
                }
                result[feature.properties[attrName]] = true;
            });
            if (typeof onsuccess === "function") {
                onsuccess(Object.keys(result));
            }
        }, onerror, axiosMock);
    }

    /**
     * Cancels the current request.
     * @pre a request is send to the server and the data is still loading
     * @post the request is terminated and the server response is aborted
     * @param {Number} filterId the id of the filter that should stop
     * @param {Function} onsuccess a function to call when finished
     * @param {Function} onerror a function to call on error
     * @returns {void}
     */
    stop (filterId, onsuccess, onerror) {
        onerror(new Error("InterfaceGeojsonExtern: stop not implemented, no external filtering with geojson"));
    }

    /**
     * Filters the given filterQuestion and returns the resulting filterAnswer.
     * @param {Object} filterQuestion an object with filterId, service and rules
     * @param {Function} onsuccess a function(filterAnswer)
     * @param {Function} onerror a function(errorMsg)
     * @param {Function|Boolean} [axiosMock=false] false to use axios, an object with get function(url, {params}) if mock is needed
     * @returns {void}
     */
    filter (filterQuestion, onsuccess, onerror, axiosMock = false) {
        if (axiosMock) {
            onerror(new Error("InterfaceGeojsonExtern: filter not implemented for testing, no external filtering with geojson"));
        }
        else {
            onerror(new Error("InterfaceGeojsonExtern: filter not implemented, no external filtering with geojson"));
        }
    }

    /**
     * Receives the geojson if needed, handles parallel requests.
     * @param {Object} service the service to call and to use as hash key
     * @param {Function} onsuccess a function() with the received geojson
     * @param {Function} onerror a function(errorMsg)
     * @param {Object} [axiosMock=false] an object to mock axios
     * @returns {void}
     */
    handleGeojsonRequest (service, onsuccess, onerror, axiosMock = false) {
        if (!isObject(service)) {
            if (typeof onerror === "function") {
                onerror(new Error("InterfaceGeojsonExtern.handleGeojsonRequest: missing service object"));
            }
            return;
        }
        const axiosObject = isObject(axiosMock) ? axiosMock : axios,
            hashKey = hash.sha1(JSON.stringify(service));

        if (Object.prototype.hasOwnProperty.call(this.cache, hashKey)) {
            if (typeof onsuccess === "function") {
                onsuccess(this.cache[hashKey]);
            }
        }
        else if (!Array.isArray(this.waitinglist[hashKey])) {
            this.waitinglist[hashKey] = [];
            if (typeof onsuccess === "function") {
                this.waitinglist[hashKey].push(onsuccess);
            }
            axiosObject.get(service.url)
                .then(response => {
                    if (!isObject(response) || !isObject(response.data)) {
                        if (typeof onerror === "function") {
                            onerror(new Error("InterfaceGeojsonExtern.handleGeojsonRequest: the response data does not exist"));
                        }
                        return;
                    }
                    this.cache[hashKey] = response.data;

                    while (this.waitinglist[hashKey].length) {
                        this.waitinglist[hashKey].shift()(response.data);
                    }
                }).catch(error => {
                    if (typeof onerror === "function") {
                        onerror(error);
                    }
                });
        }
        else if (typeof onsuccess === "function") {
            this.waitinglist[hashKey].push(onsuccess);
        }
    }
}
