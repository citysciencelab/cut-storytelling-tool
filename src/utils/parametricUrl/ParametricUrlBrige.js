import {getLayerWhere} from "masterportalAPI/src/rawLayerList";
import convert from "./converter";
import store from "../../app-store";

const toolsNotInState = ["compareFeatures", "parcelSearch", "print", "featureLister", "layerSlider", "filter", "shadow", "virtualcity", "wfst", "styleWMS", "extendedFilter", "wfsFeatureFilter", "wfst"];

/**
 * Sets url params to state, which are used before mount of vue-app.
 * @returns {void}
 */
export function handleUrlParamsBeforeVueMount () {
    const params = new URLSearchParams(window.location.search);

    params.forEach(function (value, key) {
        if (key.toLowerCase() === "style" || key.toLowerCase() === "uistyle") {
            const valueUpperCase = value.toUpperCase();

            if (valueUpperCase === "TABLE" || valueUpperCase === "SIMPLE") {
                store.state.urlParams.uiStyle = valueUpperCase;
            }
        }
    });
}

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
 * @param {String} state vuex state
 * @param {String} key key of url params
 * @param {String} value  value of url params
 * @returns {void}
 */
export function doSpecialBackboneHandling (state, key, value) {
    if (key === "Map/mapMode") {
        Radio.trigger("Map", "mapChangeTo3d");
    }
    else if (key === "Map/layerIds") {
        createLayerParams(state, value);
    }
    else if (key === "Map/zoomToExtent") {
        Radio.trigger("Map", "zoomToExtent", convert(store.state.urlParams?.["Map/zoomToExtent"]), {duration: 0}, store.state.urlParams?.projection);
    }
    else if (key === "style") {
        const resultUpperCase = value.toUpperCase();

        if (resultUpperCase === "TABLE" || resultUpperCase === "SIMPLE") {
            Radio.trigger("Util", "setUiStyle", resultUpperCase);
        }
    }
}

/**
     * Creates or adds the models of the layerIds and sets them visible in map depending on url param visibility and transpyrency.
     * @param {Object} state vuex state
     * @param {string} layerIdString the layerIds.
     * @returns {void}
     */
function createLayerParams (state, layerIdString) {
    const wrongIdsPositions = [],
        visibilityListBooleans = state.urlParams?.visibility ? state.urlParams.visibility : null,
        transparencyListNumbers = state.urlParams?.transparency ? state.urlParams.transparency : null;
    let layerIdList = convert(layerIdString),
        visibilityList = visibilityListBooleans,
        transparencyList = transparencyListNumbers;

    if (typeof layerIdList === "string") {
        layerIdList = [layerIdList];
    }
    if (typeof visibilityListBooleans === "boolean") {
        visibilityList = [visibilityListBooleans];
    }
    if (typeof transparencyListNumbers === "string") {
        transparencyList = [transparencyListNumbers];
    }

    // Read out visibility. If missing true
    if (visibilityListBooleans === null) {
        visibilityList = layerIdList.map(() => true);
    }

    // Read out transparency value. If missing null.
    if (transparencyListNumbers === null) {
        transparencyList = layerIdList.map(() => 0);
    }

    if (layerIdList.length !== visibilityList.length || visibilityList.length !== transparencyList.length) {
        store.dispatch("Alerting/addSingleAlert", i18next.t("modules.core.parametricURL.alertWrongAmountVisibility"), {root: true, category: "Warning"});
        return;
    }

    layerIdList.forEach((val, index) => {
        const id = String(val),
            rawLayer = getLayerWhere({id: id}),
            treeType = Radio.request("Parser", "getTreeType"),
            optionsOfLayer = {
                id: id,
                visibility: visibilityList[index]
            },
            layerFromParser = Radio.request("Parser", "getItemByAttributes", {id: id});
        let layerToPush,
            layer = Radio.request("ModelList", "getModelByAttributes", {id: id});

        if (transparencyList[index] !== null) {
            optionsOfLayer.transparency = transparencyList[index];
        }

        if (treeType === "light") {
            if (layerFromParser === undefined && rawLayer !== null) {
                layerToPush = Object.assign({
                    isBaseLayer: false,
                    isVisibleInTree: "true",
                    parentId: "tree",
                    type: "layer",
                    isVisible: true,
                    isSelected: true
                }, rawLayer);

                Radio.trigger("Parser", "addItemAtTop", layerToPush);
                Radio.trigger("ModelList", "addModelsByAttributes", {id: id});
                Radio.trigger("ModelList", "setModelAttributesById", id, optionsOfLayer);
                layer = Radio.request("ModelList", "getModelByAttributes", {id: id});
                layer.setIsSelected(optionsOfLayer.visibility);
                Radio.trigger("ModelList", "refreshLightTree");
            }
            else if (layer) {
                Radio.trigger("ModelList", "setModelAttributesById", id, optionsOfLayer);
                layer.setIsSelected(optionsOfLayer.visibility);
                Radio.trigger("ModelList", "refreshLightTree");

            }
            else if (layerFromParser === undefined) {
                wrongIdsPositions.push(index + 1);
            }
        }
    });

    alertWrongLayerIds(wrongIdsPositions);
}

/**
     * Build alert for wrong layerids
     * @param {string[]} wrongIdsPositions - The positions from wrong layerids.
     * @returns {void}
     */
function alertWrongLayerIds (wrongIdsPositions) {
    if (wrongIdsPositions.length > 0) {
        let wrongIdsPositionsConcat = wrongIdsPositions.shift();

        wrongIdsPositions.forEach(position => {
            wrongIdsPositionsConcat = wrongIdsPositionsConcat + ", " + String(position);
        });
        store.dispatch("Alerting/addSingleAlert", i18next.t("modules.core.parametricURL.alertWrongLayerIds", {wrongIdsPositionsConcat: wrongIdsPositionsConcat}), {root: true});
    }
}
