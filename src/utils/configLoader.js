import axios from "axios";
import store from "../app-store";
/**
 * Fetches the Data from the config.json.
 * @param {String} url to load config from
 * @returns {void}
 * @throws {Error} if an error occures
 */
export default function requestConfig (url) {
    return axios.get(decodeURIComponent(url))
        .then(response => response)
        .catch(error => {
            const alertingMessage = {
                category: i18next.t("common:modules.alerting.categories.warning"),
                content: i18next.t("common:utils.parametricURL.errorLoadConfig", {url: url})
            };

            console.warn("Error occured during loading ", url, " to set config by url param.", error);
            store.dispatch("Alerting/addSingleAlert", alertingMessage, {root: true});
        });
}
