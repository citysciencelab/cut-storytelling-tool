import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import getAndFilterFeatures from "../utils/getAndFilterFeatures";
import calculateExtent from "../../calculateExtent";
import createStyledFeatures from "../utils/createStyledFeatures";

const actions = {
    zoomToFeatures ({state, getters: {config, deprecatedParameters}, commit, dispatch}) {
        let allowedValues, layerId, property, styleId, urlValues;

        // NOTE(roehlipa): Everything included in the if-closure can be removed when the deprecated config parameters have been removed.
        //                 It might be useful to refactor this action slightly for version 3.0.0.
        if (deprecatedParameters) {
            console.warn("zoomTo: A deprecated configuration was found. Using it, until it gets removed...");
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
                return new Promise((_, reject) => reject("zoomTo: A mismatch between url parameters and configuration occurred."));
            }
            return getAndFilterFeatures(layerId, property, urlValues)
                .then(featureCollection => {
                    const geometryOrExtent = calculateExtent(
                        allowedValues === undefined
                            ? featureCollection
                            : featureCollection.filter(feature => allowedValues.includes(feature.get(property).toUpperCase().trim()))
                    );

                    commit("Map/addLayerToMap", new VectorLayer({
                        source: new VectorSource({
                            features: styleId === undefined
                                ? featureCollection
                                : createStyledFeatures(featureCollection, styleId)
                        })
                    }), {root: true});
                    return dispatch("Map/zoomTo", {geometryOrExtent}, {root: true});
                })
                .catch(error => console.error("zoomTo: An error occurred while trying to fetch features from the given service.", error));
        }
        const featurePromises = config.map(conf => {
            const {id} = conf;

            if (state[id] === undefined) {
                return new Promise(resolve => resolve([]));
            }
            if (id === "zoomToFeatureId") {
                urlValues = state[id].map(value => String(value));
                styleId = conf.styleId;
            }
            else if (id === "zoomToGeometry") {
                urlValues = state[id].split(",").map(value => value.toUpperCase().trim());
                allowedValues = conf.allowedValues;
            }
            else {
                return new Promise((_, reject) => reject("zoomTo: The specified id for the url parameter does not exist. Please use either 'zoomToGeometry' or 'zoomToFeatureId'."));
            }
            layerId = conf.layerId;
            property = conf.property;

            return getAndFilterFeatures(layerId, property, urlValues)
                .then(featureCollection => {
                    let filteredFeatures = featureCollection;

                    if (allowedValues !== undefined) {
                        filteredFeatures = filteredFeatures.filter(feature => allowedValues.includes(feature.get(property).toUpperCase().trim()));
                    }
                    if (styleId) {
                        filteredFeatures = createStyledFeatures(filteredFeatures, styleId);
                    }
                    return new Promise(resolve => resolve(filteredFeatures));
                });
        });

        return Promise.allSettled(featurePromises)
            .then(results => {
                const features = results
                    .map(result => {
                        if (result.status === "fulfilled") {
                            return result.value;
                        }
                        dispatch("Alerting/addSingleAlert", "common:path.to.translation", {root: true});
                        return [];
                    })
                    .flat(1);

                if (features.length > 0) {
                    commit("Map/addLayerToMap", new VectorLayer({
                        source: new VectorSource({features})
                    }), {root: true});
                    return dispatch("Map/zoomTo", {geometryOrExtent: calculateExtent(features)}, {root: true});
                }
                return console.error("zoomTo: No features were found for the given layer.");
            })
            .catch(error => {
                console.error("zoomTo: An error occurred while trying to fetch features from one of the given services.", error);
            });
        // TODO: 1. Adjust docs 2. adjust tests
    }
};

export default actions;
