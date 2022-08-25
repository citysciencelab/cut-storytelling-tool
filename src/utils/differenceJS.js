/**
     * Looks through each value in the array a, returning an array of all the values that are not present in the array b
     * @param {array} [a=[]] - elements to check
     * @param {array} [b=[]] - elements to check
     * @returns {array} - returns diffrence between array a and b
     */
export default function differenceJs (a = [], b = []) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0) {
        return [];
    }
    if (b.length === 0) {
        return a;
    }
    return a.filter(e => !b.includes(e));
}
