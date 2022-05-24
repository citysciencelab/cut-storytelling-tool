/**
 * Checks if the given structure is a rule.
 * @param {*} something the unknown structure to check
 * @returns {Boolean} true if this is a rule, false if not
 */
export function isRule (something) {
    return !(
        typeof something !== "object" || something === null
        || typeof something?.snippetId !== "number"
        || typeof something?.startup !== "boolean"
        || typeof something?.fixed !== "boolean"
        || typeof something?.attrName !== "string" && !Array.isArray(something.attrName)
        || typeof something?.operator !== "string"
    );
}
