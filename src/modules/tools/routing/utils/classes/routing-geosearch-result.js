/**
     * @description Abstracts the search results of coordinates by text and text by coordinates.
     * @class RoutingGeosearchResult
     */
class RoutingGeosearchResult {
    /**
     * creates new RoutingGeosearchResult
     * @param {number} lat coordinate.
     * @param {number} lng coordinate.
     * @param {string} displayName of coordinate.
     */
    constructor (lat, lng, displayName) {
        this.lat = lat;
        this.lng = lng;
        this.displayName = displayName;
        this.coordinates = [];
    }

    /**
     * Lat coordinate.
     * @returns {number} lat coordinate.
     */
    getLat () {
        return this.lat;
    }
    /**
     * Lat coordinate.
     * @param {number} lat coordinate.
     * @returns {void}
     */
    setLat (lat) {
        this.lat = lat;
    }

    /**
     * Lng coordinate.
     * @returns {number} lng coordinate.
     */
    getLng () {
        return this.lng;
    }
    /**
     * Lng coordinate.
     * @param {number} lng coordinate.
     * @returns {void}
     */
    setLng (lng) {
        this.lng = lng;
    }

    /**
     * DisplayName of coordinate.
     * @returns {string} displayName of coordinate.
     */
    getDisplayName () {
        return this.displayName;
    }
    /**
     * DisplayName coordinate.
     * @param {string} displayName coordinate.
     * @returns {void}
     */
    setDisplayName (displayName) {
        this.displayName = displayName;
    }

    /**
     * Coordinates in local projection.
     * @returns {[number, number]} coordinates in local projection.
     */
    getCoordinates () {
        return this.coordinates;
    }
    /**
     * Coordinates in local projection.
     * @param {[number, number]} coordinates in local projection.
     * @returns {void}
     */
    setCoordinates (coordinates) {
        this.coordinates = coordinates;
    }
}

export {RoutingGeosearchResult};
