import {wfs} from "masterportalAPI/src";
import store from "../../app-store";
import Layer from "./layer";
import mapCollection from "../../dataStorage/mapCollection.js";
import * as bridge from "./RadioBridge.js";
/**
 * Creates a layer of type WMS.
 * @param {Object} attrs  attributes of the layer
 * @returns {void}
 */
export default function WFSLayer (attrs) {
    const defaults = {
        supported: ["2D", "3D"],
        showSettings: true,
        isSecured: false,
        isClustered: false,
        allowedVersions: ["1.1.0", "2.0.0"],
        altitudeMode: "clampToGround",
        useProxy: false
    },
    options = this.createLayer(Object.assign(defaults, attrs));
    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs), this.layer, !attrs.isChildLayer);
    this.set("options", options);
    this.set("style", options.style);


    // this.createLegend();
    // bridge.listenToChangeSLDBody(this);

    // // Hack for services that do not support EPSG:4326
    // if (this.get("notSupportedFor3D").includes(this.get("id"))) {
    //     this.set("supported", ["2D"]);
    // }

    // this.set("tileloaderror", false);
    // if (attrs.url?.indexOf("wms_webatlasde") !== -1) {
    //     if (this.get("tileloaderror") === false) {
    //         this.set("tileloaderror", true);
    //         this.layer.getSource().on("tileloaderror", function () {
    //             if (!navigator.cookieEnabled) {
    //                 store.dispatch("Alerting/addSingleAlert", i18next.t("common:modules.core.modelList.wms.allowCookies"));
    //             }
    //         });
    //     }
    // }
}
// Link prototypes and add prototype methods, means WFSLayer uses all methods and properties of Layer
WFSLayer.prototype = Object.create(Layer.prototype);

/**
 * Creates a layer of type WFS by using wms-layer of the masterportalapi.
 * Sets all needed attributes at the layer and the layer source.
 * @param {Object} attrs  params of the raw layer
 * @returns {void}
 */
WFSLayer.prototype.createLayer = function (attrs) {
    const rawLayerAttributes = {
            id: attrs.id,
            clusterDistance: attrs.clusterDistance,
            featureNS: attrs.featureNS,
            featureType: attrs.featureType
        },
       layerParams = {
            name: attrs.name,
            typ: attrs.typ,
            gfiAttributes: attrs.gfiAttributes,
            gfiTheme: attrs.gfiTheme,
            hitTolerance: attrs.hitTolerance,
            altitudeMode: attrs.altitudeMode,
            alwaysOnTop: attrs.alwaysOnTop
        },
        options ={
            geometryFunction: function (feature) {
                // do not cluster invisible features; can't rely on style since it will be null initially
                if (feature.get("hideInClustering") === true) {
                    return null;
                }
                return feature.getGeometry();
            },
            projectionCode: Radio.request("MapView", "getProjection")?.getCode(),
            version: this.getVersion(attrs),
            propertyname: this.getPropertyname(attrs),
            bbox: attrs.bboxGeometry ? attrs.bboxGeometry.getExtent().toString(): undefined,
            style: this.getStyle(attrs)
        };
    this.layer = wfs.createLayer(rawLayerAttributes, layerParams, options);
    return options;
};
/**
 * Updates the SLDBody of the layer source.
 * @returns {void}
 */
WFSLayer.prototype.getVersion = function (attrs) {
    const allowedVersions = attrs.allowedVersions,
    isVersionValid = this.checkVersion(attrs.name, attrs.version, allowedVersions);

    if (!isVersionValid) {
        // this.set("version", allowedVersions[0]);
        return allowedVersions[0];
    }
    return undefined;
};
WFSLayer.prototype.checkVersion = function (name, version, allowedVersions) {
    let isVersionValid = true;

        if (!allowedVersions.includes(version)) {
            isVersionValid = false;

            console.warn(`The WFS layer: "${name}" is configured in version: ${version}.`
             + ` OpenLayers accepts WFS only in the versions: ${allowedVersions},`
             + ` It tries to load the layer: "${name}" in version ${allowedVersions[0]}!`);
        }
        return isVersionValid;
};
WFSLayer.prototype.getPropertyname = function (attrs) {
    let propertyname = "";

        if (Array.isArray(attrs.propertyNames)) {
            propertyname = attrs.propertyNames.join(",");
        }
        return propertyname;
};
WFSLayer.prototype.getStyle = function (attrs) {
    const styleId = attrs.styleId,
            styleModel = Radio.request("StyleList", "returnModelById", styleId);
        let isClusterFeature = false,
        style = null;

        if (styleModel !== undefined) {
            const style = function (feature) {
                // in manchen Fällen war feature undefined und in "this" geschrieben.
                // konnte nicht nachvollziehen, wann das so ist.
                const feat = feature !== undefined ? feature : this;

                isClusterFeature = typeof feat.get("features") === "function" || typeof feat.get("features") === "object" && Boolean(feat.get("features"));

                return styleModel.createStyle(feat, isClusterFeature);
            };
        }
        else {
            console.error(i18next.t("common:modules.core.modelList.layer.wrongStyleId", {styleId}));
        }

        return style;
};
/**
 * Updates the layers source by changing the cache id.
 * @returns {void}
 */
WFSLayer.prototype.updateSource = function () {
    wfs.updateSource(this.layer, this.get("options"));
};
/**
 * Returns the layers of the WMS layer.
 * @returns {*} String or Array of layers
 */
WFSLayer.prototype.getLayers = function () {
    return this.get("layers");
};
/**
 * Gets the gfi url from the layers source.
 * @returns {String} - The created getFeature info url.
 */
WFSLayer.prototype.getGfiUrl = function () {
    const mapView = mapCollection.getMap(store.state.Map.mapId, store.state.Map.mapMode).getView(),
        resolution = store.getters["Map/resolution"],
        projection = mapView.getProjection(),
        coordinate = store.getters["Map/clickCoord"];

    return this.get("layerSource").getFeatureInfoUrl(coordinate, resolution, projection, {INFO_FORMAT: this.get("infoFormat"), FEATURE_COUNT: this.get("featureCount"), STYLES: "", SLD_BODY: undefined});
};
/**
* If the parameter "legendURL" is empty, it is set to GetLegendGraphic.
* @return {void}
*/
WFSLayer.prototype.createLegend = function () {
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
};
/**
 * Returns the extent, if available. Else returns the extent of the mapView.
 * @returns {Array} the extent
 */
WFSLayer.prototype.getExtent = function () {
    if (this.has("extent")) {
        return this.get("extent");
    }
    return store.getters["Map/bbox"];
};
