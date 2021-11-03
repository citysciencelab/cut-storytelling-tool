import stateRouting from "../../store/stateRouting";

/**
     * @description Abstracts the search results of isochrones areas.
     * @class RoutingIsochronesArea
     */
class RoutingIsochronesArea {
    /**
     * creates new RoutingIsochronesArea
     * @param {Array<Array<[number, number]>>} coordinates of area as polygon.
     * @param {number} groupIndex of area.
     * @param {number} value of area.
     * @param {number} maximum value for interval.
     * @param {number} interval value parameter.
     * @param {string} speedProfile parameter.
     * @param {string} optimization parameter.
     * @param {string[]} avoidSpeedProfileOptions parameter.
     * @param {number} displayValue of area for GUI
     */
    constructor (coordinates, groupIndex, value, maximum, interval, speedProfile, optimization, avoidSpeedProfileOptions, displayValue) {
        this.coordinates = coordinates;
        this.groupIndex = groupIndex;
        this.value = value;
        this.maximum = maximum;
        this.interval = interval;
        this.speedProfile = speedProfile;
        this.optimization = optimization;
        this.avoidSpeedProfileOptions = avoidSpeedProfileOptions;
        this.displayValue = displayValue;
        this.calculateColor();
    }

    /**
     * Calculates the color for the area by interpolating between start and end color.
     * @returns {void}
     */
    calculateColor () {
        const startColor = stateRouting.isochronesSettings.styleIsochrones.startColor,
            endColor = stateRouting.isochronesSettings.styleIsochrones.endColor,
            startValue = this.getValue() - this.getInterval(),
            endValue = this.getMaximum() - this.getInterval(),
            fraction = startValue === 0 || endValue === 0 ? 0 : startValue / endValue;

        this.color = [
            (endColor[0] - startColor[0]) * fraction + startColor[0],
            (endColor[1] - startColor[1]) * fraction + startColor[1],
            (endColor[2] - startColor[2]) * fraction + startColor[2]
        ];
    }

    /**
     * Polygon coordinates.
     * @returns {Array<Array<[number, number]>>} coordinates of area as polygon.
     */
    getCoordinates () {
        return this.coordinates;
    }

    /**
     * Group index of area.
     * @returns {number} groupIndex of area.
     */
    getGroupIndex () {
        return this.groupIndex;
    }

    /**
     * Value of area.
     * @returns {number} value of area.
     */
    getValue () {
        return this.value;
    }

    /**
     * Maximum value of area.
     * @returns {number} maximum value of area.
     */
    getMaximum () {
        return this.maximum;
    }
    /**
     * Interval value of area.
     * @returns {number} interval value of area.
     */
    getInterval () {
        return this.interval;
    }
    /**
     * SpeedProfile parameter used.
     * @returns {string} speedProfile parameter used.
     */
    getSpeedProfile () {
        return this.speedProfile;
    }
    /**
     * Optimization parameter used.
     * @returns {string} optimization parameter used.
     */
    getOptimization () {
        return this.optimization;
    }

    /**
     * RGB color to display the area in.
     * @returns {[number, number, number]} rgb color to display the area in.
     */
    getColor () {
        return this.color;
    }

    /**
     * RGB color string to display the area in.
     * @returns {[number, number, number]} rgb color string to display the area in.
     */
    getColorRgbString () {
        return `rgb(${this.color[0]},${this.color[1]},${this.color[2]}`;
    }

    /**
     * Avoided speed profile options.
     * @returns {string[]} avoided speed profile options.
     */
    getAvoidSpeedProfileOptions () {
        return this.avoidSpeedProfileOptions;
    }

    /**
     * DisplayValue of area for GUI.
     * @returns {number} displayValue of area for GUI.
     */
    getDisplayValue () {
        return this.displayValue;
    }

    /**
     * Creates GEOJSON polygon feature for area
     * @param {Object} additionalProperties to add to the feature properties.
     * @returns {Feature<Polygon>} GEOJSON polygon feature.
     */
    getGeojsonFeature (additionalProperties) {
        return {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: this.getCoordinates()
            },
            properties: {
                value: this.getValue(),
                interval: this.getInterval(),
                maximum: this.getMaximum(),
                color: this.getColor(),
                groupIndex: this.getGroupIndex(),
                optimization: this.getOptimization(),
                speedProfile: this.getSpeedProfile(),
                avoidSpeedProfileOptions: this.getAvoidSpeedProfileOptions(),
                ...additionalProperties
            }
        };
    }
}

export {RoutingIsochronesArea};
