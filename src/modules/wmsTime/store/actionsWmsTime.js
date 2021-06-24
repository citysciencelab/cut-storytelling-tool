import {getRenderPixel} from "ol/render";

const actions = {
    /**
     * Toggles the LayerSwiper.
     * If the LayerSwiper is deactivated, the second layer is deactivated and removed from the ModelList.
     *
     * @param {String} id Id of the Layer that should be toggled.
     * @fires Core#RadioTriggerUtilRefreshTree
     * @fires Core.ModelList#RadioTriggerModelListAddModelsByAttributes
     * @fires Core.ModelList#RadioRequestModelListGetModelByAttributes
     * @fires Core.ModelList#RadioTriggerModelListRemoveModelsById
     * @fires Core.ModelList#RadioTriggerModelListSetModelAttributesById
     * @fires Core.ConfigLoader#RadioTriggerParserAddLayer
     * @fires Core.ConfigLoader#RadioTriggerParserRemoveItem
     * @returns {void}
     */
    toggleSwiper ({commit, state, rootGetters}, id) {
        commit("setLayerSwiperActive", !state.layerSwiper.active);

        const secondIdPart = "_secondLayer",
            secondId = !id.endsWith(secondIdPart) ? id + secondIdPart : id,
            layerModel = Radio.request("ModelList", "getModelByAttributes", {id: state.layerSwiper.active ? id : secondId});

        if (state.layerSwiper.active) {
            const {name, parentId, level, layers, url, version, time} = layerModel.attributes;

            Radio.trigger("Parser", "addLayer",
                name + "_second", secondId, parentId,
                level, layers, url,
                version, true, time
            );
            Radio.trigger("ModelList", "addModelsByAttributes", {id: secondId});
        }
        else {
            // If the button of the "original" window is clicked, it is assumed, that the time value selected in the added window is desired to be further displayed.
            if (!id.endsWith(secondIdPart)) {
                const {TIME} = layerModel.get("layerSource").params_,
                    {transparency} = layerModel.attributes;

                Radio.trigger("WmsTime", "updateTime", id, TIME);
                Radio.trigger("ModelList", "setModelAttributesById", id, {transparency});
                commit("setTimeSliderDefaultValue", TIME);
            }
            rootGetters["Map/map"].removeLayer(Radio.request("ModelList", "getModelByAttributes", {id: secondId}).get("layer"));
            Radio.trigger("ModelList", "removeModelsById", secondId);
            Radio.trigger("Parser", "removeItem", secondId);
        }
        Radio.trigger("Util", "refreshTree");
    },
    /**
     * Sets the postion of the layerSwiper to state according to the x-coordinate of the mousedown event.
     * Adds the event listeners to the target layer on pre- and postRender.
     *
     * @param {MouseEvent.mousemove} event DOM Event.
     * @returns {void}
     */
    moveSwiper ({state, commit, rootGetters, dispatch}, event) {
        const {clientX} = event;

        if (state.layerSwiper.isMoving) {
            commit("setLayerSwiperValueX", clientX);
            commit("setLayerSwiperStyleLeft", clientX);
            rootGetters["Map/map"].render();
            state.layerSwiper.targetLayer.once("prerender", renderEvent => {
                dispatch("drawLayer", renderEvent);
            });
            state.layerSwiper.targetLayer.once("postrender", ({context}) => {
                context.restore();
            });
        }
    },
    /**
     * Manipulates the width of the target layer according to the position of the layerSwiper.
     *
     * @param {module:ol/render/Event} renderEvent The render event from the target layer.
     * @returns {void}
     */
    drawLayer ({state, rootGetters}, renderEvent) {
        const {context} = renderEvent,
            mapSize = rootGetters["Map/map"].getSize(),
            width = state.layerSwiper.valueX,
            topLeft = getRenderPixel(renderEvent, [width, 0]),
            topRight = getRenderPixel(renderEvent, [mapSize[0], 0]),
            bottomLeft = getRenderPixel(renderEvent, [width, mapSize[1]]),
            bottomRight = getRenderPixel(renderEvent, mapSize);

        context.save();
        context.beginPath();
        context.moveTo(topLeft[0], topLeft[1]);
        context.lineTo(bottomLeft[0], bottomLeft[1]);
        context.lineTo(bottomRight[0], bottomRight[1]);
        context.lineTo(topRight[0], topRight[1]);
        context.closePath();
        context.clip();
    }
};

export default actions;
