
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
        case "yes": case "true": case "1": case "": case 1: return true;
        case "no": case "false": case "0": case 0: case null: case undefined: return false;
        default: return string;
    }
}

/**
 * Converts an array string to an array.
 * @param {String} string array as string (a valid JSON string)
 * @returns {Array} the converted array
 */
function convertStringToArray (string) {
    if (typeof string === "string" && string.charAt(0) === "[" && string.charAt(string.length - 1) === "]") {
        return JSON.parse(string);
    }
    return string;
}

/**
 * Converts a string to boolean or array.
 * @param {String} string to convert to boolean or array
 * @returns {*} the converted string
 */
export default function convert (string) {
    let ret = convertStringToBoolean(string);

    if (typeof ret === "boolean") {
        return ret;
    }
    ret = convertStringToArray(string);
    if (Array.isArray(ret)) {
        return ret;
    }
    return string;
}
