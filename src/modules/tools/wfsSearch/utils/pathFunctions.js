import idx, {badPathSymbol} from "../../../../utils/idx";

/**
 * Builds the path to the given option in the external source object.
 *
 * @param {object} optionsObject The currently set values by the user.
 * @param {string} currentOption The option for which the path needs to be build.
 * @returns {array} The path to the given option as an array.
 */
function buildPath (optionsObject, currentOption) {
    const entries = Object.entries(optionsObject),
        path = [];

    for (const entry of entries) {
        const [key, {value, index}] = entry;

        // This would otherwise lead to weird path behaviour as the option of this Field has already been added to the selectedOptions
        if (key === currentOption) {
            break;
        }

        path.push(...key === "" ? [value] : [key, index]);
    }
    path.push(currentOption);

    return path;
}

/**
 * Retrieves the options from the path in the given source.
 *
 * @param {array} path The path to the values.
 * @param {object} source The source from which the values should be retrieved.
 * @returns {[]} If found, return the values as an array, otherwise return an empty array.
 */
function getOptions (path, source) {
    const selectableOptions = idx(source, path);

    if (selectableOptions && selectableOptions !== badPathSymbol && typeof selectableOptions[0] === "object") {
        return prepareOptionsWithId(selectableOptions);
    }

    // idx returns badPathSymbol if the value could not be found. It is also possible that the value is defined, but holds null or undefined.
    return selectableOptions === badPathSymbol || selectableOptions === null || selectableOptions === undefined ? [] : selectableOptions;
}

/**
 * Prepares the options to be able to be used with the components.
 * Maps id to fieldValue and adds the key to the displayName of the root element if so configured.
 *
 * @param {object} elements The options to be adjusted / prepared.
 * @param {boolean} [showKey = false] Whether the key should be part of the displayName.
 * @returns {array} The adjusted array of values.
 */
function prepareOptionsWithId (elements, showKey = false) {
    const options = [];

    Object.entries(elements).forEach(([key, {id}]) => options.push({fieldValue: id, displayName: showKey ? `${key} (${id})` : id}));

    return options;
}

/**
 * Removes the path to the element so that just the value itself is left.
 *
 * @param {string} el The element of which the path should be removed.
 * @returns {string} The adjusted element.
 */
function removePath (el) {
    let element = el;

    while (element.includes(".")) {
        element = element.slice(element.indexOf(".") + 1);
    }
    return element;
}

export {buildPath, getOptions, prepareOptionsWithId, removePath};

