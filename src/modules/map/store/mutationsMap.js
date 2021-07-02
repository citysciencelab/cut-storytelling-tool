import {generateSimpleMutations} from "../../../app-store/utils/generators";
import initialState from "./stateMap";
import getters from "./gettersMap";
import BaseLayer from "ol/layer/Base";

const mutations = {
    ...generateSimpleMutations(initialState),
    /**
     * Sets the visibility of a layer.
     * @param {Object} state state object
     * @param {Object} payload parameter object
     * @param {String} payload.layerId id of layer to set visibility of
     * @param {Boolean} payload.visibility isVisible
     * @returns {void}
     */
    setLayerVisibility (state, {layerId, visibility}) {
        getters.layers(state)[layerId].visibility = visibility;
    },
    /**
     * Sets the opacity of a layer.
     * @param {Object} state state object
     * @param {Object} payload parameter object
     * @param {String} payload.layerId id of layer to change opacity of
     * @param {Number} payload.opacity opacity value in range (0, 1)
     * @returns {void}
     */
    setLayerOpacity (state, {layerId, opacity}) {
        getters.layers(state)[layerId].opacity = opacity;
    },
    /**
     * Sets the scales for the map.
     * @param {Object} state state object
     * @param {Object} payload parameter object
     * @param {String} payload.scales list of scales
     * @returns {void}
     */
    setScales (state, {scales}) {
        state.scales = scales;
    },

    /**
     * Adds the given layer to the top of this map.
     * @param {Object} state - The map state.
     * @param {module:ol/layer/Base} layer - The given layer.
     * @returns {void}
     */
    addLayerToMap (state, layer) {
        if (layer instanceof BaseLayer) {
            state.map.addLayer(layer);
        }
    },

    /**
     * Removes the given layer from the map.
     * @param {Object} state - The map state.
     * @param {module:ol/layer/Base} layer - The given layer.
     * @returns {void}
     */
    removeLayerFromMap (state, layer) {
        if (state.map && layer instanceof BaseLayer) {
            state.map.removeLayer(layer);
        }
    },
    /**
     * Adds a layerId to the array of all complete loaded layers.
     * @param {Object} state The state object.
     * @param {String} layerId The ID of the layer that is loaded completely
     * @returns {void}
     */
    addLoadedLayerId (state, layerId) {
        state.loadedLayers.push(layerId);
    }
};

export default mutations;
