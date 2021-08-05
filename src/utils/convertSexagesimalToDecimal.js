/**
 * Converts geographic coordinates to decimal.
 * @param {string} coord geographic (geocentric) lat/long coordinates like 53° 32′ 24″ N 9° 54′ 56″ E
 * @returns {object} containing easting and northing as decimal value
 */
export default function convertSexagesimalToDecimal (coord) {
    if (typeof coord === "string") {
        const index = coord.indexOf("″");

        if (index > -1) {
            let eastingSplit = coord.substr(0, index + 1).trim().split(" "), // 53° 32′ 24″ N
                northingSplit = coord.substr(index + 3).trim().split(" "); // 9° 54′ 56″ E

            eastingSplit = eastingSplit.map(c => c.trim());
            northingSplit = northingSplit.map(c => c.trim());

            const eastingDegree = Number(eastingSplit[0].substr(0, eastingSplit[0].length - 1)),
                northingDegree = Number(northingSplit[0].substr(0, northingSplit[0].length - 1)),
                eastingMin = Number(eastingSplit[1].substr(0, eastingSplit[1].length - 1)) / 60,
                northingMin = Number(northingSplit[1].substr(0, northingSplit[1].length - 1)) / 60,
                eastingSecs = Number(eastingSplit[2].substr(0, eastingSplit[2].length - 1)) / 3600,
                northingSecs = Number(northingSplit[2].substr(0, northingSplit[2].length - 1)) / 3600,
                eastingDez = eastingDegree + eastingMin + eastingSecs,
                northingDez = northingDegree + northingMin + northingSecs,
                easting = eastingDez.toFixed(4) + "°",
                northing = northingDez.toFixed(4) + "°";

            return {easting: easting, northing: northing};
        }
    }
    return {easting: "No value", northing: "No value"};
}
