/**
 * Retrieves the currently selected timeSliderObject configured for a selected WMS-T.
 *
 * @param {string} currentLayerId Id of the currently selected WMS-T.
 * @param {timeSliderObject[]} objects Array of objects containing values that are relevant for every WMS-T layer configured.
 * @returns {timeSliderObject/object} The currently selected timeSliderObject or an empty object, if none are present, no layer is selected or the given layerId does not belong to an object.
 */
export default function findCurrentTimeSliderObject (currentLayerId, objects) {
    if (objects.length > 0 && currentLayerId !== "") {
        return objects.find(({layerId}) => currentLayerId === layerId) || {};
    }
    return {};
}
