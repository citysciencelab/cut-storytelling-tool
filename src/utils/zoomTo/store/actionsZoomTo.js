import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import getFeatures from "../utils/getFeatures";
import calculateExtent from "../../calculateExtent";
import createStyledFeatures from "../utils/createStyledFeatures";

const actions = {
    zoomToFeatures ({state, getters: {config, deprecatedParameters}, commit, dispatch}) {
        let allowedValues, layerId, property, styleId, urlValues;

        // NOTE(roehlipa): Everything included in the if-closure can be removed when the deprecated config parameters have been removed.
        //                 It might be useful to refactor this action slightly for version 3.0.0.
        if (deprecatedParameters) {
            // zoomToFeature
            if (Object.prototype.hasOwnProperty.call(config, "zoomToFeature") && state.zoomToFeatureId !== undefined) {
                layerId = config.zoomToFeature.wfsId;
                property = config.zoomToFeature.attribute;
                urlValues = state.zoomToFeatureId.map(value => String(value)); // TODO: Add these to the state
                styleId = config.zoomToFeature.styleId ? config.zoomToFeature.styleId : config.zoomToFeature.imgLink;
            }
            // zoomToGeometry
            else if (Object.prototype.hasOwnProperty.call(config, "zoomToGeometry") && state.zoomToGeometry !== undefined) {
                layerId = config.zoomToGeometry.layerId;
                property = config.zoomToGeometry.attribute;
                urlValues = state.zoomToGeometry.split(",").map(value => value.toUpperCase().trim()); // TODO: Add these to the state
                allowedValues = config.zoomToGeometry.geometries;
            }
            else {
                console.error("zoomTo: The given configuration is missing the id of the layer or a mismatch between url parameters and configuration occurred.");
                return;
            }
            getFeatures(layerId)
                .then(featureCollection => {
                    const filteredFeatures = featureCollection.filter(feature => {
                            if (!feature.getKeys().includes(property)) {
                                return false;
                            }
                            return urlValues.includes(feature.get(property).toUpperCase().trim());
                        }),
                        geometryOrExtent = calculateExtent(
                            allowedValues === undefined
                                ? filteredFeatures
                                : filteredFeatures.filter(feature => allowedValues.includes(feature.get(property).toUpperCase().trim()))
                        );


                    commit("Map/addLayerToMap", new VectorLayer({
                        source: new VectorSource({
                            features: styleId === undefined
                                ? filteredFeatures
                                : createStyledFeatures(filteredFeatures, styleId)
                        })
                    }), {root: true});
                    return dispatch("Map/zoomTo", {geometryOrExtent}, {root: true});
                })
                .catch(error => console.error("zoomTo: An error occurred while trying to fetch features from the given service.", error));
        }
        else {
            // TODO: 1. Implement and add new zoomTo 2. Adjust docs
        }
    }
};

export default actions;
