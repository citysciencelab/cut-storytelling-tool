import isObject from "../../../utils/isObject";

/**
 * Resets the content to the given defaultConfig and config.
 * @param {Object} defaultContents the default to use for the content
 * @param {Object} extConfigs the configs as key object pair to manipulate the default content
 * @param {Object} quickHelpConfigJsObject the default config from config.js for quickHelp
 * @param {Function} getUniqueId a function to create a new unique id (with every call) to be used as name tag and object key
 * @returns {Object} the resulting new content config
 */
function applyQuickHelpConfigsToDefaultContents (defaultContents, extConfigs, quickHelpConfigJsObject, getUniqueId) {
    const clonedContents = cloneObject(defaultContents);

    if (clonedContents === false) {
        return {};
    }
    if (isObject(extConfigs)) {
        Object.entries(extConfigs).forEach(([key, value]) => {
            if (!Object.prototype.hasOwnProperty.call(clonedContents, key)) {
                clonedContents[key] = createContent(value, quickHelpConfigJsObject, getUniqueId);
            }
            else {
                clonedContents[key] = applyConfig(clonedContents[key], value, quickHelpConfigJsObject, getUniqueId);
            }
        });
    }
    return clonedContents;
}

/**
 * Applies the given config to the default content.
 * @param {Object} defaultContent an object with keys title and content
 * @param {Object} config an object with keys title and content, with content as object or array
 * @param {Object} quickHelpConfigJsObject the default config from config.js for quickHelp
 * @param {Function} getUniqueId a function to create a new unique id (with every call) to be used as name tag and object key
 * @returns {Object} the content with applied rules
 */
function applyConfig (defaultContent, config, quickHelpConfigJsObject, getUniqueId) {
    const result = {
        title: "",
        content: Object.assign({}, defaultContent?.content)
    };

    if (config?.title) {
        result.title = config.title;
    }
    else if (defaultContent?.title) {
        result.title = defaultContent.title;
    }

    if (isObject(config?.content)) {
        result.content = config.content;
    }
    else if (Array.isArray(config?.content)) {
        result.content = getContentByConfigRules(result.content, config.content, quickHelpConfigJsObject, getUniqueId);
    }

    Object.entries(result.content).forEach(([key, section]) => {
        result.content[key] = getNormalizeSection(section, quickHelpConfigJsObject);
    });
    return result;
}

/**
 * Creates a new content entry to be added to the content list of QuickHelp.vue
 * @param {Object} config an object with keys title and content from the config.json to be used as blueprint for the new content
 * @param {Object} quickHelpConfigJsObject the default config from config.js for quickHelp
 * @param {Function} getUniqueId a function to create a new unique id (with every call) to be used as name tag and object key
 * @returns {Object} an object with keys title and content to be applyable by QuickHelp.vue
 */
function createContent (config, quickHelpConfigJsObject, getUniqueId) {
    if (!isObject(config)) {
        return {};
    }
    const result = {
        title: config?.title ? config.title : "",
        content: {}
    };

    if (Array.isArray(config.content)) {
        result.content = addKeysToContent(config.content, getUniqueId);
    }
    else if (!isObject(config.content)) {
        return result;
    }
    else {
        result.content = config.content;
    }

    Object.entries(result.content).forEach(([key, section]) => {
        result.content[key] = getNormalizeSection(section, quickHelpConfigJsObject);
    });

    return result;
}

/**
 * Analyses the given config and applies its commands to the given content.
 * @param {Object} content the content to apply the given config to
 * @param {Object[]} config an array of rules as object
 * @param {Object} quickHelpConfigJsObject the default config from config.js for quickHelp
 * @param {Function} getUniqueId a function to create a new unique id (with every call) to be used as name tag and object key
 * @returns {Object} the resulting content as object
 */
