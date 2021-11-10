/**
 * @description Instruction step to follow part of a route.
 * @class RoutingDirectionsStep
 */
class RoutingDirectionsStep {
    /**
     * creates new RoutingDirectionsStep
     * @param {Number} distance of segment in meter.
     * @param {Number} duration to travel segment in seconds.
     * @param {String} instruction to follow the route.
     * @param {String} name of the street.
     * @param {Number} type of the road.
     * @param {Number[]} waypoints of the linestring.
     */
    constructor ({distance, duration, instruction, name, type, waypoints}) {
        this.distance = distance;
        this.duration = duration;
        this.instruction = instruction;
        this.name = name;
        this.type = type;
        this.waypoints = waypoints;
    }

    /**
     * Distance in meter.
     * @returns {Number} distance in meter.
     */
    getDistance () {
        return this.distance;
    }

    /**
     * Duration in seconds.
     * @returns {Number} duration in seconds.
     */
    getDuration () {
        return this.duration;
    }

    /**
     * Instruction to follow the route.
     * @returns {String} instruction to follow the route.
     */
    getInstruction () {
        return this.instruction;
    }

    /**
     * Name of the road.
     * @returns {String} name of the road.
     */
    getName () {
        return this.name;
    }

    /**
     * Type of the road
     * @returns {Number} type of the road.
     */
    getType () {
        return this.type;
    }

    /**
     * Waypoints of the linestring.
     * @returns {Number[]} waypoints of the linestring.
     */
    getWaypoints () {
        return this.waypoints;
    }
}

export {RoutingDirectionsStep};
