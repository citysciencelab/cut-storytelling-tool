/**
 * implementation of json to csv based on rfc4180
 * @see https://datatracker.ietf.org/doc/html/rfc4180
 * @param {Array[]|Object[]} jsonData an array of String[] (first set could be the header) or an array of Object[] (keys of record with the most fields will be set as header, make sure that all sets have the same order of keys)
 * @param {Function|Boolean} [onerror=false] the error handler to receive errors with as function(error)
 * @param {Boolean} [useSemicolon=false] rfc4180 describes the use of "," - set this to true to use ";" as delimitor instead
 * @param {Boolean} [useLineFeedOnly=false] rfc4180 describes the use of "CRLF" - set this to true to use only "LF" as line ending instead
 * @returns {String|Boolean} the resulting csv data as plain text (string) or false if an error occured
 */
function convertJsonToCsv (jsonData, onerror = false, useSemicolon = false, useLineFeedOnly = false) {
    if (!Array.isArray(jsonData)) {
        if (typeof onerror === "function") {
            onerror("convertJsonToCsv: the given jsonData shall be an array");
        }
        return false;
    }
    const delimitor = useSemicolon ? ";" : ",",
        eol = useLineFeedOnly ? "\n" : "\r\n",
        headerRecord = findRecordWithMaxNumberOfFields(jsonData),
        maxNumberOfFields = headerRecord ? Object.keys(headerRecord).length : 0,
        header = !Array.isArray(headerRecord) && typeof headerRecord === "object" && headerRecord !== null ? Object.keys(headerRecord) : false;
    let result = header ? joinRecord(escapeFields(header, delimitor), delimitor, maxNumberOfFields) : "";

    jsonData.forEach(fields => {
        if (typeof fields !== "object" || fields === null) {
            if (typeof onerror === "function") {
                onerror("convertJsonToCsv: a line with an unknown type was found: " + typeof fields);
            }
            return;
        }
        if (result) {
            result += eol;
        }
        result += joinRecord(escapeFields(Object.values(fields), delimitor), delimitor, maxNumberOfFields);
    });

    return result;
}

/**
 * escapes the values of the given array according to rfc4180
 * rule: escaped = DQUOTE *(TEXTDATA / COMMA / CR / LF / 2DQUOTE) DQUOTE
 * @param {String[]|Number[]} fields an array of values representing one csv line
 * @param {String} delimitor the delimitor to escape as COMMA
 * @returns {String[]} an array of strings without dquotes or with dquotes if something to escape was found in the string
 */
function escapeFields (fields, delimitor) {
    if (typeof fields !== "object" || fields === null) {
        return [];
    }
    const result = [];

    fields.forEach(field => {
        result.push(escapeField(field, delimitor));
    });

    return result;
}

/**
 * escapes the given value according to rfc4180
 * rule: escaped = DQUOTE *(TEXTDATA / COMMA / CR / LF / 2DQUOTE) DQUOTE
 * @param {*} field a value representing a field
 * @param {String} delimitor the delimitor to escape as COMMA
 * @returns {String} the string, may be escaped
 */
function escapeField (field, delimitor) {
    let escaped = false,
        txt = "",
        letter = "";
    const fieldText = String(field),
        len = fieldText.length;

    for (let i = 0; i < len; i++) {
        letter = fieldText[i];

        if (letter === delimitor || letter === "\r" || letter === "\n") {
            escaped = true;
        }
        else if (letter === "\"") {
            escaped = true;
            txt += "\"";
        }

        txt += letter;
    }

    if (escaped) {
        return "\"" + txt + "\"";
    }
    return txt;
}

/**
 * analyses jsonData and returns the record with the most number of fields found
 * @param {Array[]|Object[]} jsonData an array of String[] (first set could be the header) or an array of Object[] (keys of first set is used as header, make sure that all sets have the same keys)
 * @returns {Object|String[]} the record with the most number of fields found in the records
 */
function findRecordWithMaxNumberOfFields (jsonData) {
    if (!Array.isArray(jsonData)) {
        return null;
    }
    let result = null,
        maxNumber = 0;

    jsonData.forEach(record => {
        if (typeof record !== "object" || record === null) {
            return;
        }
        if (maxNumber < Object.keys(record).length) {
            maxNumber = Object.keys(record).length;
            result = record;
        }
    });

    return result;
}

/**
 * joins the given record to a string using the given delimitor, maxes out or down to the given maxNumberOfFields
 * @param {String[]} record the array to join
 * @param {String} delimitor the delimitor to use
 * @param {Number} maxNumberOfFields the number of joined fields
 * @returns {String} the result as joined string
 */
function joinRecord (record, delimitor, maxNumberOfFields) {
    if (!Array.isArray(record)) {
        return "";
    }
    let result = "";

    for (let i = 0; i < maxNumberOfFields; i++) {
        if (result) {
            result += delimitor;
        }
        result += record[i] ? String(record[i]) : "";
    }

    return result;
}

export {
    convertJsonToCsv,
    escapeFields,
    escapeField,
    findRecordWithMaxNumberOfFields,
    joinRecord
};
