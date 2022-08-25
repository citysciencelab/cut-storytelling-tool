/**
 * Clones deep the given object.
 *
 * @param {*} obj to clone
 * @returns {*} a clone of the obj
 */
export default function deepCopy (obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (obj instanceof Date) {
        const copy = new Date();

        copy.setTime(obj.getTime());
        return copy;
    }
    if (obj instanceof Array) {
        const copy = [];

        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }
    if (obj instanceof Object) {
        const copy = {};

        for (const attr in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, attr)) {
                copy[attr] = deepCopy(obj[attr]);
            }
        }
        return copy;
    }
    throw new Error("Unable to copy obj this object.");
}
