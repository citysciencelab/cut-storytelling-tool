export default {
    /**
     * Dispatches an action from the Compare Features Tool to add a feature to a comparison list.
     * @param {Object} context actions context object.
     * @param {Number} featureInfo - featureInfo
     * @returns {void}
     */
    addFeatureToList: function ({dispatch}, featureInfo) {
        dispatch("Tools/CompareFeatures/isFeatureOnCompareList", featureInfo, {root: true});
    },
    /**
     * Dispatches an action from the Compare Features Tool to remove a feature to a comparison list.
     * @param {Object} context actions context object.
     * @param {Number} gfiFeature - feature
     * @returns {void}
     */
    removeFeatureFromList: function ({dispatch}, gfiFeature) {
        dispatch("Tools/CompareFeatures/removeFeature", gfiFeature, {root: true});
    }
};
