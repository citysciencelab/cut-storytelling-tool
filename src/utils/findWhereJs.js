/** Looks through the list and returns the first value that matches all of the key-value pairs listed in properties
 * listed in hitId.
 * @param {Object[]} [list=[]] - the list.
 * @param {Object} properties property/entry to search for.
 * @returns {Object} - returns the first value/entry, that matches.
 */
function findWhereJs (list = [], properties = "") {
    return list.find(
        item => Object.keys(properties).every(
            key => item[key] === properties[key]
        )
    );
}

export default findWhereJs;
