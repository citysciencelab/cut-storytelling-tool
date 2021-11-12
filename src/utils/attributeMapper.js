import {translateKeyWithPlausibilityCheck} from "./translateKeyWithPlausibilityCheck.js";
import {getValueFromObjectByPath} from "./getValueFromObjectByPath.js";
import moment from "moment";
import thousandsSeparator from "./thousandsSeparator";
/**
 * Maps the feature properties by the given object.
 * @param {Object} properties The feature properties.
 * @param {Object} [mappingObject={}] "gfiAttributes" from the layer.
 * @returns {Object} The mapped properties.
 */
function attributeMapper (properties, mappingObject = {}) {
    const mappedProperties = {};

    Object.keys(mappingObject).forEach(key => {
        let newKey = mappingObject[key],
            value = prepareGfiValue(properties, key);

        if (typeof newKey === "object") {
            value = prepareGfiValueFromObject(key, newKey, properties);
            newKey = newKey.name;
        }
        if (value && value !== "undefined") {
            mappedProperties[newKey] = value;
        }
    });

    return mappedProperties;
}

/**
 * Returns the value of the given key. Also considers, that the key may be an object path.
 * @param {Object} gfi Gfi object.
 * @param {String} key Key to derive value from.
 * @returns {*} - Value from key.
 */
function prepareGfiValue (gfi, key) {
    const isPath = key.startsWith("@") && key.length > 1;
    let value = gfi[Object.keys(gfi).find(gfiKey => gfiKey.toLowerCase() === key.toLowerCase())];

    if (isPath) {
        value = getValueFromObjectByPath(gfi, key);
    }
    return value;
}
/**
 * Derives the gfi value if the value is an object.
 * @param {*} key Key of gfi Attribute.
 * @param {Object} obj Value of gfi attribute.
 * @param {Object} gfi Gfi object.
 * @returns {*} - Prepared Value from gfi.
 */
function prepareGfiValueFromObject (key, obj, gfi) {
    const type = obj?.type ? obj.type : "string",
        format = obj?.format ? obj.format : "DD.MM.YYYY HH:mm:ss",
        condition = obj?.condition ? obj.condition : null;
    let preparedValue = prepareGfiValue(gfi, key),
        date;

    if (condition) {
        preparedValue = getValueFromCondition(key, condition, gfi);
    }
    switch (type) {
        case "date": {
            date = moment(String(preparedValue));
            if (date.isValid()) {
                preparedValue = moment(String(preparedValue)).format(format);
            }
            break;
        }
        case "number": {
            preparedValue = thousandsSeparator(preparedValue);
            break;
        }
        case "linechart": {
            preparedValue = Object.assign({
                name: key,
                staObject: preparedValue
            }, obj);
            break;
        }
        case "boolean": {
            preparedValue = getBooleanValue(preparedValue, format, v => this.$t(v));
            break;
        }
        // default equals to obj.type === "string"
        default: {
            preparedValue = String(preparedValue);
        }
    }
    if (preparedValue && obj.suffix && preparedValue !== "undefined") {
        preparedValue = appendSuffix(preparedValue, obj.suffix);
    }
    if (preparedValue && obj.prefix && preparedValue !== "undefined") {
        preparedValue = prependPrefix(preparedValue, obj.prefix);
    }
    return preparedValue;
}

/**
 * Parsing the boolean value
 * @param {String} value default value
 * @param {String|Object} format the format of boolean value
 * @param {Function} translateFunction the function to use for translation
 * @returns {String} - original value or parsed value
 */
function getBooleanValue (value, format, translateFunction) {
    let parsedValue = String(value);

    if (typeof translateFunction !== "function") {
        return parsedValue;
    }
    if (typeof format === "object" && format !== null && Object.prototype.hasOwnProperty.call(format, value)) {
        parsedValue = translateKeyWithPlausibilityCheck(format[value], translateFunction);
    }
    else {
        parsedValue = this.$t("common:modules.tools.gfi.boolean." + value);
    }

    return !parsedValue.includes("modules.tools.gfi.boolean.") ? parsedValue : String(value);
}

/**
 * Derives the value from the given condition.
 * @param {String} key Key.
 * @param {String} condition Condition to filter gfi.
 * @param {Object} gfi Gfi object.
 * @returns {*} - Value that matches the given condition.
 */
function getValueFromCondition (key, condition, gfi) {
    let valueFromCondition,
        match;

    if (condition === "contains") {
        match = Object.keys(gfi).filter(key2 => {
            return key2.includes(key);
        })[0];
        valueFromCondition = gfi[match];
    }
    else if (condition === "startsWith") {
        match = Object.keys(gfi).filter(key2 => {
            return key2.startsWith(key);
        })[0];
        valueFromCondition = gfi[match];
    }
    else if (condition === "endsWith") {
        match = Object.keys(gfi).filter(key2 => {
            return key2.endsWith(key);
        })[0];
        valueFromCondition = gfi[match];
    }
    else {
        valueFromCondition = gfi[key];
    }

    return valueFromCondition;

}

/**
 * Appends a suffix if available.
 * @param {*} value Value to append suffix.
 * @param {String} suffix Suffix
 * @returns {String} - Value with suffix.
 */
function appendSuffix (value, suffix) {
    let valueWithSuffix = value;

    if (suffix) {
        valueWithSuffix = String(valueWithSuffix) + " " + suffix;
    }
    return valueWithSuffix;
}

/**
 * Prepend a prefix if available.
 * @param {*} value Value to prepend prefix.
 * @param {String} prefix Prefix
 * @returns {String} - Value with prefix.
 */
function prependPrefix (value, prefix) {
    let valueWithPrefix = value;

    if (prefix) {
        valueWithPrefix = prefix + String(valueWithPrefix);
    }
    return valueWithPrefix;
}

export default attributeMapper;
