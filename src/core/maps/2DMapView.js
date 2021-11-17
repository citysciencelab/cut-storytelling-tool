import View from "ol/View";
import Cluster from "ol/source/Cluster.js";
import {transformToMapProjection, transformFromMapProjection} from "masterportalAPI/src/crs";

import mapCollection from "../dataStorage/mapCollection";
import calculateExtent from "../../utils/calculateExtent";


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
 * Zoom to a given extent
 * @param {String[]} extent The extent to zoom.
 * @param {Object} options Options for zoom.
 * @param {string} urlProjection The projection from RUL parameter.
 * @returns {void}
 */
View.prototype.zoomToExtent = function (extent, options) {
    this.fit(extent, {
        size: mapCollection.getMap("ol", "2D").getSize(),
        duration: options && options?.duration ? options.duration : 800,
        ...options
    });
};

/**
 * Zoom to features that are filtered by the ids.
 * @param {String[]} ids The feature ids.
 * @param {String} layerId The layer id.
 * @param {Object} zoomOptions The options for zoom to extent.
 * @fires Core.ModelList#RadioRequestModelListGetModelByAttributes
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
 * Used in remoteInterface.
 * @param {Object} data Contains extent, options as Object and projection.
 * @param {String[]} data.extent The extent to zoom.
 * @param {Object} data.options Options for zoom.
 * @param {string} data.projection The projection from RUL parameter.
 * @returns {void}
 */
View.prototype.zoomToProjExtent = function (data) {
    if (data.extent !== undefined && data.options !== undefined && data.projection !== undefined) {
        const leftBottom = data.extent.slice(0, 2),
            topRight = data.extent.slice(2, 4),
            transformedLeftBottom = transformToMapProjection(mapCollection.getMap("ol", "2D"), data.projection, leftBottom),
            transformedTopRight = transformToMapProjection(mapCollection.getMap("ol", "2D"), data.projection, topRight),
            extentToZoom = transformedLeftBottom.concat(transformedTopRight);

        this.zoomToExtent(extentToZoom, data.options);
    }
};
