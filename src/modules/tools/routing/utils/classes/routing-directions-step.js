/**
     * @description Instruction step to follow part of a route.
     * @class RoutingDirectionsStep
     */
class RoutingDirectionsStep {
    /**
     * creates new RoutingDirectionsStep
     * @param {number} distance of segment in meter.
     * @param {number} duration to travel segment in seconds.
     * @param {string} instruction to follow the route.
     * @param {string} name of the street.
     * @param {number} type of the road.
     * @param {number[]} waypoints of the linestring.
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
     * @returns {number} distance in meter.
     */
    getDistance () {
        return this.distance;
    }

    /**
     * Duration in seconds.
     * @returns {number} duration in seconds.
     */
    getDuration () {
        return this.duration;
    }

    /**
     * Instruction to follow the route.
     * @returns {string} instruction to follow the route.
     */
    getInstruction () {
        return this.instruction;
    }

    /**
     * Name of the road.
     * @returns {string} name of the road.
     */
    getName () {
        return this.name;
    }

    /**
     * Type of the road
     * @returns {number} type of the road.
     */
    getType () {
        return this.type;
    }

    /**
     * Waypoints of the linestring.
     * @returns {number[]} waypoints of the linestring.
     */
    getWaypoints () {
        return this.waypoints;
    }
}

export {RoutingDirectionsStep};
