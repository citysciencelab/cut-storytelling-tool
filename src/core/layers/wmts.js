import Layer from "./layer";
import WMTS, {optionsFromCapabilities} from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import TileLayer from "ol/layer/Tile";
import {DEVICE_PIXEL_RATIO} from "ol/has";
import {get as getProjection} from "ol/proj";
import {getWidth} from "ol/extent";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import * as bridge from "./RadioBridge.js";
import axios from "axios";
import handleAxiosResponse from "../../utils/handleAxiosResponse";
import getNestedValues from "../../utils/getNestedValues";

/**
 * Creates a layer of type WMTS.
 * infoFormat="text/xml Format of provided information."
 * supported=["2D", "3D"] Supported map modes.
 * @param {Object} attrs  attributes of the layer
 * @param {Object} options  options of the layer
 * @returns {void}
 */
export default function WMTSLayer (attrs, options) {
    const defaults = {
        infoFormat: "text/xml",
        supported: ["2D", "3D"],
        showSettings: true
    };

    this.createLayer(Object.assign(defaults, attrs, options));

    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs, options), this.layer, !attrs.isChildLayer);
    this.createLegend();

    if (this.get("isVisibleInMap")) {
        this.updateSource();
    }

}

// Link prototypes and add prototype methods, means WMTSLayer uses all methods and properties of Layer
WMTSLayer.prototype = Object.create(Layer.prototype);

/**
* Creates the LayerSource for this WMTSLayer.
* @param {Object} attrs  attributes of the layer
* @returns {void}
*/
WMTSLayer.prototype.createLayerSource = function (attrs) {
    if (attrs.optionsFromCapabilities === undefined) {
        const projection = getProjection(attrs.coordinateSystem),
            extent = projection.getExtent(),
            style = attrs.style,
            format = attrs.format,
            wrapX = attrs.wrapX ? attrs.wrapX : false,
            urls = attrs.urls,
            size = getWidth(extent) / parseInt(attrs.tileSize, 10),
            resLength = parseInt(attrs.resLength, 10),
            resolutions = new Array(resLength),
            matrixIds = new Array(resLength),
            source = new WMTS({
                projection: projection,
                attributions: attrs.olAttribution,
                tileGrid: new WMTSTileGrid({
                    origin: attrs.origin,
                    resolutions: resolutions,
                    matrixIds: matrixIds,
                    tileSize: attrs.tileSize
                }),
                tilePixelRatio: DEVICE_PIXEL_RATIO,
                urls: urls,
                matrixSet: attrs.tileMatrixSet,
                matrixSizes: attrs.matrixSizes,
                layer: attrs.layers,
                format: format,
                style: style,
                version: attrs.version,
                transparent: attrs.transparent.toString(),
                wrapX: wrapX,
                requestEncoding: attrs.requestEncoding,
                scales: attrs.scales
            });

        this.generateArrays(resolutions, matrixIds, resLength, size);
        source.matrixSizes = attrs.matrixSizes;
        source.scales = attrs.scales;
    }
    else {
        const layerIdentifier = attrs.layers,
            url = attrs.capabilitiesUrl,
            matrixSet = attrs.tileMatrixSet,
            capabilitiesOptions = {
                layer: layerIdentifier
            };

        // use the matrixSet (if defined) for optionsFromCapabilities
        // else look for a tilematrixset in epsg:3857
        if (matrixSet && matrixSet.length > 0) {
            capabilitiesOptions.matrixSet = matrixSet;
        }
        else {
            capabilitiesOptions.projection = "EPSG:3857";
        }

        this.getWMTSCapabilities(url)
            .then((result) => {
                const options = optionsFromCapabilities(result, capabilitiesOptions),
                    tileMatrixSet = result.Contents.TileMatrixSet.filter(set => set.Identifier === options.matrixSet)[0],
                    matrixSizes = [],
                    scales = [];

                // Add the parameters "ScaleDenominator" and "MatrixHeight" / "MatrixWidth" to the source to be able to print WMTS layers
                tileMatrixSet.TileMatrix.forEach(({MatrixHeight, MatrixWidth, ScaleDenominator}) => {
                    matrixSizes.push([MatrixWidth, MatrixHeight]);
                    scales.push(ScaleDenominator);
                });

                if (options !== null) {
                    const source = new WMTS(options);

                    source.matrixSizes = matrixSizes;
                    source.scales = scales;
                    this.layer.set("options", options);
                    this.layer.setSource(source);
                    this.layer.getSource().refresh();
                }
                else {
                    // reject("Cannot get options from WMTS-Capabilities");
                    throw new Error("Cannot get options from WMTS-Capabilities");
                }
            })
            .catch((error) => {
                this.removeLayer();
                // remove layer from project completely
                bridge.removeItem(this.get("id"));
                // refresh layer tree
                bridge.refreshLayerTree();
                if (error === "Fetch error") {
                    // error message has already been printed earlier
                    return;
                }
                this.showErrorMessage(error, this.get("name"));
            });
    }
};

/**
 * Generates resolutions and matrixIds arrays for the WMTS LayerSource.
 *
 * @param {Array} resolutions The resolutions array for the LayerSource.
 * @param {Array} matrixIds The matrixIds array for the LayerSource.
 * @param {Number} length The length of the given arrays.
 * @param {Number} size The tileSize depending on the extent.
 * @returns {void}
 */
