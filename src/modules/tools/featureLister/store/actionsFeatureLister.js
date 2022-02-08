export default {
    /**
     * Switches to the feature list of the selected layer.
     * @param {Object} layer selected layer.
     * @returns {void}
     */
    switchToList ({state, commit, dispatch}, layer) {
        commit("setLayerId", layer.id);
        commit("setLayer", layer);
        commit("setGfiFeaturesOfLayer", state.visibleLayers);
        commit("setShownFeatures", state.maxFeatures);
        commit("setFeatureCount", state.gfiFeaturesOfLayer.length);
        dispatch("addMouseEvents");
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
    // Hover event
    addMouseEvents ({state, commit}) {
        const featureLister = document.getElementById("featureLister");

        featureLister.addEventListener("click", (evt) => {
            const correctedFeatureIndex = evt.target.parentElement.rowIndex - 1;

            if (correctedFeatureIndex >= 0) {
                const feature = state.gfiFeaturesOfLayer[correctedFeatureIndex];

                commit("setSelectedFeature", feature);
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
    },
    /**
     * Switches to the themes list of all visibile layers.
     * @param {Object} layer selected layer.
     * @returns {void}
     */
    showMore ({state, commit}) {
        if (state.shownFeatures < state.featureCount - 10) {
            commit("setShownFeatures", state.shownFeatures + 10);
        }
        else {
            state.shownFeatures = state.featureCount;
        }
    }
};

