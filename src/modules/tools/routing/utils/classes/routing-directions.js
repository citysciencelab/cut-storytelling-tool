/**
     * @description Abstracts the routing directions of external services.
     * @class RoutingDirections
     */
class RoutingDirections {
    /**
     * creates new RoutingDirections
     * @param {[number, number, number, number]} bbox of the route.
     * @param {number} distance of the route in meter.
     * @param {number} duration of the route in seconds.
     * @param {[number, number][]} lineString of the route.
     * @param {number[]} lineStringWaypointIndex to find out where the waypoints on the linestring are.
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
     * @returns {[number, number, number, number]} bbox of the route.
     */
    getBbox () {
        return this.bbox;
    }

    /**
     * Distance of the route in meter.
     * @returns {number} distance of the route in meter.
     */
    getDistanceMeter () {
        return this.distance;
    }

    /**
     * Duration of the route in seconds.
     * @returns {number} duration of the route in seconds.
     */
    getDurationSeconds () {
        return this.duration;
    }

    /**
     * LineString of the route
     * @returns {[number, number][]} lineString of the route
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
     * @returns {number[]} lineStringWaypointIndex to find out where the waypoints on the linestring are.
     */
    getLineStringWaypointIndex () {
        return this.lineStringWaypointIndex;
    }
}

export {RoutingDirections};
