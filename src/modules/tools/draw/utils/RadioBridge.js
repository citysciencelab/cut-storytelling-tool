/**
 * Listener for changes in tree.
 * @param {Function} handler the handler to call after changes as function(layerModels)
 * @returns {void}
 */
function listenToUpdatedSelectedLayerList (handler) {
    Backbone.Events.listenTo(Radio.channel("ModelList"), {
        "updatedSelectedLayerList": layerModels => {
            if (typeof handler === "function") {
                handler(layerModels);
            }
        }
    });
}

export {
    listenToUpdatedSelectedLayerList
};