WMTSLayer.prototype.generateArrays = function (resolutions, matrixIds, length, size) {
    for (let i = 0; i < length; ++i) {
        resolutions[i] = size / Math.pow(2, i);
        matrixIds[i] = i;
    }
};

/**
 * Gets the WMTS-GetCapabilities document and parse it
 * @param {string} url url for getting capabilities
 * @returns {promise} promise resolves to parsed WMTS-GetCapabilities object
 */
WMTSLayer.prototype.getWMTSCapabilities = function (url) {
    return axios.get(url)
        .then(response => handleAxiosResponse(response, "getWMTSCapabilities"))
        .then(result => {
            const parser = new WMTSCapabilities();

            return parser.read(result);
        });
};

/**
 * Shows error message in console when WMTS-GetCapabilities cannot be parsed
 * @param {string} errorMessage error message
 * @param {string} layerName layerName
 * @returns {void}
 */
WMTSLayer.prototype.showErrorMessage = (errorMessage, layerName) => {
    console.warn("content: Layer " + layerName + ": " + errorMessage);
};

/**
 * Creates the WMTSLayer.
 * @param {Object} attrs  attributes of the layer
 * @returns {void}
 */
WMTSLayer.prototype.createLayer = function (attrs) {
    const layerSource = this.createLayerSource(Object.assign(attrs)),
        tileLayer = new TileLayer({
            id: attrs.id,
            source: layerSource,
            name: attrs.name,
            minResolution: attrs.minScale,
            maxResolution: attrs.maxScale,
            supported: ["2D", "3D"],
            showSettings: true,
            extent: null,
            typ: attrs.typ,
            legendURL: attrs.legendURL,
            infoFormat: attrs.infoFormat
        });

    this.layer = tileLayer;
};

/**
 * If no legendURL is set an Error is written on the console.
 * For the OptionsFromCapabilities way:
 * If legend is empty, WMTS-Capabilities will be searched for a legendURL (OGC Standard)
 * If a legend is found, legend will be rebuild
 *
 * @returns {void}
 */
WMTSLayer.prototype.createLegend = function () {
    let legend = this.get("legend");
    const capabilitiesUrl = this.get("capabilitiesUrl");

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
            this.setLegend([legend]);
        }
    }
    if ((this.get("optionsFromCapabilities") === undefined) && (legend === true)) {
        console.error("WMTS: No legendURL is specified for the layer!");
    }
    else if (this.get("optionsFromCapabilities") && !this.get("legendURL")) {
        this.getWMTSCapabilities(capabilitiesUrl)
            .then(function (result) {
                result.Contents.Layer.forEach(function (layer) {
                    if (layer.Identifier === this.get("layers")) {
                        const getLegend = getNestedValues(layer, "LegendURL");

                        if (getLegend !== null && getLegend !== undefined) {
                            legend = getLegend[0][0].href;
                            this.setLegend([legend]);

                            // rebuild Legend
                            bridge.setLegendLayerList();
                        }
                        else {
                            this.setLegend(null);
                            console.warn("no legend url found for layer " + this.get("layers"));
                        }

                    }
                }.bind(this));
            }.bind(this))
            .catch(function (error) {
                if (error === "Fetch error") {
                    // error message has already been printed earlier
                    return;
                }
                this.showErrorMessage(error, this.get("name"));
            }.bind(this));
    }

};

/**
 * Registers the LayerLoad-Events.
 * These are dispatched to core/map, which then either adds or removes a Loading Layer.
 * @returns {void}
 */
WMTSLayer.prototype.registerLoadingListeners = function () {
    this.get("layerSource").on("tileloadend", function () {
        this.set("loadingParts", this.get("loadingsParts") - 1);
    });

    this.get("layerSource").on("tileloadstart", function () {
        const tmp = this.get("loadingParts") ? this.get("loadingParts") : 0;

        this.set("loadingParts", tmp + 1);
    });

    this.get("layerSource").on("change:loadingParts", function (val) {
        if (val.oldValue > 0 && this.get("loadingParts") === 0) {
            this.dispatchEvent("wmtsloadend");
            this.unset("loadingParts", {silent: true});
        }
        else if (val.oldValue === undefined && this.get("loadingParts") === 1) {
            this.dispatchEvent("wmtsloadstart");
        }
    });
};

/**
 * Reigsters the LayerLoad-Event for Errors.
 * @returns {void}
 */
WMTS.prototype.registerErrorListener = function () {
    this.registerTileloadError();
};

/**
 * If the WMTS-Layer has an extent defined, then this is returned.
 * Else, the extent of the projection is returned.
 * @returns {Array} - The extent of the Layer.
 */
WMTSLayer.prototype.getExtent = function () {
    const projection = getProjection(this.get("coordinateSystem"));

    if (this.has("extent")) {
        return this.get("extent");
    }

    return projection.getExtent();
};

/**
 * Sets the infoFormat to the given Parameter.
 * @param {*} infoFormat - The value for the infoFormat to be set.
 * @returns {void}
 */
WMTSLayer.prototype.setInfoFormat = function (infoFormat) {
    this.set("infoFormat", infoFormat);
};

/**
 * Returns the WMTS-Layer.
 * @returns {Object} - The WMTS-Layer
 */
WMTSLayer.prototype.getLayer = function () {
    return this.get("layer");
};


