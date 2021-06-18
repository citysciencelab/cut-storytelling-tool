/**
 * Retrieves the currently selected timeSliderObject configured for a selected WMS-T.
 *
 * @param {timeSliderObject[]} objects Array of objects containing values that are relevant for every WMS-T layer configured.
 * @param {string} currentLayerId Id of the currently selected WMS-T.
 * @returns {timeSliderObject/object} The currently selected timeSliderObject or an empty object, if none are present or no layer is selected.
 */
export default function findCurrentTimeSliderObject (objects, currentLayerId) {
    if (objects.length > 0 && currentLayerId !== "") {
        return objects.find(({layerId}) => currentLayerId === layerId);
    }
    return {};
}
