/**
 * Removes the layer with the given id from the modelList.
 * Can be done directly or is no longer needed, if modelList is refactored.
 * @param {String} id of the layer to remove
 * @returns {void}
 */
export function removeLayerByIdFromModelList (id) {
    Radio.trigger("ModelList", "removeLayerById", id);
}
/**
 * Fires if property isOutOfRange changes.
 * Can be done directly or is no longer needed, if menu is refactored.
 * @param {Object} layerModel the layer
 * @param {boolean} value value of outOfRange
 * @returns {void}
 */
export function outOfRangeChanged (layerModel, value) {
    Radio.trigger("Menu", "change:isOutOfRange", layerModel, value);
}
/**
 * Fires if property isVisibleInTree changes.
 * Can be done directly or is no longer needed, if menu is refactored.
 * @param {Object} layerModel the layer
 * @returns {void}
 */
export function isVisibleInTreeChanged (layerModel) {
    Radio.trigger("Menu", "change:isVisibleInTree", layerModel);
}
/**
 * Fires if property isVisibleInMap changes.
 * Can be done directly or is no longer needed, if all layers are handeled by store and modellList is refactored.
 * @param {Object} layerModel the layer
 * @param {boolean} value value of isVisibleInMap
 * @returns {void}
 */
export function layerVisibilityChanged (layerModel, value) {
    Radio.trigger("Layer", "layerVisibleChanged", layerModel.get("id"), value, layerModel);
    Radio.trigger("ModelList", "updatedSelectedLayerList", getLayerModelsByAttributes({isSelected: true, type: "layer"}));
}
/**
 * Triggers adding layer at given index in modelList.
 * Can be done directly or is no longer needed, if modelList is refactored.
 * @param {ol.Layer} layer the layer of the layerModel
 * @param {number} selectionIDX index to insert into list
 * @returns {void}
 */
export function addLayerToIndex (layer, selectionIDX) {
    Radio.trigger("Map", "addLayerToIndex", [layer, selectionIDX]);
}
/**
 * Fires if menu must be rendered.
 * Can be done directly or is no longer needed, if if menu is refactored.
 * @returns {void}
 */
export function renderMenu () {
    Radio.trigger("Menu", "rerender");
}
/**
 * Fires if menu selection must be rendered.
 * Can be done directly or is no longer needed, if if menu is refactored.
 * @returns {void}
 */
export function renderMenuSelection () {
    Radio.trigger("MenuSelection", "rerender");
}
/**
 * Fires if settings in menu must be rendered.
 * Can be done directly or is no longer needed, if if menu is refactored.
 * @returns {void}
 */
export function renderMenuSettings () {
    Radio.trigger("Menu", "renderSetting");
    Radio.trigger("MenuSelection", "renderSetting");
}
/**
 * Updates the layer view in tree and updates selection in tree.
 * Can be done directly or is no longer needed, if if menu is refactored.
 * @param {Object} layerModel the layer
 * @returns {void}
 */
export function updateLayerView (layerModel) {
    Radio.trigger("ModelList", "updateLayerView");
    Radio.trigger("ModelList", "updateSelection", layerModel);
}

/**
 * Returns all layers.
 * Can be done directly or is no longer needed, if if modelList is refactored.
 * @returns {void}
 */
export function getAllLayers () {
    return Radio.request("ModelList", "getCollection");
}
/**
 * Returns the layerModel with the given attributes.
 * Can be done directly or is no longer needed, if if modelList is refactored.
 * @param {Object} attributes of the model to search for
 * @returns {void}
 */
export function getLayerModelsByAttributes (attributes) {
    return Radio.request("ModelList", "getModelsByAttributes", attributes);
}
/**
 * Moves the layer in tree.
 * Can be done directly or is no longer needed, if if modelList is refactored.
 * @param {Object} layerModel the layer
 * @param {number} value -1 moves down and 1 moves up
 * @returns {void}
 */
export function moveModelInTree (layerModel, value) {
    Radio.trigger("ModelList", "moveModelInTree", layerModel, value);
}
/**
 * Listens to changes of attribute SLDBody.
 * Can be done directly or is no longer needed, if if tool styleWMS  and treefilter are refactored.
 * @param {Object} layerModel the layer
 * @returns {void}
 */
export function listenToChangeSLDBody (layerModel) {
    Radio.channel("Layer").on({
        "change:SLDBody": layerModel.updateSourceSLDBody
    });
}

