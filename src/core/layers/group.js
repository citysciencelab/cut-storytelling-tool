import {Group as LayerGroup} from "ol/layer.js";
import store from "../../app-store";
import Layer from "./layer";
import WMSLayer from "./wms";
import WFSLayer from "./wfs";
import WMTSLayer from "./wmts";
import GeoJSONLayer from "./geojson";
import OAFLayer from "./oaf";
import STALayer from "./sta";
import HeatmapLayer from "../../../modules/core/modelList/layer/heatmap";
import * as bridge from "./RadioBridge.js";
/**
 * Creates a layer of typ GROUP.
 * @param {Object} attrs attributes of the layer
 * @returns {void}
 */
export default function GroupedLayers (attrs) {
    const defaults = {
            supported: ["2D", "3D"],
            showSettings: true
        },
        layerSource = this.createLayerSource(Object.assign(defaults, attrs));

    attrs.layerSource = layerSource;
    this.createLayer(Object.assign(defaults, attrs));
    // call the super-layer
    Layer.call(this, Object.assign(defaults, attrs), this.layer, attrs.isChildLayer);
    this.createLegend();

    if (this.get("isVisibleInMap")) {
        this.updateSource();
    }

    this.updateTransparency();
}
// Link prototypes and add prototype methods, means GroupedLayers uses all methods and properties of Layer
GroupedLayers.prototype = Object.create(Layer.prototype);
/**
 * Creates the grouplayer with its layersources
 * @param {Object} attrs attributes of the layer
 * @return {void}
 */
GroupedLayers.prototype.createLayer = function (attrs) {
    const layers = attrs.layerSource.map(layer => {
            return layer.get("layer");
        }),
        groupLayer = new LayerGroup({
            layers: layers,
            visible: false,
            name: attrs.name
        });

    this.layer = groupLayer;
};
/**
 * Creates the layersources.
 * For group layer the layersources are the children.
 * To prevent the layer sources to call layer.initialize() the flag "isChildLayer" is set to true in preparser.
 * @param {Object} attrs attributes of the layer
 * @return {void}
 */
GroupedLayers.prototype.createLayerSource = function (attrs) {
    const layerSource = [];

    attrs.children.forEach(childLayerDefinition => {
        if (childLayerDefinition.typ === "WMS") {
            const layer = new WMSLayer(childLayerDefinition);

            layer.initialize(childLayerDefinition);
            layerSource.push(layer);
        }
        else if (childLayerDefinition.typ === "WMTS") {
            const layer = new WMTSLayer(childLayerDefinition);

            layer.initialize(childLayerDefinition);
            layerSource.push(layer);
        }
        else if (childLayerDefinition.typ === "WFS") {
            if (childLayerDefinition.outputFormat === "GeoJSON") {
                const layer = new GeoJSONLayer(childLayerDefinition);

                layer.initialize(childLayerDefinition);
                layerSource.push(layer);
            }
            const layer = new WFSLayer(childLayerDefinition);

            layer.initialize(childLayerDefinition);
            layerSource.push(layer);
        }
        else if (childLayerDefinition.typ === "OAF") {
            const layer = new OAFLayer(childLayerDefinition);

            layer.initialize(childLayerDefinition);
            layerSource.push(layer);
        }
        else if (childLayerDefinition.typ === "GeoJSON") {
            const layer = new GeoJSONLayer(childLayerDefinition);

            layer.initialize(childLayerDefinition);
            layerSource.push(layer);
        }
        else if (childLayerDefinition.typ === "SensorThings") {
            const sensorLayer = new STALayer(childLayerDefinition);

            sensorLayer.initialize(childLayerDefinition);
            sensorLayer.initializeSensorThings();
            layerSource.push(sensorLayer);
        }
        else if (childLayerDefinition.typ === "Heatmap") {
            const layer = new HeatmapLayer(childLayerDefinition);

            layer.initialize(childLayerDefinition);
            layerSource.push(layer);
        }
        layerSource[layerSource.length - 1].prepareLayerObject();
    }, this);
    return layerSource;
};
/**
 * Creates the legend of each child layer
 * @return {void}
 */
GroupedLayers.prototype.createLegend = function () {
    this.get("layerSource").forEach(layerSource => {
        layerSource.createLegend();
    });
};
/**
 * runs the function updateSource() in all layer sources, that support this function.
 * Not all layer types support the function updateSource().
 * @returns {void}
 */
GroupedLayers.prototype.updateSource = function () {
    this.get("layerSource").forEach(layerSource => {
        if (typeof layerSource.updateSource !== "undefined") {
            layerSource.updateSource();
        }
    }, this);
};
/**
 * Sets the groupedLayers transparency according to the medium of it's children.
 * @returns {void}
 */
GroupedLayers.prototype.updateTransparency = function () {
    let transparencies = 0;

    this.get("children").forEach(childLayer => {
        if (Object.prototype.hasOwnProperty.call(childLayer, "transparency")) {
            transparencies += childLayer.transparency;
        }
    }, this);
    if (transparencies > 0) {
        this.set("transparency", transparencies / this.get("children").length);
    }
};
/**
 * This function start the presentation of the layerinformation and legend.
 * @returns {void}
 */
