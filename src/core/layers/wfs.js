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
    //todo checken:
    // this.checkForScale(Radio.request("MapView", "getOptions"));

    options = this.createLayer(Object.assign(defaults, attrs));
    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs), this.layer, !attrs.isChildLayer);
    this.set("options", options);
    this.set("style", options.style);
    this.prepareFeaturesFor3D(this.layer.getSource().getFeatures());
    if (attrs.clusterDistance) {
        this.set("isClustered", true);
    }
  
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
            url: attrs.url,
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
            alwaysOnTop: attrs.alwaysOnTop,
            visibility: attrs.isSelected,
            wfsFilter: attrs.wfsFilter
        },
        options ={
            xhrParameters: attrs.isSecured ? {withCredentials: true} : null,
            clusterGeometryFunction: function (feature) {
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
            style: this.getStyleFunction(attrs),
            featuresFilter: this.getFeaturesFilterFunction(attrs),
            beforeLoading: function(visibility){
                if (Radio.request("Map", "getInitialLoading") === 0 && visibility) {
                    Radio.trigger("Util", "showLoader");
                }
            },
            afterLoading: function(visibility){
                if (visibility) {
                    Radio.trigger("Util", "hideLoader");
                }
            }
        };
    this.layer = wfs.createLayer(rawLayerAttributes, layerParams, options);
    return options;
};

/**
 * 
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
WFSLayer.prototype.getFeaturesFilterFunction = function (attrs) {
  return function(features){
        //only use features with a geometry
        let filteredFeatures =  features.filter(function (feature) {
            return feature.getGeometry() !== undefined;
        });
        if(attrs.bboxGeometry){
            filteredFeatures = filteredFeatures.filter(function (feature) {
                // test if the geometry and the passed extent intersect
                return attrs.bboxGeometry.intersectsExtent(feature.getGeometry().getExtent());
            });
        }
        return filteredFeatures;
    }
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
WFSLayer.prototype.getStyleFunction = function (attrs) {
    const styleId = attrs.styleId,
            styleModel = Radio.request("StyleList", "returnModelById", styleId);
        let isClusterFeature = false,
        style = null;

        if (styleModel !== undefined) {
            style = function (feature) {
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