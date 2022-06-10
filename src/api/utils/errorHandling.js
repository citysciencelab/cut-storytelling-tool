/**
 * Handles an axios error.
 * @param {Object} error - The axios error object.
 * @param {String} functionName - Name of the function where the error happens.
 * @returns {void}
 * @see {@link https://github.com/axios/axios#handling-errors}
 */
function errorHandling (error, functionName) {
    let errorMessage = "";

    if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
        errorMessage = "The request was made and the server responded with a status code that falls out of the range of 2xx.";
    }
    else if (error.request) {
        // `error.request` is an instance of XMLHttpRequest
        console.error(error.request);
        errorMessage = "The request was made but no response was received.";
    }
    else {
        console.error("Error", error.message);
        errorMessage = "Something happened in setting up the request that triggered an Error.";
    }
    console.error(`${functionName}: ${errorMessage}`);
    console.warn(error.config);
}

module.exports = {
    errorHandling
};
