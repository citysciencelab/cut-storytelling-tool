import {wms} from "masterportalAPI/src";
import store from "../../app-store";
import Layer from "./layer";
/**
 * Creates a layer of type WMS.
 * @param {Object} attrs  attributes of the layer
 * @returns {void}
 */
export default function WMSLayer (attrs) {
    const defaults = {
        infoFormat: "text/xml",
        gfiAsNewWindow: null,
        // A change of the CACHEID initiates a reload of the service by openlayers and bypasses the browser cache.
        cacheId: parseInt(Math.random() * 10000000, 10),
        supported: ["2D", "3D"],
        showSettings: true,
        extent: null,
        isSecured: false,
        notSupportedFor3D: ["1747", "1749", "1750", "9822", "12600", "9823", "1752", "9821", "1750", "1751", "12599", "2297"],
        styles: "",
        useProxy: false
    };

    this.createLayer(Object.assign(defaults, attrs));
    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs), this.layer, attrs.isChildLayer);
    this.createLegend();

    Radio.channel("Layer").on({
        "change:SLDBody": this.updateSourceSLDBody
    });

    // Hack for services that do not support EPSG:4326
    if (this.get("notSupportedFor3D").includes(this.get("id"))) {
        this.set("supported", ["2D"]);
    }

    this.set("tileloaderror", false);
    if (attrs.url?.indexOf("wms_webatlasde") !== -1) {
        if (this.get("tileloaderror") === false) {
            this.set("tileloaderror", true);
            this.layer.getSource().on("tileloaderror", function () {
                if (!navigator.cookieEnabled) {
                    store.dispatch("Alerting/addSingleAlert", i18next.t("common:modules.core.modelList.wms.allowCookies"));
                }
            });
        }
    }

}
// Link prototypes and add prototype methods, means WMSLayer uses all methods and properties of Layer
WMSLayer.prototype = Object.create(Layer.prototype);

/**
 * Creates a layer of type WMS by using wms-layer of the masterportalapi.
 * Sets all needed attributes at the layer and the layer source.
 * @param {Object} attrs  params of the raw layer
 * @returns {void}
 */
WMSLayer.prototype.createLayer = function (attrs) {
    const options = {resolutions: Radio.request("MapView", "getResolutions"), origin: [442800, 5809000]},
        layerAttributes = {
            id: attrs.id,
            cacheId: attrs.cacheId,
            name: attrs.name,
            url: attrs.url,
            tilesize: attrs.tilesize,
            layers: attrs.layers,
            version: attrs.version,
            // todo ind ist das so richtig?
            transparent: true,
            singleTile: attrs.singleTile,
            minScale: attrs.minScale,
            maxScale: attrs.maxScale
        };

    if (attrs.styles !== "nicht vorhanden") {
        layerAttributes.STYLES = attrs.styles;
    }

    this.layer = wms.createLayer(layerAttributes, options);
    this.layer.set("layers", attrs.layers);
    this.layer.set("name", attrs.name);
    this.layer.set("legendURL", attrs.legendURL);
    this.layer.set("gfiTheme", attrs.gfiTheme);
    this.layer.set("gfiAttributes", attrs.gfiAttributes);
    this.layer.set("infoFormat", attrs.infoFormat);
    this.layer.set("gfiAsNewWindow", attrs.gfiAsNewWindow);
    this.layer.set("featureCount", attrs.featureCount);
    this.layer.set("format", attrs.format);
    this.layer.set("layers", attrs.layers);
    this.layer.set("useProxy", attrs.useProxy);
    this.layer.set("typ", attrs.typ);
};
/**
 * Updates the SLDBody of the layer source.
 * @returns {void}
 */
WMSLayer.prototype.updateSourceSLDBody = function () {
    this.layer.getSource().updateParams({SLD_BODY: this.get("SLDBody"), STYLES: this.get("paramStyle")});
};
/**
 * Updates the layers source by changing the cache id.
 * @returns {void}
 */
WMSLayer.prototype.updateSource = function () {
    this.set("cacheId", parseInt(Math.random() * 10000000, 10));
    this.layer.getSource().updateParams({CACHEID: this.get("cacheId")});
};
/**
 * Returns the layers of the WMS layer.
 * @returns {*} String or Array of layers
 */
WMSLayer.prototype.getLayers = function () {
    return this.get("layers");
};
/**
 * Gets the gfi url from the layers source.
 * @returns {String} - The created getFeature info url.
 */
WMSLayer.prototype.getGfiUrl = function () {
    const resolution = Radio.request("MapView", "getOptions").resolution,
        projection = Radio.request("MapView", "getProjection"),
        coordinate = Radio.request("GFI", "getCoordinate");

    return this.get("layerSource").getFeatureInfoUrl(coordinate, resolution, projection, {INFO_FORMAT: this.get("infoFormat"), FEATURE_COUNT: this.get("featureCount"), STYLES: "", SLD_BODY: undefined});
};
/**
* If the parameter "legendURL" is empty, it is set to GetLegendGraphic.
* @return {void}
*/
WMSLayer.prototype.createLegend = function () {
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
        store.dispatch("Legend/setLegendOnChanged", legend);
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
        store.dispatch("Legend/setLegendOnChanged", legends);
    }
    else if (typeof legend === "string") {
        store.dispatch("Legend/setLegendOnChanged", [legend]);
    }
};
/**
 * Returns the extent, if available. Else returns the extent of the mapView.
 * @returns {Array} the extent
 */
WMSLayer.prototype.getExtent = function () {
    if (this.has("extent")) {
        return this.get("extent");
    }
    return Radio.request("MapView", "getExtent");
};
