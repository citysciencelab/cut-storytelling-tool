/**
     * Returns the object path of featureProperties which is defined as path.
     * Returns null if "path" is not included in featureProperties.
     * @param   {object} featureProperties properties of the feature
     * @param   {string} path object path starting with "path://"
     * @returns {object|null} sub object of featureProperties
     */
function getFeaturePropertyByPath (featureProperties, path) {
    let featureProperty = featureProperties;
    const pathArray = path.substring(1).split(".").filter(element => element !== "");

    for (let i = 0; i < pathArray.length; i++) {
        const element = pathArray[i];

        if (!Object.prototype.hasOwnProperty.call(featureProperty, element) || typeof featureProperty[element] === "undefined" || featureProperty[element] === null) {
            return null;
        }
        featureProperty = featureProperty[element];
    }

    return featureProperty;
}

/**
 * checks if value starts with special prefix to determine if value is a object path
 * @param   {string} value string to check
 * @returns {Boolean} true is value is an object path
 */
function isObjectPath (value) {
    return typeof value === "string" && value.startsWith("@");
}

export {getFeaturePropertyByPath, isObjectPath};
