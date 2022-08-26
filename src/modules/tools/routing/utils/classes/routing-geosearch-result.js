/**
 * @description Abstracts the search results of coordinates by text and text by coordinates.
 * @class RoutingGeosearchResult
 */
class RoutingGeosearchResult {
    /**
     * creates new RoutingGeosearchResult
     * @param {Number} lat coordinate.
     * @param {Number} lng coordinate.
     * @param {String} displayName of coordinate.
     */
    constructor (lat, lng, displayName) {
        this.lat = lat;
        this.lng = lng;
        this.displayName = displayName;
        this.coordinates = [];
    }

    /**
     * Lat coordinate.
     * @returns {Number} lat coordinate.
     */
    getLat () {
        return this.lat;
    }
    /**
     * Lat coordinate.
     * @param {Number} lat coordinate.
     * @returns {void}
     */
    setLat (lat) {
        this.lat = lat;
    }

    /**
     * Lng coordinate.
     * @returns {Number} lng coordinate.
     */
    getLng () {
        return this.lng;
    }
    /**
     * Lng coordinate.
     * @param {Number} lng coordinate.
     * @returns {void}
     */
    setLng (lng) {
        this.lng = lng;
    }

    /**
     * DisplayName of coordinate.
     * @returns {Number} displayName of coordinate.
     */
    getDisplayName () {
        return this.displayName;
    }
    /**
     * DisplayName coordinate.
     * @param {Number} displayName coordinate.
     * @returns {void}
     */
    setDisplayName (displayName) {
        this.displayName = displayName;
    }

    /**
     * Coordinates in local projection.
     * @returns {[Number, Number]} coordinates in local projection.
     */
    getCoordinates () {
        return this.coordinates;
    }
    /**
     * Coordinates in local projection.
     * @param {[Number, Number]} coordinates in local projection.
     * @returns {void}
     */
    setCoordinates (coordinates) {
        this.coordinates = coordinates;
    }
}

export {RoutingGeosearchResult};
