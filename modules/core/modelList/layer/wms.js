import axios from "axios";
import Layer from "./model";
import TileWMS from "ol/source/TileWMS.js";
import TileGrid from "ol/tilegrid/TileGrid.js";
import ImageWMS from "ol/source/ImageWMS.js";
import {Image, Tile} from "ol/layer.js";
import WMSCapabilities from "ol/format/WMSCapabilities";
import store from "../../../../src/app-store";
import handleAxiosResponse from "../../../../src/utils/handleAxiosResponse";

const WMSLayer = Layer.extend({
    defaults: function () {
        // extended die Layer defaults by value
        return Object.assign(Layer.prototype.defaults, {
            infoFormat: "text/xml",
            gfiAsNewWindow: null,
            // A change of the CACHEID initiates a reload of the service by openlayers and bypasses the browser cache.
            cacheId: parseInt(Math.random() * 10000000, 10),
            supported: ["2D", "3D"],
            showSettings: true,
            extent: null,
            isSecured: false,
            notSupportedFor3D: ["1747", "1749", "1750", "9822", "12600", "9823", "1752", "9821", "1750", "1751", "12599", "2297"],
            useProxy: false,
            time: false,
            timeDefault: null
        });
    },

    initialize: function () {
        this.checkForScale(Radio.request("MapView", "getOptions"));

        if (!this.get("isChildLayer")) {
            Layer.prototype.initialize.apply(this);
        }

        this.listenTo(this, {
            "change:SLDBody": this.updateSourceSLDBody
        });

        this.listenTo(Radio.channel("WmsTime"), {
            "updateTime": this.updateTime
        });

        // Hack for services that do not support EPSG:4326
        if (this.get("notSupportedFor3D").includes(this.get("id"))) {
            this.set("supported", ["2D"]);
        }
    },

    updateTime (id, newValue) {
        if (id === this.get("id")) {
            this.get("layerSource").updateParams({"TIME": newValue});
        }
    },

    /**
     * [createLayerSource description]
     * @return {void}
     */
    createLayerSource: function () {
        let params,
            source;

        params = {
            CACHEID: this.get("cacheId"),
            LAYERS: this.get("layers"),
            FORMAT: this.get("format") === "nicht vorhanden" ? "image/png" : this.get("format"),
            VERSION: this.get("version"),
            TRANSPARENT: this.get("transparent").toString()
        };

        if (this.get("time")) {
            params.TIME = this.prepareTime();
        }

        if (this.get("styles") && this.get("styles") !== "" && this.get("styles") !== "nicht vorhanden") {
            params = Object.assign(params, {
                STYLES: this.get("styles")
            });
        }
        this.set("tileloaderror", false);

        if (this.get("singleTile") !== true) {
            // TileWMS can be cached
            this.set("tileCountloaderror", 0);
            this.set("tileCount", 0);
            source = new TileWMS({
                url: this.get("url"),
                attributions: this.get("olAttribution"),
                gutter: this.get("gutter"),
                params: params,
                tileGrid: new TileGrid({
                    resolutions: Radio.request("MapView", "getResolutions"),
                    origin: [
                        442800,
                        5809000
                    ],
                    tileSize: parseInt(this.get("tilesize"), 10)
                })
            });

            // wms_webatlasde
            if (this.get("url").indexOf("wms_webatlasde") !== -1) {
                if (this.get("tileloaderror") === false) {
                    this.set("tileloaderror", true);
                    source.on("tileloaderror", function () {
                        if (!navigator.cookieEnabled) {
                            Radio.trigger("Alert", "alert", {text: "<strong>Bitte erlauben sie Cookies, damit diese Hintergrundkarte geladen werden kann.</strong>", kategorie: "alert-warning"});
                        }
                    });
                }
            }

            this.setLayerSource(source);
        }
        else {
            // ImageWMS can not be cached
            this.setLayerSource(new ImageWMS({
                url: this.get("url"),
                attributions: this.get("olAttribution"),
                params: params
            }));
        }
    },

    /**
     * Prepares the parameters for the WMS-T.
     * This includes creating the range of possible time values, the minimum step between these as well as the initial value set.
     *
     * @throws {Error} Will throw an Error if the given layer is not a valid time layer.
     * @returns {Promise<number>} If the functions resolves, the initial value for the time dimension is returned.
     */
    prepareTime () {
        const time = this.get("time");

        return this.requestCapabilities(this.get("url"))
            .then(result => {
                const {Dimension, Extent} = result.Capability.Layer.Layer[0];

                if (!Dimension || !Extent || Dimension[0].name !== "time" || Extent.name !== "time") {
                    throw Error(i18next.t("common:modules.core.modelList.layer.wms.invalidTimeLayer", {id: this.id}));
                }
                return Extent;
            })
            .then(extent => {
                const {step, timeRange} = this.extractExtentValues(extent),
                    defaultValue = typeof time === "object" && timeRange[0] <= time.default && time.default <= timeRange[timeRange.length - 1]
                        ? time.default
                        : Number(extent.default),
                    timeData = {defaultValue, step, timeRange};

                this.set("time", typeof time === "object" ? Object.assign(time, timeData) : timeData);
                timeData.layerId = this.get("id");
                store.commit("WmsTime/addTimeSliderObject", timeData);

                return defaultValue;
            })
            .catch(error => {
                this.removeLayer();
                // remove layer from project completely
                Radio.trigger("Parser", "removeItem", this.get("id"));
                Radio.trigger("Util", "refreshTree");

                console.error(i18next.t("common:modules.core.modelList.layer.wms.errorTimeLayer", {error, id: this.id}));
            });
    },

    /**
     * Extracts the values from the time dimensional extent.
     * There are four different cases how the values may be present (as described in the [WMS Specification at Table C.1]{@link http://cite.opengeospatial.org/OGCTestData/wms/1.1.1/spec/wms1.1.1.html#dims.declaring}).
     * They can be determined based on the characters "," and '/'.
     *
     * - CASE 1: Single Value; neither ',' nor '/' are present. The returned Array will have only this value, the step will be 1.
     * - CASE 2: List of multiple values; ',' is present, '/' isn't. The returned Array will have exactly these values. The step is dependent on the minimal distances found inside this Array.
     * - CASE 3: Interval defined by its lower and upper bounds and its resolution; '/' is present, ',' isn't. The returned Array will cover all values between the lower and upper bounds with a distance of the resolution.
     *         The step is retrieved from the resolution.
     * - Case 4: List of multiple intervals; ',' and '/' are present. For every interval the process described in CASE 3 will be performed.
     *
     * @param {string} extent Time dimensional extent retrieved from the service.
     * @param {string} extent.values The values of the time dimensional extent.
     * @returns {object} An object containing the range of possible time values as well as the minimum step between these.
     */
    extractExtentValues ({values}) {
        const timeRange = [];
        let smallestStep = 1;

        // NOTE: This was implemented against a service that uses the syntax described in CASE 3. Might need adjustment to work for the others.
        timeRange.push(
            ...new Set(values.replace(" ", "").split(",")
                .map(entry => entry.split("/"))
                .map(entry => {
                    // CASE 1 & 2
                    if (entry.length === 1) {
                        return entry;
                    }
                    // CASE 3 & 4
                    const [min, max] = entry.map(Number),
                        resolution = entry[2],
                        step = Number([...resolution][1]);

                    // NOTE: This was implemented against a service that uses years. Might need adjustment to work for services that use months oder days.
                    if (step < smallestStep) {
                        smallestStep = step;
                    }

                    return this.createTimeRange(min, max, step);
                })
                .flat(1)
                .map(Number)
                .sort((first, second) => first - second)));

        return {step: smallestStep, timeRange};
    },

    /**
     * Creates an array with ascending values from min to max separated by step.
     *
     * @param {number} min Minimum value.
     * @param {number} max Maximum value.
     * @param {number} step Distance between each value inside the array.
     * @returns {number[]} Array of numbers between min and max with a distance of step to each neighbouring number.
     */
    createTimeRange (min, max, step) {
        return Array(Math.floor((max - min) / step) + 1)
            .fill(undefined)
            .map((_, index) => min + (index * step));
    },


    /**
     * [createLayer description]
     * @return {void}
     */
    createLayer: function () {
        const layerobjects =
            {
                id: this.get("id"),
                source: this.get("layerSource"),
                name: this.get("name"),
                typ: this.get("typ"),
                legendURL: this.get("legendURL"),
                gfiTheme: this.get("gfiTheme"),
                gfiAttributes: this.get("gfiAttributes"),
                infoFormat: this.get("infoFormat"),
                gfiAsNewWindow: this.get("gfiAsNewWindow"),
                featureCount: this.get("featureCount"),
                useProxy: this.get("useProxy")
            };

        if (this.get("singleTile") !== true) {
            this.setLayer(new Tile(layerobjects));
        }
        else {
            this.setLayer(new Image(layerobjects));
        }
        this.createLegend();
    },

    /**
     * If the parameter "legendURL" is empty, it is set to GetLegendGraphic.
     * @return {void}
     */
    createLegend: function () {
        const version = this.get("version");
        let legend = this.get("legend");

        /**
         * @deprecated in 3.0.0
         */
        if (this.get("legendURL")) {
            if (this.get("legendURL") === "") {
                legend = true;
            }
            else if (this.get("legendURL") === "ignore") {
                legend = false;
            }
            else {
                legend = this.get("legendURL");
            }
        }

        if (Array.isArray(legend)) {
            this.setLegend(legend);
        }
        else if (legend === true) {
            const layerNames = this.get("layers").split(","),
                legends = [];

            if (layerNames.length === 1) {
                legends.push(encodeURI(this.get("url") + "?VERSION=" + version + "&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=" + this.get("layers")));
            }
            else if (layerNames.length > 1) {
                layerNames.forEach(layerName => {
                    legends.push(encodeURI(this.get("url") + "?VERSION=" + version + "&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=" + layerName));
                });
            }
            this.setLegend(legends);
        }
        else if (typeof legend === "string") {
            this.setLegend([legend]);
        }
    },

    /**
     * Register LayerLoad-Events
     * @returns {void}
     */
    registerLoadingListeners: function () {
        if (this.get("layerSource") instanceof TileWMS) {
            this.registerTileWMSLoadEvents();
        }
        else if (this.get("layerSource") instanceof ImageWMS) {
            this.registerImageLoadEvents();
        }
    },

    registerImageLoadEvents: function () {
        this.get("layerSource").on("imageloadend", function () {
            this.set("loadingParts", this.get("loadingParts") - 1);
        });

        this.get("layerSource").on("imageloadstart", function () {
            const startval = this.get("loadingParts") ? this.get("loadingParts") : 0;

            this.set("loadingParts", startval + 1);
        });

        this.get("layerSource").on("change:loadingParts", function (obj) {
            if (obj.oldValue > 0 && this.get("loadingParts") === 0) {
                this.dispatchEvent("wmsloadend");
                this.unset("loadingParts", {silent: true});
            }
            else if (obj.oldValue === undefined && this.get("loadingParts") === 1) {
                this.dispatchEvent("wmsloadstart");
            }
        });
    },

    registerTileWMSLoadEvents: function () {
        this.get("layerSource").on("tileloadend", function () {
            this.set("loadingParts", this.get("loadingParts") - 1);
        });

        this.get("layerSource").on("tileloadstart", function () {
            const startval = this.get("loadingParts") ? this.get("loadingParts") : 0;

            this.set("loadingParts", startval + 1);
        });

        this.get("layerSource").on("change:loadingParts", function (obj) {
            if (obj.oldValue > 0 && this.get("loadingParts") === 0) {
                this.dispatchEvent("wmsloadend");
                this.unset("loadingParts", {silent: true});
            }
            else if (obj.oldValue === undefined && this.get("loadingParts") === 1) {
                this.dispatchEvent("wmsloadstart");
            }
        });
    },

    /**
     * Register LayerLoad-Events
     * @returns {void}
     */
    registerErrorListener: function () {
        if (this.get("layerSource") instanceof TileWMS) {
            this.registerTileloadError();
        }
        else if (this.get("layerSource") instanceof ImageWMS) {
            this.registerImageloadError();
        }
    },
    updateSupported: function () {
        if (this.getSingleTile()) {
            this.set("supported", ["2D"]);
        }
        else {
            this.set("supported", ["2D", "3D"]);
        }
    },
    getExtent: function () {
        if (this.has("extent")) {
            return this.get("extent");
        }
        return Radio.request("MapView", "getExtent");
    },

    updateSourceSLDBody: function () {
        this.get("layer").getSource().updateParams({SLD_BODY: this.get("SLDBody"), STYLES: this.get("paramStyle")});
    },

    /**
     * Lädt den WMS neu, indem ein Parameter verändert wird.
     * @returns {void}
     */
    updateSource: function () {
        this.newCacheId();

        this.get("layer").getSource().updateParams({CACHEID: this.get("cacheId")});
    },

    setInfoFormat: function (value) {
        this.set("infoFormat", value);
    },

    /**
     * [getLayers description]
     * @return {Object[]} [description]
     */
    getLayers: function () {
        return this.get("layers");
    },

    /**
     * Gets the gfi url from the layers source.
     * @returns {String} - The created getFeature info url.
     */
    getGfiUrl: function () {
        const resolution = Radio.request("MapView", "getOptions").resolution,
            projection = Radio.request("MapView", "getProjection"),
            coordinate = Radio.request("GFI", "getCoordinate");

        return this.get("layerSource").getFeatureInfoUrl(coordinate, resolution, projection, {INFO_FORMAT: this.get("infoFormat"), FEATURE_COUNT: this.get("featureCount"), STYLES: "", SLD_BODY: undefined});
    },

    /*
    * random setter for cacheId
    * @returns {void}
    */
    newCacheId: function () {
        this.set("cacheId", parseInt(Math.random() * 10000000, 10));
    },

    /**
     * setter for gfiAsNewWindow
     * @param {Object} value see doc/config.json.md for more information
     * @param {String} [value.name="_blank"] the browsing context or the target attribute to open the window (see https://developer.mozilla.org/en-US/docs/Web/API/Window/open)
     * @param {String} [value.specs=""] a comma-separated list of items - the setup to open the window with (see https://developer.mozilla.org/en-US/docs/Web/API/Window/open)
     * @returns {void}  -
     */
    setGfiAsNewWindow: function (value) {
        this.set("gfiAsNewWindow", value);
    },

    /**
     * getter for gfiAsNewWindow
     * @returns {Object}  see setGfiAsNewWindow above or doc/config.json.md for more information
     */
    getGfiAsNewWindow: function () {
        return this.get("gfiAsNewWindow");
    },
    /**
     * Requests the GetCapabilities document and parses the result.
     *
     * @param {String} url url to request.
     * @returns {Promise} A promise which will resolve the parsed GetCapabilities object.
     */
    requestCapabilities: function (url) {
        return axios.get(encodeURI(`${url}?service=WMS&version=${this.get("version")}&layers=${this.get("layers")}&request=GetCapabilities`))
            .then(response => handleAxiosResponse(response, "WMS, createLayerSource, requestCapabilities"))
            .then(result => {
                const capabilities = new WMSCapabilities().read(result);

                capabilities.Capability.Layer.Layer[0].Extent = this.findTimeDimensionalExtent(new DOMParser().parseFromString(result, "text/xml").firstElementChild);
                return capabilities;
            });
    },
    /**
     * Search for the time dimensional Extent in the given HTMLCollection returned from a request to a WMS-T.
     *
     * @param {HTMLCollection} element The root HTMLCollection returned from a GetCapabilities request to a WMS-T.
     * @returns {?Object} An object containing the needed Values from the time dimensional Extent for further usage.
     */
    findTimeDimensionalExtent (element) {
        const capability = this.findNode(element, "Capability"),
            outerLayer = this.findNode(capability, "Layer"),
            innerFirstLayer = this.findNode(outerLayer, "Layer"),
            extent = this.findNode(innerFirstLayer, "Extent");

        return extent ? this.retrieveExtentValues(extent) : null;
    },
    /**
     * Finds the Element with the given name inside the given HTMLCollection.
     *
     * @param {HTMLCollection} element HTMLCollection to be found.
     * @param {String} nodeName Name of the Element to be searched for.
     * @returns {HTMLCollection} If found, the HTMLCollection with given name, otherwise undefined.
     */
    findNode (element, nodeName) {
        return [...element.children].find(el => el.nodeName === nodeName);
    },
    /**
     * Retrieves the attributes from the given HTMLCollection and adds the key value pairs to an Object.
     * Also retrieves its value.
     *
     * @param {HTMLCollection} extent The Collection of values for the time dimensional Extent.
     * @returns {Object} An Object containing the attributes of the time dimensional Extent as well as its value.
     */
    retrieveExtentValues (extent) {
        return [...extent.attributes]
            .reduce((acc, att) => ({...acc, [att.name]: att.value}), {values: extent.innerHTML});
    }
});

export default WMSLayer;
