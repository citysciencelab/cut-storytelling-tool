let likeFilterProperties = {
    wildCard: "*",
    singleChar: "#",
    escape: "!"
};

/**
 * Sets the likeFilterProperties to the given value
 *
 * @param {Object} properties The properties for the like filter in the way the service needs them.
 * @returns{void}
 */
export function setLikeFilterProperties (properties) {
    likeFilterProperties = properties;
}

/**
 * Builds a XML filter based upon the literal structure defined in the config
 * and the given user inputs.
 *
 * @param {Object} values The literals containing the values to be parsed.
 * @returns {XML[]} A filter to constrain returned features from the service.
 */
function buildFilter (values) {
    const filters = [];

    values.forEach(val => {
        if (val.clause) {
            const literals = buildFilter(val.clause.literals);

            if (literals?.length > 0) {
                if (literals.length === 1) {
                    filters.push(...literals);
                }
                else {
                    const currentFilter = literals.join("");

                    filters.push(val.clause.type === "and" ? `<And>${currentFilter}</And>` : `<Or>${currentFilter}</Or>`);
                }
            }
        }
        else if (val?.field?.value) {
            filters.push(buildXmlFilter(val.field));
        }
    });

    return filters;
}

/**
 * Builds the XML filter for the given fieldName and value.
 *
 * @param {String} fieldName The name of the property.
 * @param {String} type Either 'equal' or 'like; determines the type of equality check.
 * @param {String} value The value to be queried.
 * @returns {String} XML Filter.
 */
function buildXmlFilter ({fieldName, type, value}) {
    const likeFilter = type === "like",
        property = `<PropertyName>${fieldName}</PropertyName><Literal>${value}${likeFilter ? likeFilterProperties.wildCard : ""}</Literal>`;
    let likeFilterValues = "";

    Object.entries(likeFilterProperties).forEach(([key, val]) => {
        likeFilterValues += `${key}="${encodeURIComponent(val)}" `;
    });

    return likeFilter
        ? `<PropertyIsLike ${likeFilterValues.slice(0, -1)}>${property}</PropertyIsLike>`
        : `<PropertyIsEqualTo>${property}</PropertyIsEqualTo>`;
}

/**
 * Builds a filter based upon the literal structure defined in the config
 * and the given user inputs.
 *
 * @param {Object} values The literals containing the values to be parsed.
 * @returns {String} A filter to constrain returned features from the service.
 */
function buildStoredFilter (values) {
    let filter = "";

    values.forEach(val => {
        if (val.clause) {
            filter += buildStoredFilter(val.clause.literals);
        }
        else if (val.field) {
            const {fieldName, value} = val.field;

            if (value) {
                filter += `&${fieldName}=${value}`;
            }
        }
    });

    return filter;
}

export {buildFilter, buildStoredFilter, buildXmlFilter};
