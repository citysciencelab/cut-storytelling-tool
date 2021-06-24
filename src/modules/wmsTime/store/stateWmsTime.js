/**
 * @typedef timeSliderObject
 * @type {object}
 * @property {number} defaultValue Initially selected time value.
 * @property {string} layerId Id of the WMS-T layer for which these values are saved.
 * @property {number} step Distance between each time value.
 * @property {number[]} timeRange Range of possible time values in ascending order. May not be continuous.
 */

/**
 * @typedef WmsTimeState
 * @type {object}
 * @property {string} layerAppendix Value to be added to the second layer, which is added when using the layerSwiper.
 * @property {object} layerSwiper Values for the layerSwiper.
 * @property {number} layerSwiper.active Whether the swiper should be active.
 * @property {number} layerSwiper.isMoving Whether the swiper is currently being moved.
 * @property {number} layerSwiper.swiper The DOM element for the swiper.
 * @property {number} layerSwiper.targetLayer The layer that is supposed to be manipulated.
 * @property {number} layerSwiper.valueX The current x-axis position of the swiper.
 * @property {object} timeSlider Values for the timeSlider.
 * @property {boolean} timeSlider.active Whether the timeSlider window should be active.
 * @property {string} timeSlider.currentLayerId Id of the currently selected WMS-T.
 * @property {timeSliderObject[]} timeSlider.objects Array of objects containing values that are relevant for every WMS-T layer configured.
 */
const state = {
    layerAppendix: "_secondLayer",
    layerSwiper: {
        active: false,
        isMoving: false,
        swiper: null,
        targetLayer: null,
        valueX: ""
    },
    timeSlider: {
        active: false,
        currentLayerId: "",
        objects: [],
        playbackDelay: 1
    }
};

export default state;
