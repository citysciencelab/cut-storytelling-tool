/**
 * convertHttToSSL
 *
 * Using HTTP is not safe and HTTPS (SSL) is the standard.
 * Therefore we need a script wich parse the http link to an ssl link.
 *
 * example: convertHttpLinkToSSL("http://daten.hamburg.de") => "https://daten.hamburg.de"
 */
/**
* adds https to the given link if not set already
* @param {String} link the link to change
* @returns {String} the changed link
*/
export default function convertHttpLinkToSSL (link) {
    if (typeof link !== "string") {
        return "";
    }
    else if (link.substr(0, 5) === "http:") {
        return "https:" + link.substr(5);
    }
    return link;
}
