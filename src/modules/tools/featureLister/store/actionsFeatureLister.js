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
    },
    /**
     * Switches to the themes list of all visibile layers.
     * @param {Object} layer selected layer.
     * @returns {void}
     */
    switchToThemes ({commit}) {
        Object.entries(document.getElementsByClassName("featurelist-navtabs")[0].children).forEach(([, child]) => {
            if (child.id === "featurelistThemeChooser") {
                child.classList.remove("disabled");
                child.classList.add("active");
                commit("setLayerListView", true);
                commit("setFeatureListView", false);
            }
            else {
                child.classList.remove("active");
                child.classList.add("disabled");
            }
        });
    }
};

