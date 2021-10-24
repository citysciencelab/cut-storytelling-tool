import {convertColor} from "../../../../utils/convertColor";
import {getPrimaryColor, getColorUniversalDesign} from "../../../../utils/colors";
import {SensorThingsHttp} from "../../../../utils/sensorThingsHttp.js";
import moment from "moment";

/**
 * returns an url based on the given query an @iot.selfLink of a STA object
 * @param {String} selfLink the selfLink to add the query at
 * @param {String} query the query to add to the selfLink
 * @returns {String} the link to use
 */
function getQueryLink (selfLink, query) {
    if (typeof query !== "string" || typeof selfLink !== "string") {
        return false;
    }
    else if (query.substr(0, 1) !== "/") {
        return selfLink + "/" + query;
    }
    return selfLink + query;
}

/**
 * calls the SensorThingsHttp api to receive observations
 * @param {String} url the url to call
 * @param {Function} [onsuccess] as function(result) with result as Object[] (result is always an array)
 * @param {Function} [onstart] as function called on start
 * @param {Function} [oncomplete] as function called at the end anyways
 * @param {Function} [onerror] as function(error)
 * @returns {void}
 */
function getObservations (url, onsuccess, onstart, oncomplete, onerror) {
    const api = new SensorThingsHttp({
        removeIotLinks: true
    });

    api.get(url, onsuccess, onstart, oncomplete, onerror);
}

/**
 * converter for complexTypes to line chart data for ChartJS
 * @param {ComplexType} listOfObservations the complexType to convert - sort complexTypes beforehand with sortComplexType
 * @param {String} label the label to use for the legend
 * @param {String} format the format to convert the phenomenonTime to
 * @param {Object} [options=null] options to apply to each line
 * @param {*} [lineColor=false] the color of the line (everything convertColor accepts), the default is masterportal primary color
 * @return {Object|boolean} an object following chartJS dataset configuration or false on failure
 * @see {@link https://www.chartjs.org/docs/master/general/data-structures.html}
 */
function convertObservationsToLinechart (listOfObservations, label, format, options = null, lineColor = false) {
    return convertObservationsToMultilinechart([listOfObservations], label, format, options, [lineColor ? lineColor : getPrimaryColor()]);
}

/**
 * converter for STA observations to multi line chart data for ChartJS
 * @param {Object[]} listOfObservations an array of observations (see STA) to convert
 * @param {String} label the label to use for the legend
 * @param {String} format the format to convert the phenomenonTime to
 * @param {Object} [options=null] options to apply to each line
 * @param {String[]|boolean} [lineColors=false] the array of colors (everything convertColor accepts) that overwrites the default colors
 * @see {@link https://jfly.uni-koeln.de/color/}
 * @return {Object|boolean} an object following chartJS dataset configuration for multilinecharts or false on failure
 * @see {@link https://www.chartjs.org/docs/master/general/data-structures.html}
 */
function convertObservationsToMultilinechart (listOfObservations, label, format, options = null, lineColors = false) {
    if (!Array.isArray(listOfObservations)) {
        return false;
    }
    const labelsets = [],
        datasets = [],
        // default colors - see  https://jfly.uni-koeln.de/color/
        defaultColors = Array.isArray(lineColors) && lineColors.length ? lineColors : getColorUniversalDesign();

    listOfObservations.forEach((observations, idx) => {
        if (!Array.isArray(observations)) {
            return;
        }
        const data = [],
            labels = [];

        observations.forEach(observation => {
            if (!isObservation(observation)) {
                return;
            }
            labels.push(convertPhenomenonTime(observation.phenomenonTime, format));
            data.push(observation.result);
        });

        labelsets.push(labels);
        datasets.push(Object.assign({
            label,
            data,
            borderColor: convertColor(defaultColors[idx % defaultColors.length], "rgbaString"),
            backgroundColor: convertColor(defaultColors[idx % defaultColors.length], "rgbaString"),
            spanGaps: false,
            fill: false,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 4,
            lineTension: 0
        }, options));
    });

    if (!Array.isArray(labelsets) || !labelsets.length || !Array.isArray(datasets) || !datasets.length) {
        return false;
    }
    return {
        datasets,
        labels: labelsets[0]
    };
}

/**
 * checks if the given value is a STA observation
 * @param {*} observation anything to check
 * @returns {Boolean} true if this is an observation, false if not
 */
function isObservation (observation) {
    return typeof observation === "object" && observation !== null
        && typeof observation["@iot.id"] === "number"
        && typeof observation.phenomenonTime === "string"
        && Object.prototype.hasOwnProperty.call(observation, "result");
}

/**
 * converts the given phenomenonTime from a STA observation into the given format
 * @param {String} phenomenonTime the phenomenonTime to convert
 * @param {String} format a format to use for moment
 * @returns {String|Boolean} the phenomenonTime in the given format or false if an error occured
 */
function convertPhenomenonTime (phenomenonTime, format) {
    if (typeof phenomenonTime !== "string" || typeof format !== "string") {
        return false;
    }
    const validPhenomenonTime = phenomenonTime.indexOf("/") === -1 ? phenomenonTime : phenomenonTime.split("/")[0],
        validMoment = moment(validPhenomenonTime);

    if (!validMoment.isValid()) {
        return false;
    }
    return validMoment.format(format);
}

export {
    getQueryLink,
    getObservations,
    convertObservationsToLinechart,
    convertObservationsToMultilinechart,
    isObservation,
    convertPhenomenonTime
};
