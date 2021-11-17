import {PluggableMap} from "ol";
import {unByKey as unlistenByKey} from "ol/Observable.js";
import {Group as LayerGroup} from "ol/layer.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";

// import api from "masterportalAPI/abstraction/api";
// import {getLayerList} from "masterportalAPI/src/rawLayerList";

// import store from "../../app-store";
// import mapCollection from "../dataStorage/mapCollection";

PluggableMap.prototype.abc = function () {
    return "abc";
};

/**
 * Checks if the layer with the given name already exists and uses it, creates a new layer and returns it if not.
 * @param {String} layerName The name of the layer to check
 * @returns {ol/layer/Layer}  the found layer or a new layer with the given name
 */
PluggableMap.prototype.addNewLayerIfNotExists = function (layerName) {
    let resultLayer = this.getLayerByName(layerName);

    if (!resultLayer) {
        resultLayer = new VectorLayer({
            id: layerName,
            name: layerName,
            source: new VectorSource(),
            alwaysOnTop: true
        });

        this.addLayer(resultLayer);
    }

    return resultLayer;
};

/**
* Returns a layer or a child layer of a layer group by id.
* @param  {String} layerId Id of the Layer.
* @param  {Boolean} searchInGroupLayers Specifies whether to search for the id in the childLayers of groupLayers.
* @return {ol/layer/Layer} The layer found by id.
*/
PluggableMap.prototype.getLayerById = function (layerId, searchInGroupLayers = true) {
    let returnLayer = null;

    this.getLayers().getArray().forEach(layer => {
        if (searchInGroupLayers && layer instanceof LayerGroup) {
            returnLayer = layer.getLayers().getArray().find(childLayer => childLayer.get("id") === layerId);
        }
        else if (layer.get("id") === layerId) {
            returnLayer = layer;
        }
    });

    return returnLayer;
};


/**
* Finds a layer by its name and returns it.
* @param  {String} layerName Name of the Layer.
* @return {ol/layer/Layer} The layer found by name.
*/
PluggableMap.prototype.getLayerByName = function (layerName) {
    return this.getLayers().getArray().find(layer => layer.get("name") === layerName);
};

/**
* Registered listener for certain events on the map.
* @see https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
* @param {String} event The Eventtype.
* @param {Function} callback The Callback function.
* @param {Object} context The context.
* @returns {void}
*/
PluggableMap.prototype.registerListener = function (event, callback, context) {
    this.on(event, callback, context);
};


/**
* Unsubscribes listener to certain events.
* @param {String | Object} event The event type or an object used as a key.
* @param {Function} callback The callback function.
* @param {Object} context The context.
* @returns {void}
*/
PluggableMap.prototype.unregisterListener = function (event, callback, context) {
    if (typeof event === "string") {
        this.un(event, callback, context);
    }
    else {
        unlistenByKey(event);
    }
};
