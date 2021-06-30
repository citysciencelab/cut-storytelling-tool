/**
 * Returns the data from the axios response.
 *
 * @throws Will throw an error if the response is not valid.
 * @param {Object} response The response received by axios.
 * @param {String} callContext Name of the outer function and Component (if given) which used axios.
 * @returns {Object} The received data or undefined if an error occurred.
 */
export default function handleAxiosResponse (response, callContext) {
    if (
        response === null
        || typeof response !== "object"
        || !Object.prototype.hasOwnProperty.call(response, "status")
        || !Object.prototype.hasOwnProperty.call(response, "statusText")
        || !Object.prototype.hasOwnProperty.call(response, "data")
    ) {
        console.warn(`${callContext}, handleAxiosResponse: response`, response);
        throw Error(`${callContext}, handleAxiosResponse: The received response is not valid.`);
    }
    else if (response.status !== 200) {
        console.warn(`${callContext}, handleAxiosResponse: response`, response);
        throw Error(`${callContext}, handleAxiosResponse: The received status code indicates an error.`);
    }

    return response.data;
}
