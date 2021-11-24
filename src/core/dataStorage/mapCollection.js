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
     * Gets a map by the given id and mode.
     * @param {String} id The map id.
     * @param {String} mode The map mode.
     * @returns {module:ol/PluggableMap~PluggableMap} The map.
     */
    getMap: function (id, mode) {
        return mapCollection.find(map => map?.id === id && map?.mode === mode);
    },
    /**
     * Removes all entries from the collection.
     * @returns {void}
     */
    clear: function () {
        mapCollection.length = 0;
    }
};
