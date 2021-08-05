import "../model";
import {transformToMapProjection} from "masterportalAPI/src/crs";

const KomootModel = Backbone.Model.extend(/** @lends KomootModel.prototype */{
    defaults: {
        minChars: 3,
        komootServiceUrl: "",
        limit: 10,
        lang: "de",
        osm_tag: undefined,
        bbox: undefined,
        lon: undefined,
        lat: undefined,
        searchOnEnter: false,
        searchParams: [],
        classes: [],
        ajaxRequest: null,
        serviceId: 11
    },

    /**
     * @class KomootModel
     * @description Initialization of the Komoot Photon search
     * @extends Backbone.Model
     * @memberOf Searchbar.Komoot
     * @constructs
     * @property {number} minChars=3 - todo
     * @property {string} komootServiceUrl="" - todo
     * @property {number} limit=50 - todo
     * @property {string} street="" - todo
     * @property {string} states="" - todo
     * @property {Array} searchParams=[] - todo
     * @property {Array} classes=[] - todo
     * @property {*} ajaxRequest=null - todo
     * @listens Searchbar#RadioTriggerSearchbarSearchAll
     * @fires RestReader#RadioRequestRestReaderGetServiceById
     * @fires Core#RadioRequestParametricURLGetInitString
     * @fires Searchbar#RadioTriggerSearchbarRemoveHits
     * @fires Searchbar#RadioTriggerSearchbarAbortSearch
     * @fires Searchbar#RadioTriggerSearchbarPushHits
     * @fires Searchbar#RadioTriggerSearchbarCreateRecommendedList
     * @returns {void}
     */
    initialize: function () {
        const service = Radio.request("RestReader", "getServiceById", this.get("serviceId"));

        if (service !== undefined && service.get("url") !== undefined) {
            this.setKomootServiceUrl(service.get("url"));
        }

        if (Radio.request("ParametricURL", "getInitString") !== undefined) {
            this.search(Radio.request("ParametricURL", "getInitString"));
        }
        if (this.get("searchOnEnter")) {
            this.listenTo(Radio.channel("Searchbar"), {
                "searchAll": this.search
            });
        }
        else {
            this.listenTo(Radio.channel("Searchbar"), {
                "search": this.search,
                "searchAll": this.search
            });
        }
    },

    /**
     * Access for the search...
     * Is triggered by the search bar.
     * @param {string} searchString - todo
     * @fires Searchbar#RadioTriggerSearchbarRemoveHits
     * @fires Searchbar#RadioTriggerSearchbarAbortSearch
     * @returns {void}
     */
    search: function (searchString) {
        if (searchString.length >= this.get("minChars")) {
            Radio.trigger("Searchbar", "removeHits", "hitList", {type: "Komoot"});
            this.suggestByKomoot(searchString);
        }
        else {
            Radio.trigger("Searchbar", "abortSearch", "komoot");
        }
    },

    /**
     * Search string (street HsNr) constructed by user...
     * @param {string} searchString - todo
     * @returns {void}
     */
    suggestByKomoot: function (searchString) {
        const searchStrings = [],
            tmp = searchString.split(",");
        let request;

        tmp.forEach(elem => {
            if (elem.indexOf(" ") > -1) {
                elem.split(" ").forEach(elem2 => {
                    if (elem2.trim().length > 0) {
                        searchStrings.push(elem2);
                    }
                });
            }
            else {
                searchStrings.push(elem);
            }
        });

        this.setSearchParams(searchStrings);

        request = "lang=" + this.get("lang");
        request = request + "&lon=" + this.get("lon") + "&lat=" + this.get("lat");
        if (this.get("bbox") !== undefined) {
            request += "&bbox=" + this.get("bbox");
        }
        if (this.get("osm_tag") !== undefined) {
            request += "&osm_tag=" + this.get("osm_tag");
        }
        request = request + "&q=" + encodeURIComponent(searchString);

        this.sendRequest(this.get("komootServiceUrl"), request, this.pushSuggestions);
    },

    /**
     * Evaluate hits of the first search; create offer list.
     * @param  {Array} data - todo
     * @fires Searchbar#RadioTriggerSearchbarPushHits
     * @fires Searchbar#RadioTriggerSearchbarCreateRecommendedList
     * @returns {void}
     */
    pushSuggestions: function (data) {
        let display,
            city_display,
            metaName,
            center,
            weg,
            county;

        data.features.forEach(hit => {
            display = hit.properties.name;

            weg = hit.properties.street;
            if (weg !== undefined) {
                display = display + ", " + weg;
                if (hit.properties.housenumber !== undefined) {
                    display = display + " " + hit.properties.housenumber;
                }
            }

            county = hit.properties.county;
            city_display = hit.properties.city;
            if (county !== undefined && city_display === undefined) {
                city_display = county;
            }
            else if (hit.properties.postcode !== undefined) {
                city_display = hit.properties.postcode + " " + city_display;
            }
            if (hit.properties.district !== undefined) {
                city_display += " - " + hit.properties.district;
            }
            if (city_display !== undefined) {
                display += ", " + city_display;
            }

            // Tooltip
            metaName = display;
            if (hit.properties.state !== undefined || hit.properties.country !== undefined) {
                metaName = metaName + ", " + hit.properties.state + " " + hit.properties.country;
                if (hit.properties.suburb !== undefined) {
                    metaName = metaName + " (" + hit.properties.suburb + ")";
                }
            }

            const coordinates = hit.geometry.coordinates;

            center = transformToMapProjection(Radio.request("Map", "getMap"), "WGS84", [parseFloat(coordinates[0]), parseFloat(coordinates[1])]);

            Radio.trigger("Searchbar", "pushHits", "hitList", {
                name: display,
                metaName: metaName,
                type: "Komoot",
                komoot: true,
                glyphicon: "glyphicon-road",
                id: Radio.request("Util", "uniqueId", "komootSuggest"),
                marker: hit.class === "building",
                coordinate: center
            });
        });
        Radio.trigger("Searchbar", "createRecommendedList", "komoot");
    },

    /**
     * Abortet ggf. vorhandenen Request und initiiert neuen Request.
     * @param {String} url - URL the request is sent to.
     * @param {String} data - Data to be sent to the server
     * @param {function} successFunction - A function to be called if the request succeeds
     * @returns {void}
     */
    sendRequest: function (url, data, successFunction) {
        const ajax = this.get("ajaxRequest");

        if (ajax !== null) {
            ajax.abort();
            this.polishAjax();
        }
        this.ajaxSend(url, data, successFunction);
    },

    /**
     * Fires an HTTP GET request and saves its id.
     * @param  {String} url - todo
     * @param  {JSON} data - todo
     * @param  {function} successFunction - todo
     * @return {void}
     */
    ajaxSend: function (url, data, successFunction) {
        this.setAjaxRequest($.ajax({
            url: url,
            data: data,
            dataType: "json",
            context: this,
            type: "GET",
            success: successFunction,
            timeout: 6000,
            error: function (err) {
                if (err.status !== 0) { // Bei abort keine Fehlermeldung
                    this.showError(err);
                }
                Radio.trigger("Searchbar", "abortSearch", "komoot");
            },
            complete: function () {
                this.polishAjax();
            }
        }));
    },

    /**
     * Triggers the display of an error message.
     * @param {object} err - Error object from Ajax request.
     * @returns {void}
     */
    showError: function (err) {
        const detail = err.statusText && err.statusText !== "" ? err.statusText : "";

        Radio.trigger("Alert", "alert", i18next.t("common:modules.searchbar.komoot.errorMsg") + " " + detail);
    },

    /**
     * todo
     * @returns {void}
     */
    polishAjax: function () {
        this.setAjaxRequest(null);
    },

    /**
     * Setter for inUse.
     * @param {*} value - todo
     * @returns {void}
     */
    setInUse: function (value) {
        this.set("inUse", value);
    },

    /**
     * Setter for komootServiceUrl.
     * @param {*} value - todo
     * @returns {void}
     */
    setKomootServiceUrl: function (value) {
        this.set("komootServiceUrl", value);
    },

    /**
     * Setter for searchParams.
     * @param {*} value - todo
     * @returns {void}
     */
    setSearchParams: function (value) {
        this.set("searchParams", value);
    },

    /**
     * Setter for ajaxRequest.
     * @param {*} value - todo
     * @returns {void}
     */
    setAjaxRequest: function (value) {
        this.set("ajaxRequest", value);
    }
});

export default KomootModel;
