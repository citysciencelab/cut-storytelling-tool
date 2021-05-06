/**
 * Builds a XML filter based upon the literal structure defined in the config
 * and the given user inputs.
 *
 * @param {Object} values The literals containing the values to be parsed.
 * @returns {XML} A filter to constrain returned features from the service.
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
        else if (val.field) {
            const {fieldName, type, value} = val.field;

            if (value) {
                const property = `<PropertyName>${fieldName}</PropertyName><Literal>${value}</Literal>`,
                    filter = type === "like"
                        ? `<PropertyIsLike>${property}</PropertyIsLike>`
                        : `<PropertyIsEqualTo>${property}</PropertyIsEqualTo>`;

                filters.push(filter);
            }
        }
    });

    return filters;
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

export {buildFilter, buildStoredFilter};
