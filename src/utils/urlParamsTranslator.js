import convert from "./converter";

/**
 * Translates key and value to vuex state readable kind. Converts the value from string to type.
 * @param {String} urlParamsKey key of url params
 * @param {String} urlParamsValue value of url params
 * @returns {Object} containes translated key and value
 */
export function translate (urlParamsKey, urlParamsValue) {
    const checked = check(urlParamsKey, urlParamsValue),
        checkedKey = checked.key,
        checkedValue = checked.value;

    switch (checkedKey.toLowerCase()) {
        case "isinitopen":
        case "startupmodul": {
            const key = "Tools/" + checkedValue + "/active",
                value = true;

            return {key: key, value: value};
        }
        default: {
            // console.log("will convert value:", urlParamsValue);
            return {key: checkedKey, value: convert(checkedValue)};
        }
    }
}

/**
 * Checks key and value for translation, e.g. kmlimport is translated to FileImport.
 * @param {String} key key of url params
 * @param {String} value value of url params
 * @returns {Object} containes checked and modified key and value
 */
function check (key, value) {
    let checkedKey = checkForTools(key);
    const checkedValue = checkForKmlImport(value);

    checkedKey = checkForKmlImport(key);

    return {key: checkedKey, value: checkedValue};

}
/**
 * Checks string matching 'tools' and replaces it with 'Tools'.
 * @param {String} string a string
 * @returns {String} modified string
 */
function checkForTools (string) {
    if (typeof string === "string" && string.match(/tools/gi) !== null) {
        return string.replace(/tools/i, "Tools");
    }
    return string;
}
/**
 * Checks string matching 'kmlimport' and replaces it with 'FileImport'.
 * @param {String} string a string
 * @returns {String} modified string
 */
function checkForKmlImport (string) {
    if (typeof string === "string" && string.match(/kmlimport/gi) !== null) {
        return string.replace(/kmlimport/i, "FileImport");
    }
    return string;
}
