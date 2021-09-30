import store from "../../app-store";
import mapCollection from "../../dataStorage/mapCollection.js";

/**
 * Creates a layer object to extend from.
 * @param {Object} attrs attributes of the layer
 * @param {ol.Layer} layer the new created layer
 * @param {Boolean} [initialize=true] to be set to false, if layer is no Child-Layer
 * @returns {void}
 */
export default function Layer (attrs, layer, initialize = true) {
    const defaults = {
        hitTolerance: 0,
        isNeverVisibleInTree: false,
        isRemovable: false,
        isSelected: false,
        isSettingVisible: false,
        isVisibleInMap: false,
        layerInfoClicked: false,
        singleBaselayer: false,
        legend: true,
        maxScale: "1000000",
        minScale: "0",
        selectionIDX: 0,
        showSettings: true,
        styleable: false,
        supported: ["2D"],
        transparency: 0,
        isOutOfRange: undefined,
        isSecured: false,
        domId: "layer-list-group-item-" + attrs.id,
        showTopicText: i18next.t("common:tree.showTopic"),
        removeTopicText: i18next.t("common:tree.removeTopicText"),
        changeClassDivisionText: i18next.t("common:tree.changeClassDivision"),
        transparencyText: i18next.t("common:tree.transparency"),
        increaseTransparencyText: i18next.t("common:tree.increaseTransparency"),
        reduceTransparencyText: i18next.t("common:tree.reduceTransparency"),
        removeLayerText: i18next.t("common:tree.removeLayer"),
        levelUpText: i18next.t("common:tree.levelUp"),
        levelDownText: i18next.t("common:tree.levelDown"),
        settingsText: i18next.t("common:tree.settings"),
        infosAndLegendText: i18next.t("common:tree.infosAndLegend")
    };

    this.layer = layer;
    this.attributes = {...Object.assign({}, this.layer.values_, defaults, attrs)};
    delete this.attributes.source;
    if (initialize) {
        this.initialize(attrs);
    }
    else if (attrs.isSelected === true || Radio.request("Parser", "getTreeType") === "light") {
        this.setIsVisibleInMap(typeof attrs.isSelected !== "boolean" ? false : attrs.isSelected);
    }
    this.checkForScale(Radio.request("MapView", "getOptions"));
    this.registerInteractionMapViewListeners();
}
/**
 * Initalizes the layer. Sets property singleBaselayer and sets the layer visible, if selected in attributes or treetype light.
 * @param {Object} attrs attributes of the layer
 * @returns {void}
 */
Layer.prototype.initialize = function (attrs) {
    if (store.state.configJson?.Portalconfig.singleBaselayer !== undefined) {
        this.set("singleBaselayer", store.state.configJson?.Portalconfig.singleBaselayer);
    }

    if (attrs.isSelected === true || Radio.request("Parser", "getTreeType") === "light") {
        this.updateLayerTransparency();
        this.setIsVisibleInMap(typeof attrs.isSelected !== "boolean" ? false : attrs.isSelected);
        this.set("isRemovable", store.state.configJson?.Portalconfig.layersRemovable);
        mapCollection.getMap(store.state.Map.mapId, store.state.Map.mapMode).addLayer(this.layer);
    }
    else {
        this.layer.setVisible(false);
    }
};
/**
 * To be overwritten, does nothing.
 * @returns {void}
 */
Layer.prototype.createLayer = function () {
    // do in children
    console.warn("function Layer.createLayer must be overwritten in extended layers!");
};
/**
 * To be overwritten, does nothing.
 * @returns {void}
 */
Layer.prototype.createLegend = function () {
    // do in children
    console.warn("function Layer.createLegend must be overwritten in extended layers!");
};
/**
* Register interaction with map view. Listens to change of cale.
* @listens Core#RadioTriggerMapViewChangedOptions
* @returns {void}
*/
Layer.prototype.registerInteractionMapViewListeners = function () {
    Radio.channel("MapView").on({
        "changedOptions": function (options) {
            this.checkForScale(options);
        }
    }, this);
};
/**
 * Setter for ol/layer.setMaxResolution
 * @param {Number} value Maximum resolution of layer
 * @returns {void}
 */
