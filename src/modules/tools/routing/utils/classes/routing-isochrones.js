/**
     * @description Abstracts the search results of isochrones.
     * @class RoutingIsochrones
     */
class RoutingIsochrones {
    /**
     * creates new RoutingIsochrones
     * @param {[number, number, number, number]} bbox of isochrones.
     */
    constructor (bbox) {
        this.bbox = bbox;
        this.areas = [];
    }

    /**
     * BBOX of all areas.
     * @returns {[number, number, number, number]} bbox of all areas.
     */
    getBbox () {
        return this.bbox;
    }

    /**
     * Get all areas of isochrones.
     * @returns {RoutingIsochronesArea} areas of isochrones.
     */
    getAreas () {
        return this.areas;
    }

    /**
     * Adds area.
     * @param {RoutingIsochronesArea} area to add
     * @returns {void}.
     */
    addArea (area) {
        return this.areas.push(area);
    }
}

export {RoutingIsochrones};
