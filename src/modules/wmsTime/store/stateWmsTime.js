/**
 * @typedef timeSliderObject
 * @type {object}
 * @property {string} layerId Id of the WMS-T layer for which these values are saved.
 * @property {number} min Lower bound for the selectable time values.
 * @property {number} max Upper bound for the selectable time values.
 * @property {number} defaultValue Initially selected time value.
 * @property {number} step Distance between each time value.
 */

/**
 * @typedef WmsTimeState
 * @type {object}
 * @property {object} timeSlider Values for the timeSlider.
 * @property {boolean} timeSlider.active Whether the timeSlider window should be active.
 * @property {string} timeSlider.currentLayerId Id of the currently selected WMS-T.
 * @property {timeSliderObject[]} timeSlider.objects Array of objects containing values that are relevant for every WMS-T layer configured.
 */
const state = {
    timeSlider: {
        active: false,
        currentLayerId: "",
        objects: []
    },
    swiper: {
        active: false
    }
};

export default state;
