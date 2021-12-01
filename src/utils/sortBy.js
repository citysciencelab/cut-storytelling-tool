/**
     * This sort function sorts arrays, objects and strings. This is a replacement for underscores sortBy
     * @param {(Array|Object|String)} [list=undefined] the array, object or string to sort
     * @param {(String|Number|Function)} [iteratee=undefined] may be a function (value, key, list) returning a number to sort by or the name of the key to sort objects with
     * @param {Object} [context=undefined] the context to be used for iteratee, if iteratee is a function
     * @returns {Array}  a new list as array
     */
export default function sortBy (list, iteratee, context) {
    let sortArray = list,
        mapToSort = [];

    if (sortArray === null || typeof sortArray !== "object" && typeof sortArray !== "string") {
        return [];
    }

    if (typeof sortArray === "string") {
        sortArray = sortArray.split("");
    }

    if (typeof iteratee !== "function") {
        if (!Array.isArray(sortArray)) {
            sortArray = Object.values(sortArray);
        }

        // it is important to work with concat() on a copy of sortArray
        return sortArray.concat().sort((a, b) => {
            if (a === undefined) {
                return 1;
            }
            else if (b === undefined) {
                return -1;
            }
            else if (iteratee !== undefined) {
                if (typeof a !== "object" || !Object.prototype.hasOwnProperty.call(a, iteratee)) {
                    return 1;
                }
                else if (typeof b !== "object" || !Object.prototype.hasOwnProperty.call(b, iteratee)) {
                    return -1;
                }
                else if (a[iteratee] > b[iteratee]) {
                    return 1;
                }
                else if (a[iteratee] < b[iteratee]) {
                    return -1;
                }

                return 0;
            }
            else if (a > b) {
                return 1;
            }
            else if (a < b) {
                return -1;
            }

            return 0;
        });
    }

    if (!Array.isArray(sortArray)) {
        let key;

        for (key in sortArray) {
            mapToSort.push({
                idx: iteratee.call(context, sortArray[key], key, list),
                obj: sortArray[key]
            });
        }
    }
    else {
        mapToSort = sortArray.map((value, key) => {
            return {
                idx: iteratee.call(context, value, key, list),
                obj: value
            };
        }, context);
    }

    mapToSort.sort((a, b) => {
        if (a.idx > b.idx) {
            return 1;
        }
        else if (a.idx < b.idx) {
            return -1;
        }

        return 0;
    });

    return mapToSort.map((value) => {
        return value.obj;
    });
}
