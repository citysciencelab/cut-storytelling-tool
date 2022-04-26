import {getArea, getLength} from "ol/sphere";

/**
 * Calculates lengths and deviations of a line array.
 * @param {String} projection EPSG projection code
 * @param {module:ol/geom/LineString[]} lines lines to calculate length of
 * @param {Number} radius earth radius to assume for calculation
 * @param {String} accuracy accuracy of the measurement result
 * @param {String} selectedUnit index of unit as string
 * @param {String[]} lineStringUnits list of supported units
 * @return {MeasureCalculation[]} calculated value for display, if value is 0, return without unit
 */
export function calculateLineLengths (projection, lines, radius, accuracy, selectedUnit, lineStringUnits) {
    return Object.keys(lines).reduce((accumulator, lineKey) => {
        const line = lines[lineKey],
            length = getLength(line.getGeometry(), {projection, radius}),
            measurementAccuracy = accuracy,
            selectedUnitName = lineStringUnits[selectedUnit];

        if (length.toFixed(0) === "0") {
            accumulator[lineKey] = "0";
        }
        else if (selectedUnitName === "m") {
            accumulator[lineKey] = measurementAccuracy === "decimeter" || (measurementAccuracy === "dynamic" && length < 10)
                ? `${length.toFixed(1)} m`
                : `${length.toFixed(0)} m`;
        }
        else if (selectedUnitName === "km") {
            accumulator[lineKey] = `${(length / 1000).toFixed(1)} km`;
        }
        else if (selectedUnitName === "nm") {
            // see https://en.wikipedia.org/wiki/Nautical_mile
            const metresPerNm = 1852,
                unitLength = length / metresPerNm;

            accumulator[lineKey] = measurementAccuracy === "decimeter" || (measurementAccuracy === "dynamic" && unitLength < 10)
                ? `${unitLength.toFixed(1)} nm`
                : `${unitLength.toFixed(0)} nm`;
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
 * @param {String} selectedUnit index of unit as number
 * @param {String[]} polygonUnits list of supported units
 * @return {MeasureCalculation[]} calculated value for display, if value is 0, return without unit
 */
export function calculatePolygonAreas (projection, polygons, radius, accuracy, selectedUnit, polygonUnits) {
    return Object.keys(polygons).reduce((accumulator, polygonKey) => {
        const polygon = polygons[polygonKey],
            area = getArea(polygon.getGeometry(), {projection, radius}),
            measurementAccuracy = accuracy,
            selectedUnitName = polygonUnits[selectedUnit];

        if (area.toFixed(0) === "0") {
            accumulator[polygonKey] = "0";
        }
        else if (selectedUnitName === "m²") {
            accumulator[polygonKey] = measurementAccuracy === "decimeter" || (measurementAccuracy === "dynamic" && area < 10)
                ? `${area.toFixed(1)} m²`
                : `${area.toFixed(0)} m²`;
        }
        else if (selectedUnitName === "ha") {
            const unitArea = area / 10000;

            accumulator[polygonKey] = measurementAccuracy === "decimeter" || (measurementAccuracy === "dynamic" && unitArea < 10)
                ? `${unitArea.toFixed(1)} ha`
                : `${unitArea.toFixed(0)} ha`;
        }
        else if (selectedUnitName === "km²") {
            accumulator[polygonKey] = `${(area / 1000000).toFixed(1)} km²`;
        }

        return accumulator;
    }, {});
}
