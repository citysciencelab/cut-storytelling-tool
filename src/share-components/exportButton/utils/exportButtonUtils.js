
/**
 * returns a Blob object for the given csv conform text
 * @param {String} csvText the text to return as text/csv blob
 * @returns {Blob} the representation of the csv text as text/csv blob
 */
function createCsvBlob (csvText) {
    return new Blob([
        "\ufeff", csvText
    ], {
        type: "text/csv;charset=utf-8,%EF%BB%BF"
    });
}

/**
 * uses navigator to download the given blob object (for IE 10+)
 * @param {Blob} blob the blob to download
 * @param {String} filename the filename to use
 * @returns {Boolean} true if it worked out, false if navigator does not support msSaveBlob
 */
function downloadBlobPerNavigator (blob, filename) {
    if (typeof navigator.msSaveBlob === "function") {
        navigator.msSaveBlob(blob, filename);
        return true;
    }
    return false;
}

/**
 * uses HTML5 download link tag for download of the given blob
 * @param {Blob} blob the blob to download
 * @param {String} filename the filename to use
 * @param {Function} [onerror=false] the error handler to get the error message with
 * @returns {Boolean} true if it worked out, false something went wrong (see onerror for details)
 */
function downloadBlobPerHTML5 (blob, filename, onerror = false) {
    const link = document.createElement("a");
    let url = "";

    if (typeof link?.download === "undefined" || typeof URL?.createObjectURL !== "function") {
        if (typeof onerror === "function") {
            onerror("ExportButtonCSV: this browser does not support HTML5 download attribute");
        }
        return false;
    }
    url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);

    return true;
}

export {
    createCsvBlob,
    downloadBlobPerNavigator,
    downloadBlobPerHTML5
};
