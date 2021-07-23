import {getProjections} from "masterportalAPI/src/crs";

/**
 *  Converts a boolean string to a boolean.
 * @param {String} string representation of a boolean as string
 * @returns {boolean} the converted string
 */
function convertStringToBoolean (string) {
    let toCheck = string;

    if (typeof string === "string") {
        toCheck = toCheck.toLowerCase().trim();
    }
    switch (toCheck) {
        case "yes": case "true": case "": return true;
        case "no": case "false": case null: case undefined: return false;
        default: return string;
    }
}

/**
 * Converts an array string to an array.
 * @param {String} string array as string (a valid JSON string)
 * @returns {Array} the converted array
 */
function convertStringToArray (string) {
    if (typeof string === "string") {
        if (string.charAt(0) === "[" && string.charAt(string.length - 1) === "]") {
            return JSON.parse(string);
        }
        const index = string.indexOf(",");

        if (index > -1) {
            let firstPart = string.slice(0, index),
                secondPart = string.slice(index + 1, string.length);

            firstPart = Number.parseInt(firstPart, 10);
            secondPart = Number.parseInt(secondPart, 10);
            if (!isNaN(firstPart) && !isNaN(secondPart)) {
                return [firstPart, secondPart];
            }
        }
    }
    return string;
}

/**
 * Returns the projection object to given EPSG code.
 * @param {String} string EPSG code of the projection
 * @returns {Object} projection object to given EPSG code
 */
function findProjection (string) {
    let projection = null;

    if (string === "EPSG:25832") {
        projection = getProjections().find(proj => proj.name === "http://www.opengis.net/gml/srs/epsg.xml#25832");
        if (!projection) {
            projection = getProjections().find(proj => proj.name === string);
        }
    }
    else {
        projection = getProjections().find(proj => proj.name === string);
    }
    return projection;
}

/**
 * Converts a string to boolean or array.
 * @param {String} string to convert to boolean or array
 * @returns {*} the converted string
 */
export default function convert (string) {
    let ret = string;

    if (typeof string === "string" && string.startsWith("EPSG")) {
        return findProjection(string);
    }
    ret = convertStringToBoolean(string);
    if (typeof ret === "boolean") {
        return ret;
    }
    ret = convertStringToArray(string);
    if (Array.isArray(ret)) {
        return ret;
    }
    return string;
}
