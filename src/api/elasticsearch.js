import getProxyUrl from "../utils/getProxyUrl";
import axios from "axios";

let currentController = null;

/**
 * Main function to start the search using the requestConfig.
 * @param {Object} requestConfig The configuration of the xhr request.
 * @param {String} requestConfig.serviceId Id of the rest-service to be used. If serviceId is give, the url from the rest-service is taken.
 * @param {String} requestConfig.url If no serviceId is given, alternatively an url can be passed.
 * @param {String} requestConfig.type Type of request. "POST" or "GET".
 * @param {Object} requestConfig.payload Payload used to "POST" to url or be appended to url if type is "GET".
 * @param {Boolean} requestConfig.async Flag if request should be sent asynchronously.
 * @param {String} requestConfig.responseEntryPath="" The path of the hits in the response JSON. The different levels of the response JSON are marked with "."
 * @returns {Object} - The result object of the request.
 */
export async function initializeSearch (requestConfig) {
    const serviceId = Object.prototype.hasOwnProperty.call(requestConfig, "serviceId") ? requestConfig.serviceId : undefined,
        useProxy = Object.prototype.hasOwnProperty.call(requestConfig, "useProxy") ? requestConfig.useProxy : false,
        restService = Radio.request("RestReader", "getServiceById", serviceId);
    let result = {
            status: "success",
            message: "",
            hits: []
        },
        url = restService ? restService.get("url") : requestConfig.url;

    if (url) {
        url = useProxy ? getProxyUrl(url) : url;
        result = await sendRequest(url, requestConfig, result);
    }
    else {
        result.status = "error";
        result.message = "Cannot retrieve url by rest-service with id: " + serviceId + "! Please check the configuration for rest-services!";
        result.hits = [];
    }
    return result;
}

/**
 * Sends the request
 * @param {String} url url to send request.
 * @param {Object} requestConfig Config with all necccessary params for request.
 * @param {Object} result Result object.
 * @param {String} result.status Status of request "success" or "error".
 * @param {String} result.message Message of request.
 * @param {Object[]} result.hits Array of result hits.
 * @returns {Object} - Parsed result of request.
 */
export async function sendRequest (url, requestConfig, result) {
    const type = requestConfig.type || "POST",
        payload = requestConfig.payload || undefined,
        urlWithPayload = type === "GET" ? url + JSON.stringify(payload) : url,
        controller = new AbortController();
    let resultWithHits = result,
        res = null;

    if (currentController) {
        currentController.abort();
    }
    currentController = controller;

    if (type === "GET") {
        res = await axios.get(urlWithPayload, {
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            signal: controller.signal
        });
        resultWithHits = res.data.hits;
        return resultWithHits;
    }
    else if (type === "POST") {
        res = await axios.post(url, {
            payload: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            signal: controller.signal
        });
        resultWithHits = res.data.hits;
        return resultWithHits;
    }
    return undefined;
}
