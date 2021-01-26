export default {
    /**
     * Sets the zoom level to the map.
     * @param {Object} context actions context object.
     * @param {Number} featureInfo - featureInfo
     * @returns {void}
     */
    addFeatureToList: function ({dispatch}, featureInfo) {
        dispatch("Tools/CompareFeatures/isFeatureOnCompareList", featureInfo, {root: true});
    },
    /**
     * Sets the zoom level to the map.
     * @param {Object} context actions context object.
     * @param {Number} featureInfo - featureInfo
     * @returns {void}
     */
    removeFeatureFromList: function ({dispatch}, featureInfo) {
        dispatch("Tools/CompareFeatures/removeFeature", featureInfo, {root: true});
    }
};
