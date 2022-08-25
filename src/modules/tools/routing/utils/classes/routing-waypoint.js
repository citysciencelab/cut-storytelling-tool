import Point from "ol/geom/Point";
import Feature from "ol/Feature";

/**
 * @description Selected waypoints by the user.
 * @class RoutingWaypoint
 */
class RoutingWaypoint {
    /**
     * creates new RoutingWaypoint
     * @param {Number} index of the waypoint in list of waypoints.
     * @param {ol/feature} feature of the waypoint as point in map.
     * @param {String} displayName of the waypoint as text.
     * @param {ol/source} source where to add the feature.
     */
    constructor ({index, feature, displayName, source}) {
        this.index = index;
        this.indexDirectionsLineString = null;
        this.feature = feature;
        this.displayName = displayName;
        this.source = source;
        this.addedToSource = false;
        if (!this.feature) {
            this.coordinates = [];
            this.feature = new Feature({
                geometry: new Point(this.coordinates),
                routingId: this.index
            });
        }
        else {
            this.feature.set("routingId", this.index);
            this.coordinates = this.feature.getGeometry().getCoordinates();
            this.addedToSource = true;
        }
        this.feature.getGeometry().on("change", ({target}) => {
            this.coordinates = target.getCoordinates();
        });
    }

    /**
     * Index of the waypoint in list of waypoints.
     * @returns {Number} index of the waypoint in list of waypoints.
     */
    getIndex () {
        return this.index;
    }
    /**
     * Index of the waypoint in list of waypoints
     * @param {Number} index of the waypoint in list of waypoints
     * @returns {void}
     */
    setIndex (index) {
        this.index = index;
        this.feature.set("routingId", index);
    }

    /**
     * Coordinates in local projection.
     * @returns {[Number, Number]} coordinates in local projection.
     */
    getCoordinates () {
        return this.coordinates;
    }
    /**
     * Coordinates in local projection
     * @param {[Number, Number]} coordinates in local projection
     * @returns {void}
     */
    setCoordinates (coordinates) {
        this.coordinates = coordinates;
        this.feature.getGeometry().setCoordinates(coordinates);
        if (!this.addedToSource) {
            this.source.addFeature(this.feature);
            this.addedToSource = true;
        }
    }

    /**
     * Feature of the waypoint as point in map
     * @returns {ol/feature} feature of the waypoint as point in map
     */
    getFeature () {
        return this.feature;
    }

    /**
     * DisplayName of the waypoint as text.
     * @returns {String|null} displayName of the waypoint as text.
     */
    getDisplayName () {
        if (this.displayName) {
            return this.displayName;
        }
        else if (this.coordinates.length === 2) {
            return `${this.coordinates[0]}, ${this.coordinates[1]}`;
        }
        return null;
    }
    /**
     * DisplayName of the waypoint as text.
     * @param {String} displayName of the waypoint as text
     * @returns {void}
     */
    setDisplayName (displayName) {
        this.displayName = displayName;
    }

    /**
     * Get properties from GeosearchResult
     * @param {RoutingGeosearchResult} geosearchResult to get properties from.
     * @returns {void}
     */
    setFromGeosearchResult (geosearchResult) {
        this.setCoordinates(geosearchResult.getCoordinates());
        this.setDisplayName(geosearchResult.getDisplayName());
    }

    /**
     * Index along linestring
     * @returns {Number|null} index along linestring
     */
    getIndexDirectionsLineString () {
        return this.indexDirectionsLineString;
    }
    /**
     * Index along linestring
     * @param {Number} indexDirectionsLineString along linestring
     * @returns {void}
     */
    setIndexDirectionsLineString (indexDirectionsLineString) {
        this.indexDirectionsLineString = indexDirectionsLineString;
    }

    /**
     * Resets the waypoint to the initial state.
     * @returns {void}
     */
    reset () {
        this.displayName = null;
        this.indexDirectionsLineString = null;
        if (this.addedToSource) {
            this.source.removeFeature(this.feature);
        }
        this.addedToSource = false;
        this.feature.getGeometry().setCoordinates([]);
    }
}

export {RoutingWaypoint};
