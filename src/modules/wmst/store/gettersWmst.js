import {generateSimpleGetters} from "../../../app-store/utils/generators";
import initialState from "./stateWmst";

/**
 * Creates an array with values ascending values from min to max separated by step.
 * Function inspired by https://stackoverflow.com/questions/8069315/create-array-of-all-integers-between-two-numbers-inclusive-in-javascript-jquer
 *
 * @param {Number} min Minimum value.
 * @param {Number} max Maximum value.
 * @param {Number} [step = 1] Distance between each value inside the array.
 * @returns {Number[]} Array of numbers between min and max with a distance of step to each neighbouring number.
 */
function createTimeRange (min, max, step = 1) {
    return Array(Math.floor((max - min) / step) + 1)
        .fill(undefined)
        .map((_, index) => parseInt(min, 10) + (index * step));
}

const getters = {
    ...generateSimpleGetters(initialState),
    defaultValue ({timeSlider}) {
        return timeSlider.defaultValue;
    },
    min ({timeSlider}) {
        return timeSlider.min;
    },
    max ({timeSlider}) {
        return timeSlider.max;
    },
    step ({timeSlider}) {
        return timeSlider.step;
    },
    timeRange (_, {min, max, step}) {
        if (min > max) {
            throw Error(i18next.t("common:modules.wmst.timeSlider.invalidTimeParameters"));
        }

        return createTimeRange(parseInt(min, 10), parseInt(max, 10), Number(step));
    },
    // LayerSwiper getters
    targetLayer ({layerSwiper}) {
        return layerSwiper.targetLayer;
    },
    mapObject ({layerSwiper}) {
        return layerSwiper.mapObject;
    }
};

export default getters;