Layer.prototype.setMaxResolution = function (value) {
    this.layer.setMaxResolution(value);
};
/**
 * Setter for ol/layer.setMinResolution
 * @param {Number} value Minimum resolution of layer
 * @returns {void}
 */
Layer.prototype.setMinResolution = function (value) {
    this.layer.setMinResolution(value);
};
/**
 * Removes the layer from the map and the collection
 * @returns {void}
 */
Layer.prototype.removeLayer = function () {
    const map = mapCollection.getMap(store.state.Map.mapId, store.state.Map.mapMode);

    this.setIsVisibleInMap(false);
    Radio.trigger("ModelList", "removeLayerById", this.get("id"));
    map.removeLayer(this.layer);
};
/**
 * Toggles the attribute isSelected. Calls Function setIsSelected.
 * @returns {void}
 */
Layer.prototype.toggleIsSelected = function () {
    this.setIsSelected(this.attributes.isSelected === undefined ? true : !this.attributes.isSelected);
};

/**
 * Checks whether the layer is visible or not based on the scale.
 * @param {object} options - of the map, contains scale of the map
 * @returns {void}
 **/
Layer.prototype.checkForScale = function (options) {
    const lastValue = this.get("isOutOfRange");

    if (options && parseFloat(options.scale, 10) <= parseInt(this.get("maxScale"), 10) && parseFloat(options.scale, 10) >= parseInt(this.get("minScale"), 10)) {
        this.set("isOutOfRange", false);
        if (lastValue !== false) {
            Radio.trigger("Menu", "change:isOutOfRange", this, false);
        }
    }
    else {
        this.set("isOutOfRange", true);
        if (lastValue !== true) {
            Radio.trigger("Menu", "change:isOutOfRange", this, true);
        }
    }
};
/**
 * If a single WMS-T is shown: Remove the TimeSlider.
 * If two WMS-T are shown: Remove the LayerSwiper; depending if the original layer was closed, update the layer with a new time value.
 * @returns {void}
 */
Layer.prototype.removeTimeLayer = function () {
    const id = this.get("id");

    // If the swiper is active, two WMS-T are currently active
    if (store.getters["WmsTime/layerSwiper"].active) {
        if (!id.endsWith(store.getters["WmsTime/layerAppendix"])) {
            this.setIsSelected(true);
        }
        store.dispatch("WmsTime/toggleSwiper", id);
    }
    else {
        store.commit("WmsTime/setTimeSliderActive", {active: false, currentLayerId: ""});
    }
};
/**
 * Setter for isVisibleInMap and setter for layer.setVisible
 * @param {Boolean} newValue Flag if layer is visible in map
 * @returns {void}
 */
Layer.prototype.setIsVisibleInMap = function (newValue) {
    const lastValue = this.get("isVisibleInMap");

    this.set("isVisibleInMap", newValue);
    this.layer.setVisible(newValue);
    if (lastValue !== newValue) {
        // here it is possible to chanhe the layer visibility-info in state and listen to it e.g. in LegendWindow
        // e.g. store.dispatch("Map/toggleLayerVisibility", {layerId: this.get("id")});
        Radio.trigger("Layer", "layerVisibleChanged", this.get("id"), this.get("isVisibleInMap"), this);
    }
};
/**
 * Setter for transparency and setter for opacitiy of the layer.
 * @param {Number} newValue Tranparency in percent
 * @returns {void}
 */
Layer.prototype.setTransparency = function (newValue) {
    const transparency = parseInt(newValue, 10),
        opacity = (100 - transparency) / 100;

    this.set("transparency", transparency);
    this.layer.setOpacity(opacity);
};
/**
 * Decreases layer transparency by 10 percent
 * @return {void}
 */
