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
        dispatch("sortItems");
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
    addMouseEvents ({state, commit, dispatch}) {
        const featureLister = document.getElementById("featureLister");

        featureLister.addEventListener("click", (evt) => {
            const correctedFeatureIndex = evt.target.parentElement.rowIndex - 1;

            if (correctedFeatureIndex >= 0) {
                const feature = state.gfiFeaturesOfLayer[correctedFeatureIndex];

                commit("setSelectedFeature", feature);
            }
        });
        featureLister.addEventListener("mouseover", (evt) => {
            const correctedFeatureIndex = evt.target.parentElement.id;

            if (correctedFeatureIndex !== "" && correctedFeatureIndex >= 0 && correctedFeatureIndex <= state.shownFeatures) {

                const feature = state.nestedFeatures ? state.rawFeaturesOfLayer[correctedFeatureIndex] : state.layer.features[correctedFeatureIndex];

                dispatch("highlightFeature", feature.getId());
            }
        });
    },
    // Hover event
    highlightFeature ({state, dispatch}, featureId) {
        dispatch("Map/removeHighlightFeature", "decrease", {root: true});
        let featureGeometryType = "";
        const layer = state.visibleLayers.find((l) => l.values_.id === state.layer.id),
            featureWrapper = state.nestedFeatures ? state.rawFeaturesOfLayer.find(feat => {
                featureGeometryType = feat.getGeometry().getType();
                return feat.getId().toString() === featureId;
            }) : layer.getSource().getFeatures().find(feat => {
                featureGeometryType = feat.getGeometry().getType();
                return feat.getId().toString() === featureId;
            }),
            styleObj = state.layer.geometryType.toLowerCase().indexOf("polygon") > -1 ? state.highlightVectorRulesPolygon : state.highlightVectorRulesPointLine,
            highlightObject = {
                type: featureGeometryType === "Point" || featureGeometryType === "MultiPoint" ? "increase" : "highlightPolygon",
                id: featureId,
                layer: layer,
                feature: featureWrapper,
                scale: styleObj.image?.scale
            };

        layer.id = state.layer.id;

        if (highlightObject.type === "highlightPolygon") {
            highlightObject.highlightStyle = {
                fill: styleObj.fill,
                stroke: styleObj.stroke,
                image: styleObj.image
            };
        }
        dispatch("Map/highlightFeature", highlightObject, {root: true});
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
    },
    async sortItems () {
        const tableHeaders = await document.getElementsByClassName("featurelist-list-table-th");

        try {
            tableHeaders.forEach(th_elem => {
                let asc = true;
                const index = Array.from(th_elem.parentNode.children).indexOf(th_elem);

                th_elem.addEventListener("click", () => {
                    const arr = [...th_elem.closest("table").querySelectorAll("tbody tr")].slice(1);

                    arr.sort((a, b) => {
                        let a_val = "",
                            b_val = "";

                        if (a.children[index] !== undefined && b.children[index] !== undefined) {
                            a_val = a.children[index].innerText;
                            b_val = b.children[index].innerText;
                        }
                        return asc ? a_val.localeCompare(b_val) : b_val.localeCompare(a_val);
                    });
                    arr.forEach(elem => {
                        th_elem.closest("table").querySelector("tbody").appendChild(elem);
                    });
                    asc = !asc;
                });
            });
        }
        catch (error) {
            console.error(error);
        }
    }

};

