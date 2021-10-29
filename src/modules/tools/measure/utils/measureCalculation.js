import {getArea, getLength} from "ol/sphere";

/**
 * Calculates lengths and deviations of a line array.
 * @param {String} projection EPSG projection code
 * @param {module:ol/geom/LineString[]} lines lines to calculate length of
 * @param {Number} radius earth radius to assume for calculation
 * @param {String} accuracy accuracy of the measurement result
 * @param {Number} selectedUnit index of unit
 * @return {MeasureCalculation[]} calculated value for display, if value is 0, return without unit
 */
export function calculateLineLengths (projection, lines, radius, accuracy, selectedUnit) {
    return Object.keys(lines).reduce((accumulator, lineKey) => {
        const line = lines[lineKey],
            length = getLength(line.getGeometry(), {projection, radius}),
            measurementAccuracy = accuracy;

        if (length.toFixed(0) === "0") {
            accumulator[lineKey] = "0";
        }
        else if (selectedUnit === "1") {
            accumulator[lineKey] = `${(length / 1000).toFixed(1)} km`;
        }
        else {
            accumulator[lineKey] = measurementAccuracy === "decimeter" || (measurementAccuracy === "dynamic" && length < 10)
                ? `${length.toFixed(1)} m`
                : `${length.toFixed(0)} m`;
        }

        return accumulator;
    }, {});
}

/**
 * Calculates lengths and deviations of a line array.
 * @param {String} projection EPSG projection code
 * @param {module:ol/geom/Polygon[]} polygons polygons to area of
 * @param {Number} radius earth radius to assume for calculation
 * @param {String} accuracy accuracy of the measurement result
 * @param {Number} selectedUnit index of unit
 * @return {MeasureCalculation[]} calculated value for display, if value is 0, return without unit
 */
export function calculatePolygonAreas (projection, polygons, radius, accuracy, selectedUnit) {
    return Object.keys(polygons).reduce((accumulator, polygonKey) => {
        const polygon = polygons[polygonKey],
            area = getArea(polygon.getGeometry(), {projection, radius}),
            measurementAccuracy = accuracy;

        if (area.toFixed(0) === "0") {
            accumulator[polygonKey] = "0";
        }
        else if (selectedUnit === "1") {
            accumulator[polygonKey] = `${(area / 1000000).toFixed(1)} km²`;
        }
        else {
            accumulator[polygonKey] = measurementAccuracy === "decimeter" || (measurementAccuracy === "dynamic" && area < 10)
                ? `${area.toFixed(1)} m²`
                : `${area.toFixed(0)} m²`;
        }

        return accumulator;
    }, {});
}
