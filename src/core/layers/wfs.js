import {wfs} from "masterportalAPI";
import Layer from "./layer";
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
    };

    this.createLayer(Object.assign(defaults, attrs));

    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs), this.layer, !attrs.isChildLayer);
    this.set("style", this.getStyleFunction(attrs));
    this.prepareFeaturesFor3D(this.layer.getSource().getFeatures());
    if (attrs.clusterDistance) {
        this.set("isClustered", true);
    }
    this.createLegend();
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
            visible: attrs.isSelected
        },
        loadingParams = {
            xhrParameters: attrs.isSecured ? {credentials: "include"} : null,
            propertyname: this.getPropertyname(attrs)
        },
        options = {
            wfsFilter: attrs.wfsFilter,
            clusterGeometryFunction: function (feature) {
                // do not cluster invisible features; can't rely on style since it will be null initially
                if (feature.get("hideInClustering") === true) {
                    return null;
                }
                return feature.getGeometry();
            },
            version: this.getVersion(attrs),
            style: this.getStyleFunction(attrs),
            featuresFilter: this.getFeaturesFilterFunction(attrs),
            beforeLoading: function () {
                if (bridge.getInitialLoadingState() === 0 && (this.layer && this.layer.get("isSelected")) || attrs.isSelected) {
                    bridge.showHideLoader(true);
                }
            },
            afterLoading: function () {
                if ((this.layer && this.layer.get("isSelected")) || attrs.isSelected) {
                    bridge.showHideLoader(false);
                }
            },
            onLoadingError: function (error) {
                console.error("masterportal wfs loading error:", error);
            }
        };

    this.layer = wfs.createLayer(rawLayerAttributes, layerParams, options, loadingParams);
};

/**
 * Returns the version found in attrs, if allowed.
 * @param {Object} attrs  params of the raw layer
 * @returns {String} the version
 */
WFSLayer.prototype.getVersion = function (attrs) {
    const allowedVersions = attrs.allowedVersions,
        isVersionValid = this.checkVersion(attrs.name, attrs.version, allowedVersions);

    if (!isVersionValid) {
        return allowedVersions[0];
    }
    return undefined;
};
/**
 * Returns a function to filter features with.
 * @param {Object} attrs  params of the raw layer
 * @returns {Function} to filter geatures with
 */
WFSLayer.prototype.getFeaturesFilterFunction = function (attrs) {
    return function (features) {
        // only use features with a geometry
        let filteredFeatures = features.filter(function (feature) {
            return feature.getGeometry() !== undefined;
        });

        if (attrs.bboxGeometry) {
            filteredFeatures = filteredFeatures.filter(function (feature) {
                // test if the geometry and the passed extent intersect
                return attrs.bboxGeometry.intersectsExtent(feature.getGeometry().getExtent());
            });
        }
        return filteredFeatures;
    };
};
/**
 * Checks the version of the wfs against allowed versions.
 * @param {String} name name from layer
 * @param {String} version version from wfs
 * @param {String[]} allowedVersions contains the allowed versions
 * @return {Boolean} is version valid
 */
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
/**
 * Returns the propertynames as string.
 * @param {Object} attrs  params of the raw layer
 * @returns {string} the propertynames as string
 */
WFSLayer.prototype.getPropertyname = function (attrs) {
    let propertyname = "";

    if (Array.isArray(attrs.propertyNames)) {
        propertyname = attrs.propertyNames.join(",");
    }
    return propertyname;
};
WFSLayer.prototype.getStyleFunction = function (attrs) {
    const styleId = attrs.styleId,
        styleModel = bridge.getStyleModelById(styleId);
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
/**
 * Updates the layers source by calling refresh at source.
 * @returns {void}
 */
WFSLayer.prototype.updateSource = function () {
    wfs.updateSource(this.layer);
};
/**
 * Creates the legend
 * @returns {void}
 */
WFSLayer.prototype.createLegend = function () {
    const styleModel = bridge.getStyleModelById(this.get("styleId")),
        isSecured = this.attributes.isSecured;
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
    else if (styleModel && legend === true) {
        if (!isSecured) {
            styleModel.getGeometryTypeFromWFS(this.get("url"), this.get("version"), this.get("featureType"), this.get("styleGeometryType"), this.get("useProxy"));
        }
        else if (isSecured) {
            styleModel.getGeometryTypeFromSecuredWFS(this.get("url"), this.get("version"), this.get("featureType"), this.get("styleGeometryType"));
        }
        this.setLegend(styleModel.getLegendInfos());
    }
    else if (typeof legend === "string") {
        this.setLegend([legend]);
    }
};
/**
 * Hides all features by setting style= null for all features.
 * @returns {void}
 */
WFSLayer.prototype.hideAllFeatures = function () {
    const layerSource = this.get("layerSource"),
        features = this.get("layerSource").getFeatures();

    // optimization - clear and re-add to prevent cluster updates on each change
    layerSource.clear();

    features.forEach(function (feature) {
        feature.set("hideInClustering", true);
        feature.setStyle(function () {
            return null;
        });
    }, this);

    layerSource.addFeatures(features);
};
/**
 * Shows all features by setting their style.
 * @returns {void}
 */
WFSLayer.prototype.showAllFeatures = function () {
    const collection = this.get("layerSource").getFeatures();
    let style;

    collection.forEach(function (feature) {
        style = this.getStyleAsFunction(this.get("style"));

        feature.setStyle(style(feature));
    }, this);
};
/**
 * Only shows features that match the given ids.
 * @param {String[]} featureIdList List of feature ids.
 * @returns {void}
 */
WFSLayer.prototype.showFeaturesByIds = function (featureIdList) {
    const layerSource = this.get("layerSource"),
        // featuresToShow is a subset of allLayerFeatures
        allLayerFeatures = layerSource.getFeatures(),
        featuresToShow = featureIdList.map(id => layerSource.getFeatureById(id));

    this.hideAllFeatures();

    // optimization - clear and re-add to prevent cluster updates on each change
    layerSource.clear();

    featuresToShow.forEach(feature => {
        const style = this.getStyleAsFunction(this.get("style"));

        feature.set("hideInClustering", false);
        feature.setStyle(style(feature));
    }, this);

    layerSource.addFeatures(allLayerFeatures);
    bridge.resetVectorLayerFeatures(this.get("id"), allLayerFeatures);
};
/**
 * Returns the style as a function.
 * @param {Function|Object} style ol style object or style function.
 * @returns {Function} - style as function.
 */
WFSLayer.prototype.getStyleAsFunction = function (style) {
    if (typeof style === "function") {
        return style;
    }

    return function () {
        return style;
    };
};
/**
 * Sets Style for layer.
 * @returns {void}
 */
WFSLayer.prototype.styling = function () {
    this.layer.setStyle(this.get("style"));
};
