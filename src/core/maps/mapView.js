import {Projection} from "ol/proj.js";
import defaults from "masterportalAPI/src/defaults";
import store from "../../app-store";
import mapCollection from "../dataStorage/mapCollection.js";
import findWhereJs from "../../utils/findWhereJs";

const MapView = {
    defaults: {
        background: "",
        units: "m",
        DOTS_PER_INCH: store.getters.dpi,
        settings: {}
    },

    /**
     * @class MapView
     * @description todo
     *
     * @returns {void}
     */
    initialize: function () {
        let params = {};

        if (this.defaults.settings !== undefined && this.defaults.settings.options !== undefined) {
            this.setOptions(this.defaults.settings.options);
        }
        else {
            this.setOptions(defaults.options);
        }

        if (document.getElementById("map") !== null) {
            this.setBackgroundImage(document.getElementById("map").style.backgroundImage);
        }

        // Listener für ol.View
        mapCollection.getMap("ol", "2D").getView().on("change:resolution", this.changedResolutionCallback.bind(this), this);
        mapCollection.getMap("ol", "2D").getView().on("change:center", function () {
            Radio.trigger("MapView", "changedCenter", this.getCenter());
            Radio.trigger("RemoteInterface", "postMessage", {"centerPosition": this.getCenter()});
        }, this);

        params = findWhereJs(this.defaults.settings.options, {resolution: mapCollection.getMap("ol", "2D").getView().getConstrainedResolution(mapCollection.getMap("ol", "2D").getView().getResolution())});

        // triggert midel.js die Funktion checkForScale modules\core\modelList\layer\model.js
        this.changedOptions(params);
        store.commit("Map/setScale", params?.scale);
        // NOTE: used for scaleSwitcher-tutorial
        store.commit("Map/setScales", {scales: this.get("options").map(function (option) {
            return option.scale;
        })});
    },

    /**
     * @description is called when the view resolution is changed triggers the map view options
     * @param {ObjectEvent} evt - openlayers event object
     * @param {string} evt.key - the name of the property whose value is changing
     * @param {ol.View} evt.target - this.get("view")
     * @fires Core#RadioTriggerMapViewChangedOptions
     * @fires Core#RadioTriggerMapViewChangedZoomLevel
     * @fires RemoteInterface#RadioTriggerRemoteInterfacePostMessage
     * @returns {void}
     */
    changedResolutionCallback: function (evt) {
        const mapView = evt.target,
            constrainResolution = mapView.getConstrainedResolution(mapView.get(evt.key)),
            params = findWhereJs(this.defaults.settings.options, {resolution: constrainResolution});

        Radio.trigger("MapView", "changedOptions", params);
        store.commit("Map/setScale", params?.scale);
        // nicht implementiert?
        Radio.trigger("MapView", "changedZoomLevel", this.getZoom());
        Radio.trigger("RemoteInterface", "postMessage", {"zoomLevel": this.getZoom()});
    },

    /**
     * @description finds the right resolution for the scale and sets it for this view
     * @param {number} scale - map view scale
     * @returns {void}
     */
    setResolutionByScale: function (scale) {
        const params = findWhereJs(this.get("options"), {scale: scale});

        if (mapCollection.getMap("ol", "2D").getView() !== undefined) {
            mapCollection.getMap("ol", "2D").getView().setResolution(params.resolution);
        }
    },

    /**
     * @description todo
     * @param {number} resolution -
     * @returns {void}
     */
    setConstrainedResolution: function (resolution) {
        mapCollection.getMap("ol", "2D").getView().setResolution(resolution);
    },

    /**
     * Sets center and resolution to initial values
     * @fires Core#RadioRequestParametricURLGetCenter
     * @returns {void}
     */
    resetView: function () {
        const paramUrlCenter = store.state.urlParams["Map/center"] ? store.state.urlParams["Map/center"] : null,
            settingsCenter = this.defaults.settings !== undefined && this.defaults.settings?.startCenter ? this.defaults.settings.startCenter : undefined,
            defaultCenter = defaults.startCenter,
            center = paramUrlCenter || settingsCenter || defaultCenter,
            settingsResolution = this.defaults.settings !== undefined && this.defaults.settings?.resolution ? this.defaults.settings.resolution : undefined,
            defaultResolution = defaults.startResolution,
            resolution = settingsResolution || defaultResolution;

        mapCollection.getMap("ol", "2D").getView().setCenter(center);
        mapCollection.getMap("ol", "2D").getView().setResolution(resolution);
        store.dispatch("MapMarker/removePointMarker");
    },

    /**
     * Sets the Background for the Mapview.
     * @param  {string} value Image Url
     * @returns {void}
     */
    setBackground: function (value) {
        this.defaults.background = value;
    },

    /**
     * Sets the Backgroundimage for the Mapview.
     * @param  {string} value BG Image Url
     * @returns {void}
     */
    setBackgroundImage: function (value) {
        this.defaults.settings.backgroundImage = value;
    },


    /**
     * @description todo
     * @param  {number} value Zoom Level
     * @returns {void}
     */
    setStartZoomLevel: function (value) {
        if (value !== undefined) {
            mapCollection.getMap("ol", "2D").getView().setResolution(mapCollection.getMap("ol", "2D").getView().getResolutions()[value]);
        }
    },

    /**
     * @description todo
     * @returns {void}
     */
    toggleBackground: function () {
        if (this.defaults.background === "white") {
            this.setBackground(this.defaults.settings.backgroundImage);
            $("#map").css("background", this.defaults.settings.backgroundImage + "repeat scroll 0 0 rgba(0, 0, 0, 0)");
        }
        else {
            this.setBackground("white");
            $("#map").css("background", "white");
        }
    },

    /**
     * Sets the view.
     * @param {object} view todo
     * @return {void}
     */
    // wird es genutzt?
    setView: function (view) {
        this.set("view", view);
    },

    /**
     * @description todo
     * @param  {array} coords Coordinates
     * @param  {number} zoomLevel Zoom Level
     * @return {void}
     */
    setCenter: function (coords, zoomLevel) {
        let first2Coords = [coords[0], coords[1]];

        // Coordinates need to be integers, otherwise open layers will go nuts when you attempt to pan the
        // map. Please fix this at the origin of those stringified numbers. However, this is to adress
        // possible future issues:
        if (typeof first2Coords[0] !== "number" || typeof first2Coords[1] !== "number") {
            console.warn("Given coordinates must be of type integer! Although it might not break, something went wrong and needs to be checked!");
            first2Coords = first2Coords.map(singleCoord => parseInt(singleCoord, 10));
        }

        mapCollection.getMap("ol", "2D").getView().setCenter(first2Coords);

        if (zoomLevel !== undefined) {
            mapCollection.getMap("ol", "2D").getView().setZoom(zoomLevel);
        }
    },

    /**
     * Increases the zoomlevel by one.
     * @return {void}
     */
    setZoomLevelUp: function () {
        mapCollection.getMap("ol", "2D").getView().setZoom(this.getZoom() + 1);
    },

    /**
     * Reduces the zoomlevel by one.
     * @return {void}
     */
    setZoomLevelDown: function () {
        mapCollection.getMap("ol", "2D").getView().setZoom(this.getZoom() - 1);
    },

    /**
     * Returns the corresponding resolution for the scale.
     * @param  {String|number} scale - todo
     * @param  {String} scaleType - min or max
     * @return {number} resolution
     */
    getResoByScale: function (scale, scaleType) {
        const scales = this.defaults.settings.options.map(function (option) {
            return option.scale;
        });

        let index = "",
            unionScales = scales.concat([parseInt(scale, 10)].filter(item => scales.indexOf(item) < 0));

        unionScales = unionScales.sort(function (a, b) {
            return b - a;
        });

        index = unionScales.indexOf(parseInt(scale, 10));
        if (unionScales.length === scales.length || scaleType === "max") {
            return mapCollection.getMap("ol", "2D").getView().getResolutions()[index];
        }
        else if (scaleType === "min") {
            return mapCollection.getMap("ol", "2D").getView().getResolutions()[index - 1];
        }
        return null;
    },

    /**
     * @description gets the center from the mapView
     * @return {array} Center Coords
     */
    getCenter: function () {
        return mapCollection.getMap("ol", "2D").getView().getCenter();
    },

    /**
     * @description todo
     * @param {float} scale todo
     * @return {float} Resolution
     */
    getResolution: function (scale) {
        const units = this.defaults.units,
            mpu = Projection.METERS_PER_UNIT[units],
            dpi = this.defaults.DOTS_PER_INCH,
            resolution = scale / (mpu * 39.37 * dpi);

        return resolution;
    },

    /**
     * @description Return current Zoom of MapView
     * @return {number} current Zoom of MapView
     */
    getZoom: function () {
        return mapCollection.getMap("ol", "2D").getView().getZoom();
    },

    /**
     * calculate the extent for the current view state and the passed size
     * @fires Core#RadioRequestMapGetSize
     * @return {ol.extent} extent
     */
    getCurrentExtent: function () {
        const mapSize = Radio.request("Map", "getSize");

        return mapCollection.getMap("ol", "2D").getView().calculateExtent(mapSize);
    },


    /**
     * @description Sets projection from param url
     * @param {Object} value options from mapView
     * @returns {void}
     */
    setOptions: function (value) {
        this.defaults.settings.options = value;
    }
};

export default MapView;
