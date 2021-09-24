/**
     * @description Segments are part of directions from one waypoint to another
     * @class RoutingDirectionsSegment
     */
class RoutingDirectionsSegment {
    /**
     * creates new RoutingDirectionsSegment
     * @property {number} distance of segment in meter.
     * @property {number} duration to travel segment in seconds.
     * @property {RoutingDirectionsStep[]} steps to follow the route.
     */
    constructor ({distance, duration, steps}) {
        this.distance = distance;
        this.duration = duration;
        this.steps = steps;
        this.displayDetails = false;
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
     * Instruction steps to follow the route
     * @returns {RoutingDirectionsStep[]} steps to follow the route.
     */
    getSteps () {
        return this.steps;
    }

    /**
     * Tracks if details should be displayed in RoutingDirections.
     * @returns {boolean} yes/no.
     */
    getDisplayDetails () {
        return this.displayDetails;
    }
}

export {RoutingDirectionsSegment};
