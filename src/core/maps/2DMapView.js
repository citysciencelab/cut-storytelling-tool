import View from "ol/View";
import Cluster from "ol/source/Cluster.js";
import {transformToMapProjection, transformFromMapProjection} from "masterportalAPI/src/crs";

import mapCollection from "../dataStorage/mapCollection";
import calculateExtent from "../../utils/calculateExtent";
import findWhereJs from "../../utils/findWhereJs";
import store from "../../app-store";
import defaults from "masterportalAPI/src/defaults";


View.prototype.initStore = function () {
    const params = findWhereJs(mapCollection.getMapView("ol", "2D").options_.options, mapCollection.getMapView("ol", "2D").getConstrainedResolution(mapCollection.getMapView("ol", "2D").getResolution()));

    // triggers the function checkForScale modules\core\modelList\layer\model.js
    Radio.trigger("MapView", "changedOptions", params);
    store.commit("Map/setScale", params?.scale);
};
/**
 * calculate the extent for the current view state and the passed size
 * @fires Core#RadioRequestMapGetSize
 * @return {ol.extent} extent
 */
View.prototype.getCurrentExtent = function () {
    const mapSize = Radio.request("Map", "getSize");

    return this.calculateExtent(mapSize);
};

/**
 * Returns the bounding box in a given coordinate system (EPSG code).
 * @param {String} [epsgCode="EPSG:4326"] EPSG code into which the bounding box is transformed.
 * @returns {Number[]} Bounding box in the specified coordinate system.
 */
View.prototype.getProjectedBBox = function (epsgCode = "EPSG:4326") {
    const map = mapCollection.getMap("ol", "2D"),
        bbox = this.calculateExtent(map.getSize()),
        firstCoordTransform = transformFromMapProjection(map, epsgCode, [bbox[0], bbox[1]]),
        secondCoordTransform = transformFromMapProjection(map, epsgCode, [bbox[2], bbox[3]]);

    return [firstCoordTransform[0], firstCoordTransform[1], secondCoordTransform[0], secondCoordTransform[1]];
};

/**
 * Returns the corresponding resolution for the scale.
 * @param  {String|number} scale - todo
 * @param  {String} scaleType - min or max
 * @return {number} resolution
 */
View.prototype.getResoByScale = function (scale, scaleType) {
    const scales = this.options_.options.map(function (option) {
        return option.scale;
    });

    let index = "",
        unionScales = scales.concat([parseInt(scale, 10)].filter(item => scales.indexOf(item) < 0));

    unionScales = unionScales.sort(function (a, b) {
        return b - a;
    });

    index = unionScales.indexOf(parseInt(scale, 10));
    if (unionScales.length === scales.length || scaleType === "max") {
        return this.getResolutions()[index];
    }
    else if (scaleType === "min") {
        return this.getResolutions()[index - 1];
    }
    return null;
};

/**
 * Sets center and resolution to initial values
 * @fires Core#RadioRequestParametricURLGetCenter
 * @returns {void}
 */
View.prototype.resetView = function () {
    const paramUrlCenter = store.state.urlParams["Map/center"] ? store.state.urlParams["Map/center"] : null,
        settingsCenter = this.options_ !== undefined && this.options_.center ? this.options_.center : undefined,
        defaultCenter = defaults.startCenter,
        center = paramUrlCenter || settingsCenter || defaultCenter,
        settingsResolution = this.options_ !== undefined && this.options_?.resolution ? this.options_.resolution : undefined,
        defaultResolution = defaults.startResolution,
        resolution = settingsResolution || defaultResolution;

    this.setCenterCoord(center);
    this.setResolution(resolution);
    store.dispatch("MapMarker/removePointMarker");
};

/**
 * Sets the bounding box for the map view.
 * @param {Number[]} bbox The Boundingbox to fit the map.
 * @returns {void}
 */
View.prototype.setBBox = function (bbox) {
    if (bbox) {
        this.fit(bbox, mapCollection.getMap("ol", "2D").getSize());
    }
};

/**
 * @description sets the  center of the map and zoom level if defined
 * @param  {array} coords Coordinates
 * @param  {number} zoomLevel Zoom Level
 * @return {void}
 */
