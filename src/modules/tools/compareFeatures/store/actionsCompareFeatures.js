export default {
    /**
     * Sets the zoom level to the map.
     * @param {Object} _ actions context object.
     * @param {Object} featureInfo - featureInfo
     * @returns {void}
     */
    isFeatureOnCompareList: function ({state}, featureInfo) {
        const featureIndex = state.featuresInList.indexOf(featureInfo),
            compareList = state.featuresInList;

        if (featureIndex === -1) {
            console.log(featureIndex);
            compareList.push(featureInfo);
            state.compareListHasFeatures = true;
            console.log(compareList);
        }
        else {
            console.log(featureIndex);
            console.log(compareList);
            console.log("Remove Feature", featureInfo);
            compareList.splice(featureIndex, 1);
        }
        if (compareList.length === 0) {
            state.compareListHasFeatures = false;
        }
    }
};

