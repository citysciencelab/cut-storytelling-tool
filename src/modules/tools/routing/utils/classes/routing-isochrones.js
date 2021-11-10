/**
 * @description Abstracts the search results of isochrones.
 * @class RoutingIsochrones
 */
class RoutingIsochrones {
    /**
     * creates new RoutingIsochrones
     * @param {[Number, Number, Number, Number]} bbox of isochrones.
     */
    constructor (bbox) {
        this.bbox = bbox;
        this.areas = [];
    }

    /**
     * BBOX of all areas.
     * @returns {[Number, Number, Number, Number]} bbox of all areas.
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
