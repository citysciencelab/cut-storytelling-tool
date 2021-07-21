const toolsNotInState = ["compareFeatures", "parcelSearch", "print", "featureLister", "layerSlider", "filter", "shadow", "virtualcity", "wfst", "styleWMS", "extendedFilter", "wfsFeatureFilter", "wfst"];

/**
 * Triggers at backbone Radio channel "ParametricURL": "ready".
 * @returns {void}
 */
export default function initParametricURL () {
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
