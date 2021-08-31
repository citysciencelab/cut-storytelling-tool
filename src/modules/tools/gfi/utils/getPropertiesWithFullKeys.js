/**
 * concats the keys of the given structure (in depth) to be used as gfiAttribute keys (including @-paths)
 * @param {Object} properties the properties of the feature, may be the mapped properties
 * @param {String} [prefix="@"] the prefix to use for object paths
 * @param {String} [delimitor="."] the delimitor to use for object paths
 * @param {Number} [depthBarrier=20] the depth barrier to avoid infinit recurtions
 * @returns {Object|Boolean} a flat key-value object with concatenated keys to address the attributes in config.json or false on error
 */
export default function getPropertiesWithFullKeys (properties, prefix = "@", delimitor = ".", depthBarrier = 20) {
    if (
        typeof properties !== "object" || properties === null
        || typeof depthBarrier !== "number" || depthBarrier < 0
        || typeof prefix !== "string"
        || typeof delimitor !== "string"
    ) {
        return false;
    }
    const result = {};

    for (const [key, value] of Object.entries(properties)) {
        if (typeof value === "object" && value !== null) {
            getPropertiesWithFullKeysHelper(value, result, prefix + key, 0, depthBarrier, delimitor);
        }
        else {
            result[key] = value;
        }
    }

    return result;
}

/**
 * recursive helper function for getPropertiesWithFullKeys, used for found objects in properties
 * @param {Object} obj the object to follow
 * @param {Object} result the result by ref
 * @param {String} pathPrefix the prefix of the path at the depth to build a one dimensional path structure
 * @param {String} depth the current depth of the recursion
 * @param {Number} depthBarrier the depth barrier to avoid infinit recurtions
 * @param {String} delimitor the delimitor to use for object paths
 * @returns {void}
 */
function getPropertiesWithFullKeysHelper (obj, result, pathPrefix, depth, depthBarrier, delimitor) {
    if (depth >= depthBarrier) {
        return;
    }
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null) {
            getPropertiesWithFullKeysHelper(value, result, pathPrefix + delimitor + key, depth + 1, depthBarrier, delimitor);
        }
        else {
            result[pathPrefix + delimitor + key] = value;
        }
    }
}
