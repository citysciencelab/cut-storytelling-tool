import View from "ol/View";
import Cluster from "ol/source/Cluster.js";
import {transformToMapProjection, transformFromMapProjection} from "masterportalAPI/src/crs";

import mapCollection from "../dataStorage/mapCollection";
import calculateExtent from "../../utils/calculateExtent";

/**
 * Returns the bounding box in a given coordinate system (EPSG code).
 * @param {String} [epsgCode="EPSG:4326"] EPSG code into which the bounding box is transformed.
 * @param {Object} [map] The parameter to get the map from the map collection
 * @param {String} [map.mapId="ol"] The map id.
 * @param {String} [map.mapMode="2D"] The map mode.
 * @returns {Number[]} Bounding box in the specified coordinate system.
 */
View.prototype.getProjectedBBox = function (epsgCode = "EPSG:4326", map = {mapId: "ol", mapMode: "2D"}) {
    const olMap = mapCollection.getMap(map.mapId, map.mapMode),
        bbox = this.calculateExtent(olMap.getSize()),
        firstCoordTransform = transformFromMapProjection(olMap, epsgCode, [bbox[0], bbox[1]]),
        secondCoordTransform = transformFromMapProjection(olMap, epsgCode, [bbox[2], bbox[3]]);

    return [firstCoordTransform[0], firstCoordTransform[1], secondCoordTransform[0], secondCoordTransform[1]];
};

/**
 * Sets the bounding box for the map view.
 * @param {Number[]} bbox The Boundingbox to fit the map.
 * @param {Object} [map] The parameter to get the map from the map collection
 * @param {String} [map.mapId="ol"] The map id.
 * @param {String} [map.mapMode="2D"] The map mode.
 * @returns {void}
 */
View.prototype.setBBox = function (bbox, map = {mapId: "ol", mapMode: "2D"}) {
    if (bbox) {
        this.fit(bbox, {size: mapCollection.getMap(map.mapId, map.mapMode).getSize()});
    }
};

/**
 * Zoom to a given extent.
 * @param {String[]} extent The extent to zoom.
 * @param {Object} options Options for zoom.
 * @param {Number} [options.duration=800] The duration of the animation in milliseconds.
 * @param {Object} [map] The parameter to get the map from the map collection
 * @param {String} [map.mapId="ol"] The map id.
 * @param {String} [map.mapMode="2D"] The map mode.
 * @see {@link https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit} for more options.
 * @returns {void}
 */
View.prototype.zoomToExtent = function (extent, options, map = {mapId: "ol", mapMode: "2D"}) {
    this.fit(extent, {
        size: mapCollection.getMap(map.mapId, map.mapMode).getSize(),
        ...Object.assign({duration: 800}, options)
    });
};

/**
 * Zoom to features that are filtered by the ids.
 * @param {String[]} featureIds The feature ids.
 * @param {String} layerId The layer id.
 * @param {Object} zoomOptions The options for zoom to extent.
 * @param {Object} [map] The parameter to get the map from the map collection
 * @param {String} [map.mapId="ol"] The map id.
 * @param {String} [map.mapMode="2D"] The map mode.
 * @returns {void}
 */
View.prototype.zoomToFilteredFeatures = function (featureIds, layerId, zoomOptions, map = {mapId: "ol", mapMode: "2D"}) {
    const layer = mapCollection.getMap(map.mapId, map.mapMode).getLayerById(layerId);

    if (layer?.getSource()) {
        const layerSource = layer.getSource(),
            source = layerSource instanceof Cluster ? layerSource.getSource() : layerSource,
            filteredFeatures = source.getFeatures().filter(feature => featureIds.indexOf(feature.getId()) > -1);

        if (filteredFeatures.length > 0) {
            this.zoomToExtent(calculateExtent(filteredFeatures), zoomOptions, {mapId: map.mapId, mapMode: map.mapMode});
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
