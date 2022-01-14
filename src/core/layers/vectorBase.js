import Layer from "./layer";
import {vectorBase} from "masterportalAPI/src";
/**
 * Creates a layer of type vectorBase.
 * @param {Object} attrs  attributes of the layer
 * @returns {void}
 */
export default function VectorBaseLayer (attrs) {
    const defaults = {
        supported: ["2D", "3D"],
        isClustered: false,
        altitudeMode: "clampToGround",
        useProxy: false
    };

    this.createLayer(Object.assign(defaults, attrs));
    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs), this.layer, !attrs.isChildLayer);
    this.createLegend();
}
// Link prototypes and add prototype methods, means VectorBaseLayer uses all methods and properties of Layer
VectorBaseLayer.prototype = Object.create(Layer.prototype);

/**
 * creates the layer
 * @param {Object} attr the attributes for the layer
 * @returns {void}
 */
VectorBaseLayer.prototype.createLayer = function (attr) {
    this.layer = vectorBase.createLayer(attr);

    if (attr.isSelected) {
        this.updateSource(this.layer, attr.features);
    }
};

/**
 * Updates the layers source
 * @param {module:ol/layer/Base~BaseLayer} layer The vector base layer.
 * @param {module:ol/Feature~Feature[]} features The ol features.
 * @returns {void}
 */
VectorBaseLayer.prototype.updateSource = function (layer, features) {
    vectorBase.updateSource(layer, features);
};

/**
 * Creates the legend
 * @returns {void}
 */
VectorBaseLayer.prototype.createLegend = function () {
    const styleModel = Radio.request("StyleList", "returnModelById", this.get("styleId"));
    let legend = this.get("legend");

    /**
     * @deprecated in 3.0.0
     */
    if (this.get("legendURL")) {
        if (this.get("legendURL") === "" || this.get("legendURL") === "ignore") {
            legend = false;
        }
        else {
            legend = this.get("legendURL");
        }
    }

    if (styleModel && legend === true) {
        styleModel.getGeometryTypeFromWFS(this.get("url"), this.get("version"), this.get("featureType"), this.get("styleGeometryType"));
        this.setLegend(styleModel.getLegendInfos());
    }
    else if (typeof legend === "string") {
        this.setLegend([legend]);
    }
};
