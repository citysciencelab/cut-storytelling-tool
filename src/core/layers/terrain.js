import Layer from "./layer";
import {terrain} from "masterportalAPI/src";
import getProxyUrl from "../../../src/utils/getProxyUrl";
/**
 * Creates a terrain-layer to display on 3D-map.
 * @param {Object} attrs  attributes of the layer
 * @returns {void}
 */
export default function TerrainLayer (attrs) {
    const defaults = {
        supported: ["3D"],
        showSettings: false,
        selectionIDX: -1,
        useProxy: false
    };

    /**
     * @deprecated in the next major-release!
     * useProxy
     * getProxyUrl()
     */
    if(attrs.useProxy){
        attrs.url = getProxyUrl(this.get("url"));
    }

    this.createLayer(Object.assign(defaults, attrs));
    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs), this.layer, !attrs.isChildLayer);
}
// Link prototypes and add prototype methods, means TerrainLayer uses all methods and properties of Layer
TerrainLayer.prototype = Object.create(Layer.prototype);

/**
 * Creates the layer as a simple object with one function 'setVisible' for calling 'setIsSelected'.
 * @param {Object} attr the attributes for the layer
 * @returns {void}
 */
TerrainLayer.prototype.createLayer = function (attr) {
    this.layer = {
        setVisible:(newValue) => {
            this.setIsSelected(newValue);
        }
    };
    if (attr.isSelected) {
        this.setIsSelected(true);
    }
};

/**
 * Calls masterportalAPI's terrain-layer to set this layer visible.
 * @param {Boolean} newValue if true, layer is visible
 * @returns {void}
 */
TerrainLayer.prototype.setIsSelected = function (newValue) {
    if (Radio.request("Map", "isMap3d") === true) {
        const map3d = Radio.request("Map", "getMap3d");

        terrain.setVisible(newValue, this.attributes, map3d);
        if (this.get("isVisibleInMap") === true) {
            this.createLegend();
        }
    }
};

/**
 * Creates the legend.
 * @returns {void}
 */
TerrainLayer.prototype.createLegend = function () {
    const styleModel = Radio.request("StyleList", "returnModelById", this.get("styleId"));
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
            this.setLegend(styleModel.getLegendInfos());
        }
        else if (typeof legend === "string") {
            this.setLegend([legend]);
        }
};
/**
* Register interaction with map view. Listens to change of scale.
* @returns {void}
*/
TerrainLayer.prototype.registerInteractionMapViewListeners = function () {
    //no listeners shall be registered
}
/**
 * Transforms transparency into opacity and sets opacity on layer.
 * @return {void}
 */
TerrainLayer.prototype.updateLayerTransparency = function () {
     //not needed in 3D
}
/**
 * Sets visible min and max resolution on layer.
 * @returns {void}
 */
TerrainLayer.prototype.setMinMaxResolutions = function () {
    //not needed in 3D
}
