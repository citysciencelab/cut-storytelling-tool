
/**
 * Writes active layers, visibility, transparency, Map/center and Map/zoomLevel as Url params.
 * @param {Object} rootState vuex root state
 * @param {Object} rootGetters vuex root getters
 * @returns {String} url with params
 */
export function getStateAsUrlParams (rootState, rootGetters) {
    const layerIds = rootState.Tools.SaveSelection.layerIds,
        layerVisibilities = rootState.Tools.SaveSelection.layerVisibilities,
        layerTransparencies = rootState.Tools.SaveSelection.layerTransparencies;

    return location.origin + location.pathname +
        "?Map/layerIds=" + layerIds +
        "&visibility=" + layerVisibilities +
        "&transparency=" + layerTransparencies +
        "&Map/center=[" + rootGetters["Map/center"] +
        "]&Map/zoomLevel=" + rootGetters["Map/zoomLevel"];
}