View.prototype.setCenterCoord = function (coords, zoomLevel) {
    let first2Coords = [coords[0], coords[1]];

    // Coordinates need to be integers, otherwise open layers will go nuts when you attempt to pan the
    // map. Please fix this at the origin of those stringified numbers. However, this is to adress
    // possible future issues:
    if (typeof first2Coords[0] !== "number" || typeof first2Coords[1] !== "number") {
        console.warn("Given coordinates must be of type integer! Although it might not break, something went wrong and needs to be checked!");
        first2Coords = first2Coords.map(singleCoord => parseInt(singleCoord, 10));
    }

    this.setCenter(first2Coords);

    if (zoomLevel !== undefined) {
        this.setZoom(zoomLevel);
    }
};

/**
 * @description todo
 * @param {number} resolution -
 * @returns {void}
 */
View.prototype.setConstrainedResolution = function (resolution) {
    this.setResolution(resolution);
};

/**
 * finds the right resolution for the scale and sets it for this view
 * @param {number} scale - map view scale
 * @returns {void}
 */
View.prototype.setResolutionByScale = function (scale) {
    const params = findWhereJs(this.options_.options, {scale: scale});

    if (this !== undefined) {
        this.setResolution(params.resolution);
    }
};

/**
 * Reduces the zoomlevel by one.
 * @return {void}
 */
View.prototype.setZoomLevelDown = function () {
    this.setZoom(this.getZoom() - 1);
};

/**
 * Increases the zoomlevel by one.
 * @return {void}
 */
View.prototype.setZoomLevelUp = function () {
    this.setZoom(this.getZoom() + 1);
};

/**
 * @description todo
 * @returns {void}
 */
View.prototype.toggleBackground = function () {
    if (this.background === "white") {
        this.setBackground(this.options_.backgroundImage);
        $("#map").css("background", this.options_.backgroundImage + "repeat scroll 0 0 rgba(0, 0, 0, 0)");
    }
    else {
        this.setBackground("white");
        $("#map").css("background", "white");
    }
};

/**
 * Zoom to a given extent
 * @param {String[]} extent The extent to zoom.
 * @param {Object} options Options for zoom.
 * @param {Number} [options.duration=800] The duration of the animation in milliseconds.
 * @see {@link https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit} for more options.
 * @returns {void}
 */
View.prototype.zoomToExtent = function (extent, options) {
    this.fit(extent, {
        size: mapCollection.getMap("ol", "2D").getSize(),
        ...Object.assign({duration: 800}, options)
    });
};

/**
 * Zoom to features that are filtered by the ids.
 * @param {String[]} ids The feature ids.
 * @param {String} layerId The layer id.
 * @param {Object} zoomOptions The options for zoom to extent.
 * @returns {void}
 */
View.prototype.zoomToFilteredFeatures = function (ids, layerId, zoomOptions) {
    const layer = mapCollection.getMap("ol", "2D").getLayerById(layerId);

    if (layer?.getSource()) {
        const layerSource = layer.getSource(),
            source = layerSource instanceof Cluster ? layerSource.getSource() : layerSource,
            filteredFeatures = source.getFeatures().filter(feature => ids.indexOf(feature.getId()) > -1);

        if (filteredFeatures.length > 0) {
            this.zoomToExtent(calculateExtent(filteredFeatures), zoomOptions);
        }
    }
};

/**
 * Zoom to a given extent, this function allows to give projection of extent
 * Note: Used in remoteInterface.
 * @param {Object} data Contains extent, options as Object and projection.
 * @param {String[]} data.extent The extent to zoom.
 * @param {Object} data.options Options for zoom.
 * @param {string} data.projection The projection from RUL parameter.
 * @param {Object} [map] The parameter to get the map from the map collection
 * @param {String} [map.mapId="ol"] The map id.
 * @param {String} [map.mapMode="2D"] The map mode.
 * @returns {void}
 */
View.prototype.zoomToProjExtent = function (data, map = {mapId: "ol", mapMode: "2D"}) {
    if (Object.values(data).every(val => val !== undefined)) {
        const leftBottom = data.extent.slice(0, 2),
            topRight = data.extent.slice(2, 4),
            transformedLeftBottom = transformToMapProjection(mapCollection.getMap(map.mapId, map.mapMode), data.projection, leftBottom),
            transformedTopRight = transformToMapProjection(mapCollection.getMap(map.mapId, map.mapMode), data.projection, topRight),
            extentToZoom = transformedLeftBottom.concat(transformedTopRight);

        this.zoomToExtent(extentToZoom, data.options, {mapId: map.mapId, mapMode: map.mapMode});
    }
};

/**
 * Sets the Background for the Mapview.
 * @param  {string} value Image Url
 * @returns {void}
 */
View.prototype.setBackground = function (value) {
    this.background = value;
};
