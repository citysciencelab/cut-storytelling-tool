
const toolsNotInState = ["compareFeatures", "parcelSearch", "print", "featureLister", "layerSlider", "filter", "shadow", "virtualcity", "wfst", "styleWMS", "extendedFilter", "wfsFeatureFilter", "wfst"];

/**
 * Triggers at backbone Radio channel "ParametricURL": "ready".
 * @returns {void}
 */
export function triggerParametricURLReady () {
    Radio.channel("ParametricURL").trigger("ready");
}

/**
 * Returns key and value containing previous content to handle in backbone model.
 * @param {String} urlParamsKey key of url params
 * @param {String} urlParamsValue value of url params
 * @returns {Object} containg key and value containing previous content to handle in backbone model
 */
export function translateToBackbone (urlParamsKey, urlParamsValue) {
    // console.log("translateToBackbone urlParamsKey:", urlParamsKey);
    const paramsKey = urlParamsKey.toLowerCase().trim();

    if (paramsKey.startsWith("tools") || paramsKey.indexOf("/active") > -1) {
        const toolSplitted = urlParamsKey.trim().split("/");

        return {key: "isinitopen", value: toolSplitted[toolSplitted.length - 2]};
    }
    else if (toolsNotInState.find(toolName=>toolName.toLowerCase() === paramsKey.toLocaleLowerCase())) {
        return {key: "isinitopen", value: paramsKey};
    }
    return {key: urlParamsKey, value: urlParamsValue};
}

/**
 * Depending on given key and value special handling in backbone world is triggered.
 * @param {String} key key of url params
 * @param {String} value  value of url params
 * @returns {void}
 */
export function doSpecialBackboneHandling (key, value) {
    if (key === "Map/mapMode") {
        Radio.trigger("Map", "mapChangeTo3d");
    }
}