function getContentByConfigRules (content, config, quickHelpConfigJsObject, getUniqueId) {
    if (!isObject(content) || typeof getUniqueId !== "function") {
        return {};
    }
    else if (!Array.isArray(config)) {
        return content;
    }
    let sortedKeys = Object.keys(content),
        key = "";
    const unsortedContent = cloneObject(content),
        result = {};

    config.forEach(rule => {
        if (isObject(rule)) {
            if (typeof rule.hide === "string") {
                delete unsortedContent[rule.hide];
                sortedKeys = sortedKeys.filter(sortedKey => sortedKey !== rule.hide);
            }
            else if (typeof rule.before === "string") {
                key = getUniqueId();
                sortedKeys.splice(sortedKeys.indexOf(rule.before), 0, key);
                unsortedContent[key] = rule;
            }
            else if (typeof rule.after === "string") {
                key = getUniqueId();
                sortedKeys.splice(sortedKeys.indexOf(rule.after) + 1, 0, key);
                unsortedContent[key] = rule;
            }
            else {
                key = getUniqueId();
                sortedKeys.push(key);
                unsortedContent[key] = rule;
            }
        }
    });

    sortedKeys.forEach(sortedKey => {
        result[sortedKey] = getNormalizeSection(unsortedContent[sortedKey], quickHelpConfigJsObject);
    });
    return result;
}

/**
 * Alters the given section to be normalized for the quick help.
 * @param {Object} section an object with keys title and list to be normalized
 * @param {Object} quickHelpConfigJsObject the default config from config.js for quickHelp
 * @returns {Object} the resulting section with normalized entries for title and list
 */
function getNormalizeSection (section, quickHelpConfigJsObject) {
    const result = {
        title: section?.title ? section.title : "",
        list: []
    };

    result.list = getNormalizedSectionList(section?.list, quickHelpConfigJsObject);
    return result;
}

/**
 * Alters the given section list using normalizations.
 * @param {String[]|Object[]} list the list to walk through
 * @param {Object} quickHelpConfigJsObject the default config from config.js for quickHelp
 * @returns {Object} the resulting list with normalized entries
 */
function getNormalizedSectionList (list, quickHelpConfigJsObject) {
    if (!Array.isArray(list)) {
        return [];
    }
    const result = [];

    list.forEach(entry => {
        if (typeof entry === "string") {
            result.push(getNormalizedStringEntry(entry, quickHelpConfigJsObject));
        }
        else if (isObject(entry)) {
            result.push(getNormalizedObjectEntry(entry, quickHelpConfigJsObject));
        }
    });
    return result;
}

/**
 * Alters the given object to be a noralized object for quick help.
 * @param {Object} entry the object to analyse
 * @param {Object} quickHelpConfigJsObject the default config from config.js for quickHelp
 * @returns {Object} the normalized object
 */
function getNormalizedObjectEntry (entry, quickHelpConfigJsObject) {
    if (quickHelpConfigJsObject && entry?.imgName) {
        return {
            imgName: quickHelpConfigJsObject[entry.imgKey] ? quickHelpConfigJsObject[entry.imgKey] : entry.imgName,
            imgPath: entry.imgPath ? entry.imgPath : quickHelpConfigJsObject.imgPath
        };
    }
    return Object.assign({
        text: "",
        type: "text/plain"
    }, entry);
}

/**
 * Alters the given string to be a normalized object for quick help.
 * @param {String} entry the string to analyse
 * @param {Object} quickHelpConfigJsObject the default config from config.js for quickHelp
 * @returns {Object} the normalized object
 */
function getNormalizedStringEntry (entry, quickHelpConfigJsObject) {
    if (entry.includes(":")) {
        return {
            text: entry,
            type: "text/plain"
        };
    }
    return {
        imgName: entry,
        imgPath: quickHelpConfigJsObject.imgPath
    };
}

/**
 * Should build an object of the given list with keys requested by getUniqueId.
 * @param {Object[]} list an array of objects
 * @param {Function} getUniqueId a function to receive a new unique id with
 * @returns {Object} a key value object with keys from getUniqueId and values from the given list
 */
function addKeysToContent (list, getUniqueId) {
    if (!Array.isArray(list) || typeof getUniqueId !== "function") {
        return {};
    }
    const result = {};

    list.forEach(entry => {
        const key = getUniqueId();

        result[key] = entry;
    });
    return result;
}

/**
 * Clones the given object and returns the clone or false on error.
 * @param {Object} obj the object to be cloned
 * @returns {Object|Boolean} the cloned object or false if anything went wrong
 */
function cloneObject (obj) {
    if (!isObject(obj)) {
        return false;
    }

    try {
        return JSON.parse(JSON.stringify(obj));
    }
    catch (e) {
        return false;
    }
}

export {
    cloneObject,
    addKeysToContent,
    getNormalizedStringEntry,
    getNormalizedObjectEntry,
    getNormalizedSectionList,
    getNormalizeSection,
    getContentByConfigRules,
    createContent,
    applyConfig,
    applyQuickHelpConfigsToDefaultContents
};
