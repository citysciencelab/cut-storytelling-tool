export default {
    /**
     * Switches to the feature list of the selected layer.
     * @param {Object} layer selected layer.
     * @returns {void}
     */
    switchToList ({state, commit}, layer) {
        commit("setLayerId", layer.id);
        commit("setLayer", layer);
        commit("setGfiFeaturesOfLayer", state.visibleLayers);
        Object.entries(document.getElementsByClassName("featurelist-navtabs")[0].children).forEach(([, child]) => {
            if (child.id === "featurelistFeaturelist") {
                child.classList.remove("disabled");
                child.classList.add("active");
                commit("setLayerListView", false);
                commit("setFeatureListView", true);
            }
            else {
                child.classList.remove("active");
            }
        });
        // this.$("#featurelist-themes").hide();
        // this.$("#featurelist-list").show();
        // this.$("#featurelist-details").hide();
    }
};

