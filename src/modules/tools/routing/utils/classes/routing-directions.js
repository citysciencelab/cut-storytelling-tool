/**
 * @description Abstracts the routing directions of external services.
 * @class RoutingDirections
 */
class RoutingDirections {
    /**
     * creates new RoutingDirections
     * @param {[Number, Number, Number, Number]} bbox of the route.
     * @param {Number} distance of the route in meter.
     * @param {Number} duration of the route in seconds.
     * @param {[Number, Number][]} lineString of the route.
     * @param {Number[]} lineStringWaypointIndex to find out where the waypoints on the linestring are.
     */
    constructor ({
        bbox,
        distance,
        duration,
        lineString,
        lineStringWaypointIndex
    }) {
        this.bbox = bbox;
        this.distance = distance;
        this.duration = duration;
        this.lineString = lineString;
        this.lineStringWaypointIndex = lineStringWaypointIndex;
        this.segments = [];
    }

    /**
     * Bbox of the route.
     * @returns {[Number, Number, Number, Number]} bbox of the route.
     */
    getBbox () {
        return this.bbox;
    }

    /**
     * Distance of the route in meter.
     * @returns {Number} distance of the route in meter.
     */
    getDistanceMeter () {
        return this.distance;
    }

    /**
     * Duration of the route in seconds.
     * @returns {Number} duration of the route in seconds.
     */
    getDurationSeconds () {
        return this.duration;
    }

    /**
     * LineString of the route
     * @returns {[Number, Number][]} lineString of the route
     */
    getLineString () {
        return this.lineString;
    }

    /**
     * Segments of directions from on waypoint to another.
     * @returns {RoutingDirectionsSegment[]} segments of directions from on waypoint to another
     */
    getSegments () {
        return this.segments;
    }

    /**
     * LineStringWaypointIndex to find out where the waypoints on the linestring are.
     * @returns {Number[]} lineStringWaypointIndex to find out where the waypoints on the linestring are.
     */
    getLineStringWaypointIndex () {
        return this.lineStringWaypointIndex;
    }
}

export {RoutingDirections};
