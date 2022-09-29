import {fetchFirstModuleConfig} from "../../../utils/fetchFirstModuleConfig";
import Point from "ol/geom/Point.js";
import Feature from "ol/Feature.js";

/**
 * @const {String} configPaths an array of possible config locations. First one found will be used
 * @const {Object} actions vue actions
 */
const configPaths = [
    "configJs.mapMarker"
];

export default {
    /**
     * Sets the config-params of this mapMarker into state.
     * @param {Object} context The context Vue instance.
     * @returns {Boolean} false, if config does not contain the mapMarker.
     */
    initialize: (context) => {
        if (context) {
            return fetchFirstModuleConfig(context, configPaths, "MapMarker", false);
        }
        return null;

    },

    /**
     * With this function the coordinate, which has to be marked by the mapMarker, is written to the MapMarker state.
     * @param {String[]} value The array with the markable coordinate pair.
     * @param {Boolean} [value.keepPreviousMarker] whether function should
     *                  keep or erase previously drawn markers
     * @returns {void}
     */
    placingPointMarker ({state, rootState, commit, dispatch}, value) {
        const styleListModel = Radio.request("StyleList", "returnModelById", state.pointStyleId);
        let coordValues = [];

        if (!value.keepPreviousMarker) {
            dispatch("removePointMarker");
        }

        if (styleListModel) {
            if (rootState.Maps.mode === "3D") {
                // else an error is thrown in proj4/lib/checkSanity: coordinates must be finite numbers
                value.forEach(val => {
                    coordValues.push(Math.round(val));
                });
                // tilt the camera to recognize the mapMarker
                mapCollection.getMap("3D").getCamera().tilt_ = -200;
            }
            else {
                coordValues = value;
            }
            const iconfeature = new Feature({
                    geometry: new Point(coordValues)
                }),
                featureStyle = styleListModel.createStyle(iconfeature, false);

            iconfeature.setStyle(featureStyle);
            iconfeature.set("styleId", state.pointStyleId);
            iconfeature.set("featureId", iconfeature.ol_uid);

            commit("addFeatureToMarker", {feature: iconfeature, marker: "markerPoint"});
            commit("setVisibilityMarker", {visibility: true, marker: "markerPoint"});
            dispatch("Maps/addLayerOnTop", state.markerPoint, {root: true});
        }
        else {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.mapMarker.noStyleModel", {styleId: state.pointStyleId}), {root: true});
        }
    },

    /**
     * This function has the task to remove the coordinate from the mapMarker state.
     * This is necessary / triggered if the MapMarker should be removed.
     * @returns {void}
     */
    removePointMarker ({state, commit}) {
        mapCollection.getMap("2D").removeLayer(state.markerPoint);
        commit("clearMarker", "markerPoint");
        commit("setVisibilityMarker", {visbility: false, marker: "markerPoint"});
    },
    /**
     * Rotates the point marker.
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} param.rootGetters the rootGetters
     * @param {Number} angle angle to rotate
     * @returns {void}
     */
    rotatePointMarker ({commit, dispatch, getters, rootGetters}, angle) {
        const features = getters.markerPoint?.getSource().getFeatures();

        if (features && features.length > 0) {
            const feature = features[0],
                icon = feature.getStyle().getImage().clone();

            icon.setRotation(angle * Math.PI / 180);
            feature.getStyle().setImage(icon);
            commit("clearMarker", "markerPoint");
            commit("addFeatureToMarker", {feature: feature, marker: "markerPoint"});

            if (rootGetters["Maps/mode"] === "3D") {
                setTimeout(() => {
                    dispatch("rotatePointMarkerIn3D", angle);
                }, 0.1);
            }
        }
    },

    /**
     * Rotates the point marker in 3D.
     * @param {Object} param.rootGetters the rootGetters
     * @param {Number} angle angle to rotate
     * @returns {void}
     */
    rotatePointMarkerIn3D ({rootGetters}, angle) {
        const clickCartesianCoordinate = rootGetters["Maps/clickCartesianCoordinate"],
            mapWidth = mapCollection.getMap("3D").getOlMap().getSize()[0],
            mapHeight = mapCollection.getMap("3D").getOlMap().getSize()[1];
        let pixelOffset;

        mapCollection.getMap("3D").getCesiumScene().drillPick({x: clickCartesianCoordinate[0], y: clickCartesianCoordinate[1]}, 10, mapWidth, mapHeight).forEach((primitiveObject) => {
            if (primitiveObject?.primitive?.olLayer?.get("id") === "marker_point_layer") {
                switch (angle) {
                    case 0: {
                        pixelOffset = {
                            x: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.width - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0]) * primitiveObject.primitive.scale))) / 2,
                            y: -((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.height - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1]) * primitiveObject.primitive.scale))) / 2
                        };
                        break;
                    }
                    case 90: {
                        pixelOffset = {
                            x: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.height - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1]) * primitiveObject.primitive.scale))) / 2,
                            y: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.width - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0]) * primitiveObject.primitive.scale))) / 2
                        };
                        break;
                    }
                    case 180: {
                        pixelOffset = {
                            x: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.width - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0]) * primitiveObject.primitive.scale))) / 2,
                            y: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.height - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1]) * primitiveObject.primitive.scale))) / 2
                        };
                        break;
                    }
                    case 270: {
                        pixelOffset = {
                            x: -((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.height - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[1]) * primitiveObject.primitive.scale))) / 2,
                            y: ((primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0] * primitiveObject.primitive.scale) - (((primitiveObject.primitive.width - primitiveObject.primitive.olFeature.getStyle().getImage().getAnchor()[0]) * primitiveObject.primitive.scale))) / 2
                        };
                        break;
                    }
                    default: {
                        break;
                    }
                }
                primitiveObject.primitive.pixelOffset = pixelOffset;
                primitiveObject.primitive.rotation = -angle * Math.PI / 180;
            }
        });
    },

    /**
     * Converts polygon to the wkt format and add this to the map.
     * @param {ol/Feature} feature The ol feature that is added to the map.
     * @returns {void}
     */
    placingPolygonMarker ({state, commit, dispatch}, feature) {
        const styleListModel = Radio.request("StyleList", "returnModelById", state.polygonStyleId);

        dispatch("removePolygonMarker");

        if (styleListModel) {
            const featureStyle = styleListModel.createStyle(feature, false);

            feature.setStyle(featureStyle);
            commit("addFeatureToMarker", {feature: feature, marker: "markerPolygon"});
            commit("setVisibilityMarker", {visibility: true, marker: "markerPolygon"});
            dispatch("Maps/addLayerOnTop", state.markerPolygon, {root: true});
        }
        else {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.mapMarker.noStyleModel", {styleId: state.polygonStyleId}), {root: true});
        }
    },

    /**
     * Creates a feature from the given geometry and adds it to the map.
     * @param {Object} store.getters - The Map Marker getters.
     * @param {Function} store.commit - Function to commit a mutation.
     * @param {Function} store.dispatch Function to dispatch an action.
     * @param {module:ol/geom/SimpleGeometry} geometry - The given geometry.
     * @returns {void}
     */
    placingPolygonMarkerByGeom ({state, commit, dispatch}, geometry) {
        const styleListModel = Radio.request("StyleList", "returnModelById", state.polygonStyleId);

        dispatch("removePolygonMarker");

        if (styleListModel && geometry) {
            const feature = new Feature({
                    geometry: geometry
                }),
                featureStyle = styleListModel.createStyle(feature, false);

            feature.setStyle(featureStyle);
            commit("addFeatureToMarker", {feature: feature, marker: "markerPolygon"});
            commit("setVisibilityMarker", {visibility: true, marker: "markerPolygon"});
            dispatch("Maps/addLayerOnTop", state.markerPolygon, {root: true});
        }
        else {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.mapMarker.noStyleModel", {styleId: state.polygonStyleId}), {root: true});
        }
    },

    /**
     * Removes the polygon map marker from the map.
     * @returns {void}
     */
    removePolygonMarker: function ({state, commit}) {
        mapCollection.getMap("2D").removeLayer(state.markerPolygon);
        commit("clearMarker", "markerPolygon");
        commit("setVisibilityMarker", {visbility: false, marker: "markerPolygon"});
    }
};
