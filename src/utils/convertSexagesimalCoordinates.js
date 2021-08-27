/**
 * Converts geographic coordinates to decimal.
 * @param {string} coord geographic (geocentric) lat/long coordinates like 53° 32′ 24″ N 9° 54′ 56″ E
 * @returns {object} containing easting and northing as decimal value
 */
export function convertSexagesimalToDecimal (coord) {
    if (typeof coord === "string") {
        return convertSexagesimalStringToDecimal(coord);
    }
    else if (Array.isArray(coord)) {
        return convertSexagesimalArrayToDecimal(coord);
    }
    return {easting: "No value", northing: "No value"};
}

/**
 * Converts geographic coordinates to decimal.
 * @param {string} coord geographic (geocentric) lat/long coordinates like 53° 32′ 24″ N 9° 54′ 56″ E
 * @returns {object} containing easting and northing as decimal value
 */
function convertSexagesimalStringToDecimal (coord) {
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
    return {easting: "No value", northing: "No value"};
}
/**
 * Converts geographic coordinates to to decimal.
 * @param {Array} coordinates geographic (geocentric) lat/long coordinates.
 * @returns {Array} containing easting and northing
 */
function convertSexagesimalArrayToDecimal (coordinates) {
    const latitude = coordinates[0],
        newLatitude = Number(latitude[0]) +
            (Number(latitude[1] ? latitude[1] : 0) / 60) +
            (Number(latitude[2] ? latitude[2] : 0) / 60 / 60),

        longitude = coordinates[1],
        newLongitude = Number(longitude[0]) +
            (Number(longitude[1] ? longitude[1] : 0) / 60) +
            (Number(longitude[2] ? longitude[2] : 0) / 60 / 60);

    // turning the coordinates around to make it work for WGS84
    return [newLongitude, newLatitude];
}


/**
 * Converts geographic coordinates as string to easting and northing coordinates.
 * @param {string} coord geographic (geocentric) lat/long coordinates like 0° 00′ 00″ 0° 00′ 00″ or 53° 33′ 04″ N 9° 56′ 29″ E
 * @returns {object} containing easting and northing
 */
export function convertSexagesimalFromString (coord) {
    let coordinates = coord.replace(/E/ig, ""),
        index = -1,
        secondIndex = -1,
        easting = "No value",
        northing = "No value";

    coordinates = coordinates.replace(/N/ig, "");
    coordinates = coordinates.replace(/S/ig, "");
    index = coordinates.indexOf("″");
    secondIndex = coordinates.indexOf("″", index + 1);
    if (index > -1) {
        easting = coordinates.substring(0, index + 1).trim();
        northing = coordinates.substring(index + 2, secondIndex + 1).trim();
    }
    return {easting: easting, northing: northing};
}
/**
 * Converts geographic coordinates as number lat/long coordinates.
 * @param {number} coordinate geographic (geocentric) lat/long coordinates as decimal value
 * @returns {string} lat/long coordinates
 */
export function convertSexagesimalFromDecimal (coordinate) {
    const absolute = Math.abs(coordinate),
        degrees = Math.floor(absolute),
        minutesNotTruncated = (absolute - degrees) * 60,
        minutes = Math.floor(minutesNotTruncated),
        seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + "° " + minutes + "′ " + seconds + "″";
}