Layer.prototype.decTransparency = function () {
    const transparency = parseInt(this.get("transparency"), 10);

    if (transparency <= 100 && transparency > 0) {
        this.setTransparency(transparency - 10);
        Radio.trigger("Menu", "rerender");
        Radio.trigger("MenuSelection", "rerender");
    }
};
/**
 * Increases layer transparency by 10 percent.
 * @return {void}
 */
Layer.prototype.incTransparency = function () {
    const transparency = parseInt(this.get("transparency"), 10);

    if (transparency <= 90) {
        this.setTransparency(transparency + 10);
        Radio.trigger("Menu", "rerender");
        Radio.trigger("MenuSelection", "rerender");
    }
};
/**
 * Transforms transparency into opacity and sets opacity on layer.
 * @return {void}
 */
Layer.prototype.updateLayerTransparency = function () {
    const opacity = (100 - parseInt(this.get("transparency"), 10)) / 100;

    this.layer.setOpacity(opacity);
};
/**
 * Setter for isVisibleInTree
 * @param {Boolean} newValue flag if layer is visible in tree
 * @returns {void}
 */
Layer.prototype.setIsVisibleInTree = function (newValue) {
    this.set("isVisibleInTree", newValue);
    Radio.trigger("Menu", "change:isVisibleInTree", this);
};
/**
 * Resets selectionIDX property; 0 is defined as initial value and the layer will be acknowledged as
 * newly added for the sake of initial positioning
 * @returns {void}
 */
Layer.prototype.resetSelectionIDX = function () {
    this.setSelectionIDX(0);
};
/**
 * Setter for selectionIDX
 * @param {String} newValue the selectionIDX
 * @returns {void}
 */
Layer.prototype.setSelectionIDX = function (newValue) {
    this.set("selectionIDX", parseInt(newValue, 10));
};
/**
 * Setter for isSettingVisible
 * @param {Boolean} newValue flag if layer settings are visible
 * @returns {void}
 */
Layer.prototype.setIsSettingVisible = function (newValue) {
    this.set("isSettingVisible", newValue);
};
/**
 * Setter for layerInfoChecked
 * @param {Boolean} newValue flag if layer info is checked
 * @returns {void}
 */
Layer.prototype.setLayerInfoChecked = function (newValue) {
    this.set("layerInfoChecked", newValue);
};
/**
 * Toggles the attribute isSettingVisible. Sets the settings of all other layers to invisible.
 * @return {void}
 */
Layer.prototype.toggleIsSettingVisible = function () {
    const layers = Radio.request("ModelList", "getCollection"),
        oldValue = this.attributes.isSettingVisible;

    layers.setIsSettingVisible(false);
    this.setIsSettingVisible(!oldValue);
    Radio.trigger("Menu", "renderSetting");
    Radio.trigger("MenuSelection", "renderSetting");
};
/**
 * Sets the attribute isSelected and sets the layers visibility. If newValue is false, the layer is removed from map.
 * If configured and the layer is a baseLayer, the other selected baseLayers are deselected.
 * @param {Boolean} newValue true, if layer is selected
 * @returns {void}
 */
