/**
 * Recursively adds unique ids to the clauses and fields to be able to properly update the values set for a field.
 * Also prepares the list of required fields.
 *
 * @param {Object[]} stateLiterals The literals set in the state.
 * @param {?(Object[])} literals As the structure is recursively traversed, this value is an inner array of the stateLiterals.
 * @param {String} clauseId The id of an outer clause.
 * @returns {Object} Returns the current values for the required fields.
 */
function prepareLiterals (stateLiterals, literals = null, clauseId = "") {
    const arr = literals === null ? stateLiterals : literals,
        idPrefix = clauseId ? clauseId + "+" : "",
        requiredValues = {};

    arr.forEach((literal, i) => {
        if (literal.clause) {
            const id = `${idPrefix}clause-${i}`;

            literal.clause.id = id;
            prepareLiterals(stateLiterals, literal.clause.literals, id);
        }
        else {
            literal.field.id = `${idPrefix}field-${i}`;
            literal.field.value = null;

            if (literal.field.required) {
                requiredValues[literal.field.id] = null;
            }
        }
    });

    return requiredValues;
}

/**
 * Recursively updates the values of a field.
 *
 * @param {String} id Unique Id of the field.
 * @param {String} value New value to be set on the field.
 * @param {Object[]} stateLiterals The literals set in the state.
 * @param {Object} requiredValues The fields that are required to be set.
 * @param {?(Object[])} [literals = null] As the structure is recursively traversed, this value is an inner array of the stateLiterals.
 * @returns {Object} Returns the current values for the required fields.
 */
function fieldValueChanged (id, value, stateLiterals, requiredValues, literals = null) {
    const arr = literals ? literals : stateLiterals;

    arr.forEach(literal => {
        if (literal.clause) {
            fieldValueChanged(id, value, stateLiterals, requiredValues, literal.clause.literals);
        }
        else if (literal.field.id === id) {
            literal.field.value = value;

            if (literal.field.required) {
                requiredValues[id] = value;
            }
        }
    });

    return requiredValues;
}

export {prepareLiterals, fieldValueChanged};
