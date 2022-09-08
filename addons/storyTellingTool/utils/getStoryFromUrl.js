import axios from "axios";

/**
 * Returns the reference to a story step
 *
 * @param {String} url the path of the story JSON
 * @returns {String} the loaded story file
 */
export default function fetchDataFromUrl (url) {
    return axios
        .get(url)
        .then(response => response.data)
        .then(content => content);
}
