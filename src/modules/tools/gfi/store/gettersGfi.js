import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import stateGfi from "./stateGfi";
import {createGfiFeature} from "../../../../api/gfi/getWmsFeaturesByMimeType";
import {getGfiFeaturesByTileFeature} from "../../../../api/gfi/getGfiFeaturesByTileFeature";

const getters = {
    ...generateSimpleGetters(stateGfi),

    /**
     * Gets the features at the given pixel for the gfi.
     * @param {Number[]} clickPixel The pixel coordinate of the click event in 2D
     * @param {Number[]} clickCartesianCoordinate The coordinate of the click event in 3D
     * @param {String} mode The current map mode
     * @returns {Object[]} gfi features
     */
    gfiFeaturesAtPixel: () => (clickPixel, clickCartesianCoordinate, mode) => {
        const featuresAtPixel = [];

        if (clickPixel && mode === "2D") {
            mapCollection.getMap("2D").forEachFeatureAtPixel(clickPixel, (feature, layer) => {
                if (layer?.getVisible() && layer?.get("gfiAttributes") && layer?.get("gfiAttributes") !== "ignore") {
                    if (feature.getProperties().features) {
                        feature.get("features").forEach(clusteredFeature => {
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
        }
        if (mode === "3D" && Array.isArray(clickCartesianCoordinate) && clickCartesianCoordinate.length === 2) {
            // add features from map3d
            const scene = mapCollection.getMap("3D").getCesiumScene(),
                clickFeatures = scene.drillPick({x: clickCartesianCoordinate[0], y: clickCartesianCoordinate[1]});

            clickFeatures.forEach(clickFeature => {
                if (clickFeature instanceof Cesium.Cesium3DTileFeature) {
                    const gfiFeatures = getGfiFeaturesByTileFeature(clickFeature);

                    if (Array.isArray(gfiFeatures)) {
                        gfiFeatures.forEach(gfiFeature => {
                            featuresAtPixel.push(gfiFeature);
                        });
                    }
                }
                else if (clickFeature?.primitive instanceof Cesium.Billboard
                    && clickFeature.primitive.olLayer?.get("gfiAttributes")
                    && clickFeature.primitive.olLayer?.get("gfiAttributes") !== "ignore"
                ) {
                    featuresAtPixel.push(createGfiFeature(
                        clickFeature.primitive?.olLayer,
                        "",
                        clickFeature.primitive?.olFeature
                    ));
                }
            });
        }

        return featuresAtPixel;
    },

    /**
     * Reverse the gfi features
     * @param {object} state - the state
     * @returns {Array} reversed gfiFeatures Array from state
     */
    gfiFeaturesReverse: (state) => {
        if (state.gfiFeatures !== null && Array.isArray(state.gfiFeatures)) {
            return state.gfiFeatures.slice().reverse();
        }

        return state.gfiFeatures;
    }
};

export default getters;
