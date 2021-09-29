const mapCollection = [];

export default {
    /**
     * Adds a map to the mapCollection
     * @param {module:ol/PluggableMap~PluggableMap} map The map.
     * @param {String} id The map id.
     * @param {String} mode The map mode.
     * @returns {void}
     */
    addMap: function (map, id, mode) {
        map.id = id;
        map.mode = mode;

        mapCollection.push(map);
    },

    /**
     * Gets the current map.
     * @param {String} mapId of the map.
     * @param {String} mapMode of the map.
     * @returns {module:ol/PluggableMap~PluggableMap} The current map.
     */
    getCurrentMap: function (mapId, mapMode) {
        return this.getMap(mapId, mapMode);
    },

    /**
     * Gets a map by the given id and mode.
     * @param {String} id The map id.
     * @param {String} mode The map mode.
     * @returns {module:ol/PluggableMap~PluggableMap} The map.
     */
    getMap: function (id, mode) {
        return mapCollection.find(map => map?.id || map.get("id") === id && map?.mode || map.get("mode") === mode);
    },
    /**
     * Gets a map by the given id.
     * @param {String} id The map id.
     * @returns {module:ol/PluggableMap~PluggableMap} The map.
     */
    getMapById: function (id) {
        return mapCollection.find(map => (map?.id || map.get("id")) === id);
    },
    getMapByMode: function (mapMode) {
        return mapCollection.find(map => (map?.mapMode || map.get("mapMode")) === mapMode);
    },

    /**
     * Gets the map collection.
     * @returns {module:ol/PluggableMap~PluggableMap[]} The map collection.
     */
    getMaps: function () {
        return mapCollection;
    },

    /**
     * Removes a map from the map collection.
     * @param {String} id The map id.
     * @returns {void}
     */
    removeMapById: function (id) {
        mapCollection.filter(map => (map?.id || map.get("id")) !== id);
    },
    /**
 * Removes all entries from the collection.
 * @returns {void}
 */
    clear: function () {
        mapCollection.length = 0;
    }
};