Layer.prototype.setIsSelected = function (newValue) {
    const map = mapCollection.getMap(store.state.Map.mapId, store.state.Map.mapMode),
        treeType = Radio.request("Parser", "getTreeType");

    this.set("isSelected", newValue);
    handleSingleBaseLayer(newValue, this, map);
    this.setIsVisibleInMap(newValue);
    if (treeType !== "light") {
        this.resetSelectionIDX();
    }

    if (newValue) {
        Radio.trigger("Map", "addLayerToIndex", [this.layer, this.get("selectionIDX")]);
    }
    else {
        map.removeLayer(this.layer);
    }
    if (treeType !== "light" || store.state.mobile) {
        Radio.trigger("ModelList", "updateLayerView");
        Radio.trigger("ModelList", "updateSelection", this);
        Radio.trigger("Menu", "rerender");
    }
};
/**
* Toggles the attribute isVisibleInMap. If is true, the layer is set visible.
* @return {void}
*/
Layer.prototype.toggleIsVisibleInMap = function () {
    if (this.get("isVisibleInMap") === true) {
        this.setIsVisibleInMap(false);
    }
    else {
        this.setIsSelected(true);
    }
    if (Radio.request("Parser", "getTreeType") !== "light" || store.state.mobile) {
        Radio.trigger("MenuSelection", "rerender");
    }
};
/**
 * Refresh layerSource when updated,
 * e.g. needed because wmts source is created asynchronously.
 * @returns {void}
 */
Layer.prototype.updateLayerSource = function () {
    const layer = Radio.request("Map", "getLayerByName", this.get("name"));

    if (layer && this.get("layerSource") !== null) {
        layer.setSource(this.get("layerSource"));
        layer.getSource().refresh();
    }
};
/**
 * Change language - sets default values for the language
 * @returns {void}
 */
Layer.prototype.changeLang = function () {
    this.attributes.selectedTopicsText = i18next.t("common:tree.removeSelection");
    this.attributes.infosAndLegendText = i18next.t("common:tree.infosAndLegend");
    this.attributes.removeTopicText = i18next.t("common:tree.removeTopic");
    this.attributes.showTopicText = i18next.t("common:tree.showTopic");
    this.attributes.securedTopicText = i18next.t("common:tree.securedTopic");
    this.attributes.changeClassDivisionText = i18next.t("common:tree.changeClassDivision");
    this.attributes.settingsText = i18next.t("common:tree.settings");
    this.attributes.increaseTransparencyText = i18next.t("common:tree.increaseTransparency");
    this.attributes.reduceTransparencyText = i18next.t("common:tree.reduceTransparency");
    this.attributes.removeLayerText = i18next.t("common:tree.removeLayer");
    this.attributes.levelUpText = i18next.t("common:tree.levelUp");
    this.attributes.levelDownText = i18next.t("common:tree.levelDown");
    this.attributes.transparencyText = i18next.t("common:tree.transparency");
};
/**
 * Calls Collection function moveModelDown
 * @return {void}
 */
Layer.prototype.moveDown = function () {
    Radio.trigger("ModelList", "moveModelInTree", this, -1);
};
/**
 * Calls Collection function moveModelUp
 * @return {void}
 */
Layer.prototype.moveUp = function () {
    Radio.trigger("ModelList", "moveModelInTree", this, 1);
};
/**
 * Called from setSelected, handles singleBaseLayer and timelayers.
 * @param {Boolean} isSelected true, if layer is selected
 * @param {ol.Layer} layer the dedicated layer
 * @param {ol.Map} map the current map
 * @returns {void}
 */
function handleSingleBaseLayer (isSelected, layer, map) {
    const id = layer.get("id"),
        layerGroup = Radio.request("ModelList", "getModelsByAttributes", {parentId: layer.get("parentId")}),
        singleBaselayer = layer.get("singleBaselayer") && layer.get("parentId") === "Baselayer",
        timeLayer = layer.get("typ") === "WMS" && layer.get("time");

    if (isSelected) {
        // This only works for treeType 'custom', otherwise the parentId is not set on the layer
        if (singleBaselayer) {
            layerGroup.forEach(aLayer => {
                // folders parentId is baselayer too, but they have not a function checkForScale
                if (aLayer.get("id") !== id && typeof aLayer.checkForScale === "function") {
                    aLayer.set("isSelected", false);
                    aLayer.set("isVisibleInMap", false);
                    if (aLayer.get("layer") !== undefined) {
                        aLayer.get("layer").setVisible(false);
                    }
                    map.removeLayer(aLayer.get("layer"));
                    // This makes sure that the Oblique Layer, if present in the layerList, is not selectable if switching between baseLayers
                    aLayer.checkForScale(Radio.request("MapView", "getOptions"));
                }
            });
            Radio.trigger("Menu", "rerender");
        }
        if (timeLayer) {
            store.commit("WmsTime/setTimeSliderActive", {active: true, currentLayerId: id});
        }
    }
    else if (timeLayer) {
        this.removeTimeLayer();
    }
}

