import {createGfiFeature} from "../../../api/gfi/getWmsFeaturesByMimeType";

export default {
    /**
     * Sets the config-params of this MouseHover into state.
     * @param {module:ol/Map} map map object
     * @returns {void}
     */
    initialize ({rootState, commit}, map) {
        const {numFeaturesToShow, infoText} = Config.mouseHover;
        let featuresAtPixel = [];

        commit("setLayersFromConfig", rootState.configJson.Themenconfig.Fachdaten.Layer);
        commit("setMouseHoverLayers");
        commit("setMouseHoverInfos");

        if (numFeaturesToShow) {
            commit("setNumFeaturesToShow", numFeaturesToShow);
        }
        if (infoText) {
            commit("setInfoText", infoText);
        }
        map.on("pointermove", (evt) => {
            featuresAtPixel = [];
            map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
                if (layer?.getVisible() && layer?.get("gfiAttributes") && layer?.get("gfiAttributes") !== "ignore") {
                    if (feature.getProperties().features) {
                        feature.get("features").forEach(function (clusteredFeature) {
                            featuresAtPixel.push(createGfiFeature(
                                layer,
                                "",
                                clusteredFeature
                            ));
                        });
                    }
                    else {
                        featuresAtPixel.push(createGfiFeature(
                            layer,
                            "",
                            feature
                        ));
                    }
                }
            });
            // if (featuresAtPixel[0]) {
            //     console.log(featuresAtPixel[0].getProperties());
            // }
        });
    }
};
