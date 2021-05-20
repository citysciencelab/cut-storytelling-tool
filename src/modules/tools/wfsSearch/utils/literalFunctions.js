/**
 * Creates a String representation for the built literals structure.
 *
 * @param {Object[]} literals The literals for which the structure is built and which are parsed.
 * @returns {String} String representation for the structure of the given literal.
 */
function createSearchInformation (literals) {
    const structure = createLiteralStructure(literals);
    let searchInformation = "",
        marker = "";

    for (const el of structure) {
        if (el === "and" || el === "or") {
            marker = el;
            continue;
        }
        if (el !== "(" && el !== ")") {
            searchInformation += el + " " + marker + " ";
            continue;
        }

        if (el === ")" && marker !== "") {
            searchInformation = searchInformation.substring(0, searchInformation.length - (marker.length + 2));
            marker = "";
        }

        searchInformation += el;
    }

    return searchInformation.replaceAll(")(", ") and (");
}

/**
 * Recursively creates a logical representation of the literals as array to be later parsed to a String.
 *
 * @param {Object[]} stateLiterals Literals from the state. This is the root element.
 * @param {?(Object[])} [literals = null] Literals from the clause of the current function call.
 * @param {String[]} [searchInformation = []] The current values collected for the representation of the literals.
 * @returns {String[]} The information of regarding the logical dependency of the elements of the current clause.
 */
function createLiteralStructure (stateLiterals, literals = null, searchInformation = []) {
    const lit = literals === null ? stateLiterals : literals;

    for (const literal of lit) {
        const {field, clause} = literal;

        if (field) {
            searchInformation.push(field.inputLabel);
            continue;
        }

        searchInformation.push(clause.type, "(");
        createLiteralStructure(stateLiterals, clause.literals, searchInformation);
        searchInformation.push(")");
    }

    return searchInformation;
}

/**
 * Recursively adds unique ids to the clauses and fields to be able to properly update the values set for a field.
 * Also prepares the list of required fields.
 *
 * @param {Object[]} stateLiterals The literals set in the state.
 * @param {?(Object[])} [literals = null] As the structure is recursively traversed, this value is an inner array of the stateLiterals.
 * @param {String} [clauseId = ""] The id of an outer clause.
 * @param {Object} [requiredValues = {}] The values required to be set by the user.
 * @returns {Object} Returns the current values for the required fields.
 */
function prepareLiterals (stateLiterals, literals = null, clauseId = "", requiredValues = {}) {
    const lit = literals === null ? stateLiterals : literals,
        idPrefix = clauseId ? clauseId + "+" : "";

    lit.forEach((literal, i) => {
        if (literal.field) {
            literal.field.id = `${idPrefix}field-${i}`;
            literal.field.value = null;

            if (literal.field.required) {
                requiredValues[literal.field.id] = null;
            }
            if (literal.clause) {
                delete literal.clause;
            }
        }
        else {
            const id = `${idPrefix}clause-${i}`;

            literal.clause.id = id;
            prepareLiterals(stateLiterals, literal.clause.literals, id, requiredValues);
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

export {createSearchInformation, prepareLiterals, fieldValueChanged};