/**
 * Initiates the presentation of layer information.
 * @returns {void}
 */
Layer.prototype.showLayerInformation = function () {
    let cswUrl = null,
        showDocUrl = null,
        layerMetaId = null;

    if (this.get("datasets") && Array.isArray(this.get("datasets")) && this.get("datasets")[0] !== null && typeof this.get("datasets")[0] === "object") {
        cswUrl = this.get("datasets")[0]?.csw_url ? this.get("datasets")[0].csw_url : null;
        showDocUrl = this.get("datasets")[0]?.show_doc_url ? this.get("datasets")[0].show_doc_url : null;
        layerMetaId = this.get("datasets")[0]?.md_id ? this.get("datasets")[0].md_id : null;
    }
    const metaID = [],
        name = this.get("name");

    metaID.push(layerMetaId);

    store.dispatch("LayerInformation/layerInfo", {
        "id": this.get("id"),
        "metaID": layerMetaId,
        "metaIdArray": metaID,
        "layername": name,
        "url": this.get("url"),
        "typ": this.get("typ"),
        "cswUrl": cswUrl,
        "showDocUrl": showDocUrl,
        "urlIsVisible": this.get("urlIsVisible")
    });

    store.dispatch("LayerInformation/activate", true);
    store.dispatch("LayerInformation/additionalSingleLayerInfo");
    store.dispatch("LayerInformation/setMetadataURL", layerMetaId);
    store.dispatch("Legend/setLayerIdForLayerInfo", this.get("id"));
    store.dispatch("Legend/setLayerCounterIdForLayerInfo", Date.now());
    if (typeof this.createLegend === "function") {
        this.createLegend();
    }
    this.setLayerInfoChecked(true);
};
/**
 * Setter for legend, commits the legend to vue store using "Legend/setLegendOnChanged"
 * @param {String} value legend
 * @returns {void}
 */
Layer.prototype.setLegend = function (value) {
    this.set("legend", value);
    store.dispatch("Legend/setLegendOnChanged", value);
};

// backbone-relevant functions (may be removed if all layers are no longer backbone models):
Layer.prototype.set = function (arg1, arg2) {
    if (typeof arg1 === "object") {
        Object.keys(arg1).forEach(key => {
            this.attributes[key] = arg1[key];
        });
    }
    else if (typeof arg1 === "string") {
        this.attributes[arg1] = arg2;
    }
};
Layer.prototype.get = function (key) {
    if (key === "layer") {
        return this.layer;
    }
    else if (key === "layerSource") {
        return this.layer.getSource();
    }
    return this.attributes[key];
};
Layer.prototype.has = function (key) {
    if (key === "layer") {
        return this.layer !== undefined;
    }
    else if (key === "layerSource") {
        return this.layer.getSource() !== undefined;
    }
    return this.attributes[key] !== undefined;
};
Layer.prototype.getLayerStatesArray = function () {
    return this.layer.getLayerStatesArray();
};
Layer.prototype.toJSON = function () {
    return JSON.parse(JSON.stringify(this.attributes));
};
Layer.prototype.on = function () {
    // do nothing
};
Layer.prototype.off = function () {
    // do nothing
};
Layer.prototype.removeEventListener = function () {
    // do nothing
};
Layer.prototype.addEventListener = function () {
    // do nothing
};
Layer.prototype.trigger = function () {
    // do nothing
};
Layer.prototype.prepareLayerObject = function () {
    // do nothing
};
Layer.prototype.updateSource = function () {
    // do nothing
};
