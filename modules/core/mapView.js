import {Projection} from "ol/proj.js";
import defaults from "masterportalAPI/src/defaults";
import store from "../../src/app-store";
import mapCollection from "../../src/core/dataStorage/mapCollection.js";

const MapView = Backbone.Model.extend(/** @lends MapView.prototype */{
    defaults: {
        background: "",
        units: "m",
        DOTS_PER_INCH: store.getters.dpi
    },

    /**
     * @class MapView
     * @description todo
     * @extends Backbone.Model
     * @memberof Core
     * @constructs
     * @property {String} background="" todo
     * @property {String} units="m" todo
     * @property {number} DOTS_PER_INCH="" Hack to get the screen resolution
     * @listens Core#RadioRequestMapViewGetCurrentExtent
     * @listens Core#RadioRequestMapViewGetOptions
     * @listens Core#RadioRequestMapViewGetProjection
     * @listens Core#RadioRequestMapViewGetResoByScale
     * @listens Core#RadioRequestMapViewGetScales
     * @listens Core#RadioRequestMapViewGetZoomLevel
     * @listens Core#RadioRequestMapViewGetResolutions
     * @listens Core#RadioTriggerMapViewResetView
     * @listens Core#RadioTriggerMapViewSetCenter
     * @listens Core#RadioTriggerMapViewSetConstrainedResolution
     * @listens Core#RadioTriggerMapViewSetScale
     * @listens Core#RadioTriggerMapViewSetZoomLevelDown
     * @listens Core#RadioTriggerMapViewSetZoomLevelUp
     * @listens Core#RadioTriggerMapViewToggleBackground
     * @fires Core#RadioRequestMapGetSize
     * @fires Core#RadioRequestParametricURLGetCenter
     * @fires Core#RadioRequestParametricURLGetProjectionFromUrl
     * @fires Core#RadioRequestParametricURLGetZoomLevel
     * @fires Core#RadioTriggerMapViewChangedCenter
     * @fires Core#RadioTriggerMapViewChangedOptions
     * @fires Core#RadioTriggerMapViewChangedZoomLevel
     * @fires RemoteInterface#RadioTriggerRemoteInterfacePostMessage
     * @fires Core#RadioRequestMapGetMap
     * @returns {void}
     */
    initialize: function () {
        const channel = Radio.channel("MapView");
        let params = {};

        if (this.get("settings") !== undefined && this.get("settings").options !== undefined) {
            this.setOptions(this.get("settings").options);
        }
        else {
            this.setOptions(defaults.options);
        }

        channel.reply({
            "getProjection": function () {
                return mapCollection.getMap("ol", "2D").getView().getProjection();
            },
            "getOptions": function () {
                return Radio.request("Util", "findWhereJs", this.get("options"), {resolution: mapCollection.getMap("ol", "2D").getView().getConstrainedResolution(mapCollection.getMap("ol", "2D").getView().getResolution())});
            },
            "getCenter": function () {
                return this.getCenter();
            },
            "getZoomLevel": function () {
                return this.getZoom();
            },
            "getResolutions": function () {
                return mapCollection.getMap("ol", "2D").getView().getResolutions();
            },
            "getResoByScale": this.getResoByScale,
            "getScales": function () {
                return this.get("options").map(function (option) {
                    return option.scale;
                });
            },
            "getCurrentExtent": this.getCurrentExtent,
            "getBackgroundImage": function () {
                return this.get("backgroundImage");
            }
        }, this);

        channel.on({
            "resetView": this.resetView,
            "setCenter": this.setCenter,
            "setConstrainedResolution": this.setConstrainedResolution,
            "setScale": this.setResolutionByScale,
            "setZoomLevelDown": this.setZoomLevelDown,
            "setZoomLevelUp": this.setZoomLevelUp,
            "toggleBackground": this.toggleBackground
        }, this);

        if (document.getElementById("map") !== null) {
            this.setBackgroundImage(document.getElementById("map").style.backgroundImage);
        }

        // Listener für ol.View
        mapCollection.getMap("ol", "2D").getView().on("change:resolution", this.changedResolutionCallback.bind(this), this);
        mapCollection.getMap("ol", "2D").getView().on("change:center", function () {
            Radio.trigger("MapView", "changedCenter", this.getCenter());
            Radio.trigger("RemoteInterface", "postMessage", {"centerPosition": this.getCenter()});
        }, this);

        params = Radio.request("Util", "findWhereJs", this.get("options"), {resolution: mapCollection.getMap("ol", "2D").getView().getConstrainedResolution(mapCollection.getMap("ol", "2D").getView().getResolution())});

        Radio.trigger("MapView", "changedOptions", params);
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
            params = Radio.request("Util", "findWhereJs", this.get("options"), {resolution: constrainResolution});

        Radio.trigger("MapView", "changedOptions", params);
        store.commit("Map/setScale", params?.scale);
        Radio.trigger("MapView", "changedZoomLevel", this.getZoom());
        Radio.trigger("RemoteInterface", "postMessage", {"zoomLevel": this.getZoom()});
    },

    /**
     * @description finds the right resolution for the scale and sets it for this view
     * @param {number} scale - map view scale
     * @returns {void}
     */
    setResolutionByScale: function (scale) {
        const params = Radio.request("Util", "findWhereJs", this.get("options"), {scale: scale});

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
            settingsCenter = this.get("settings") !== undefined && this.get("settings")?.startCenter ? this.get("settings").startCenter : undefined,
            defaultCenter = defaults.startCenter,
            center = paramUrlCenter || settingsCenter || defaultCenter,
            settingsResolution = this.get("settings") !== undefined && this.get("settings")?.resolution ? this.get("settings").resolution : undefined,
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
        this.set("background", value);
    },

    /**
     * Sets the Backgroundimage for the Mapview.
     * @param  {string} value BG Image Url
     * @returns {void}
     */
    setBackgroundImage: function (value) {
        this.set("backgroundImage", value);
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
        if (this.get("background") === "white") {
            this.setBackground(this.get("backgroundImage"));
            $("#map").css("background", this.get("backgroundImage") + "repeat scroll 0 0 rgba(0, 0, 0, 0)");
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
        const scales = this.get("options").map(function (option) {
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
        const units = this.get("units"),
            mpu = Projection.METERS_PER_UNIT[units],
            dpi = this.get("DOTS_PER_INCH"),
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
        this.set("options", value);
    }
});

export default MapView;
