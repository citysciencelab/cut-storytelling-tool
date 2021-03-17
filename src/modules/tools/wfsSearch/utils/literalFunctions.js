/**
 * Recursively adds unique ids to the clauses and fields to be able to properly update the values set for a field.
 *
 * @param {Object[]} stateLiterals The literals set in the state.
 * @param {?(Object[])} literals As the structure is recursively traversed, this value is an inner array of the stateLiterals.
 * @param {String} clauseId The id of an outer clause.
 * @returns {void}
 */
function addIdsToLiterals (stateLiterals, literals = null, clauseId = "") {
    const arr = literals === null ? stateLiterals : literals,
        idPrefix = clauseId ? clauseId + "+" : "";

    arr.forEach((literal, i) => {
        if (literal.clause) {
            const id = `${idPrefix}clause-${i}`;

            literal.clause.id = id;
            addIdsToLiterals(stateLiterals, literal.clause.literals, id);
        }
        else {
            literal.field.id = `${idPrefix}field-${i}`;
            literal.field.value = null;
        }
    });
}

/**
 * Recursively updated the values of a field.
 *
 * @param {String} id Unique Id of the field.
 * @param {String} value New value to be set on the field.
 * @param {Object[]} stateLiterals The literals set in the state.
 * @param {?(Object[])} literals As the structure is recursively traversed, this value is an inner array of the stateLiterals.
 * @returns {void}
 */
function fieldValueChanged (id, value, stateLiterals, literals = null) {
    const arr = literals ? literals : stateLiterals;

    arr.forEach(literal => {
        if (literal.clause) {
            fieldValueChanged(id, value, stateLiterals, literal.clause.literals);
        }
        else if (literal.field.id === id) {
            literal.field.value = value;
        }
    });
}

export {addIdsToLiterals, fieldValueChanged};
