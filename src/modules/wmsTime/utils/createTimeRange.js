/**
 * Creates an array with values ascending values from min to max separated by step.
 * Function inspired by https://stackoverflow.com/questions/8069315/create-array-of-all-integers-between-two-numbers-inclusive-in-javascript-jquer
 *
 * @param {Number} min Minimum value.
 * @param {Number} max Maximum value.
 * @param {Number} [step = 1] Distance between each value inside the array.
 * @returns {Number[]} Array of numbers between min and max with a distance of step to each neighbouring number.
 */
export default function createTimeRange (min, max, step = 1) {
    return Array(Math.floor((max - min) / step) + 1)
        .fill(undefined)
        .map((_, index) => min + (index * step));
}
