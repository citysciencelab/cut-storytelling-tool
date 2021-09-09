/**
 * Checks if the passed parameter is an object.
 *
 * @param {*} value parameter to check.
 * @returns {Boolean} true if the value is an object; false otherwise.
 */
export default function isObject (value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}