GroupedLayers.prototype.showLayerInformation = function () {
    const metaID = [],
        cswUrls = [],
        showDocUrls = [],
        name = this.get("name"),
        layerNames = [],
        additionalLayers = [];

    if (!this.get("layerSource") && typeof this.prepareLayerObject === "function") {
        // NOTICE can be removed, if all layers are refactored
        this.prepareLayerObject();
    }
    this.get("children").forEach(layer => {
        let cswUrl = null,
            showDocUrl = null,
            layerMetaId = null;

        if (layer.datasets && Array.isArray(layer.datasets) && layer.datasets[0] !== null && typeof layer.datasets[0] === "object") {
            cswUrl = Object.prototype.hasOwnProperty.call(layer.datasets[0], "csw_url") ? layer.datasets[0].csw_url : null;
            showDocUrl = Object.prototype.hasOwnProperty.call(layer.datasets[0], "show_doc_url") ? layer.datasets[0].show_doc_url : null;
            layerMetaId = Object.prototype.hasOwnProperty.call(layer.datasets[0], "md_id") ? layer.datasets[0].md_id : null;
        }

        metaID.push(layerMetaId);
        cswUrls.push(cswUrl);
        showDocUrls.push(showDocUrl);
        layerNames.push(layer.name || null);

        const layerInfo = {
            "metaID": layerMetaId,
            "layerName": layer.name || null,
            "cswUrl": cswUrl
        };

        additionalLayers.push(layerInfo);
    });

    store.dispatch("LayerInformation/layerInfo", {
        "id": this.get("id"),
        "metaID": metaID[0],
        "metaIdArray": metaID,
        "layername": name,
        "layerNames": layerNames,
        "url": null,
        "typ": null,
        "cswUrl": cswUrls[0],
        "showDocUrl": showDocUrls[0],
        "urlIsVisible": this.get("urlIsVisible")
    });

    store.dispatch("LayerInformation/activate", true);
    store.dispatch("LayerInformation/setCurrentLayerName", layerNames[0]);
    store.dispatch("LayerInformation/additionalSingleLayerInfo");
    store.dispatch("LayerInformation/setMetadataURL", metaID[0]);
    store.dispatch("LayerInformation/setAdditionalLayer", additionalLayers);
    store.dispatch("Legend/setLayerIdForLayerInfo", this.get("id"));
    store.dispatch("Legend/setLayerCounterIdForLayerInfo", Date.now());

    if (this.createLegend && typeof this.createLegend === "function") {
        this.createLegend();
    }
    this.setLayerInfoChecked(true);
};
/**
* Checks all layer sources by scale and sets attribute isOutOfRange to true to disable the layer in tree
* 1: Check if parent min- and max scale is met, else disable group layer
* 2: If group layer's min- and max scales are met, check out single child layers
* 3: If one single child layer is in range, set isOutOfRange to false
* @param {object} options containing the scale to check
* @returns {void}
**/
GroupedLayers.prototype.checkForScale = function (options) {
    if (!options || !options.scale) {
        return;
    }
    const currentScale = parseFloat(options.scale, 10),
        lastValue = this.get("isOutOfRange");
    let childLayersAreOutOfRange = true,
        groupLayerIsOutOfRange = false;

    if (currentScale > parseInt(this.get("maxScale"), 10) || currentScale < parseInt(this.get("minScale"), 10)) {
        groupLayerIsOutOfRange = true;
    }
    else {
        this.get("children").forEach(layerSource => {
            if (currentScale <= parseInt(layerSource.maxScale || this.get("maxScale"), 10) &&
                currentScale >= parseInt(layerSource.minScale || this.get("minScale"), 10)) {
                childLayersAreOutOfRange = false;
            }
        }, this);
    }

    this.set("isOutOfRange", groupLayerIsOutOfRange || childLayersAreOutOfRange);
    if (lastValue !== this.get("isOutOfRange")) {
        bridge.outOfRangeChanged(this, this.get("isOutOfRange"));
    }
};
/**
 * Shows all features by setting their style.
 * @returns {void}
 */
GroupedLayers.prototype.showAllFeatures = function () {
    this.attributes.layerSource.forEach(layer => {
        layer.showAllFeatures();
    });
};
/**
 * Only shows features that match the given ids.
 * @param {String[]} featureIdList List of feature ids.
 * @returns {void}
 */
GroupedLayers.prototype.showFeaturesByIds = function (featureIdList) {
    this.attributes.layerSource.forEach(layer => {
        layer.showFeaturesByIds(featureIdList);
    });
};
/**
 * Hides all features by setting style= null for all features.
 * @returns {void}
 */
GroupedLayers.prototype.hideAllFeatures = function () {
    this.attributes.layerSource.forEach(layer => {
        layer.hideAllFeatures();
    });
};
/**
 * Get grouped layers as array.
 * @returns {Layer[]} array of Layers
 */
GroupedLayers.prototype.getLayers = function () {
    return this.attributes.layerSource;
};
