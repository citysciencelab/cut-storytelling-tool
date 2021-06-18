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
    toggleSwiper ({commit, state}, id) {
        commit("setSwiperActive", !state.swiper.active);

        const secondIdPart = "_secondLayer",
            secondId = !id.endsWith(secondIdPart) ? id + secondIdPart : id,
            layerModel = Radio.request("ModelList", "getModelByAttributes", {id: state.swiper.active ? id : secondId});

        if (state.swiper.active) {
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

                Radio.trigger("WMS-T", "updateTime", id, TIME);
                Radio.trigger("ModelList", "setModelAttributesById", id, {transparency});
                commit("setTimeSliderDefaultValue", TIME);
            }
            Radio.trigger("ModelList", "removeModelsById", secondId);
            Radio.trigger("Parser", "removeItem", secondId);
        }
        Radio.trigger("Util", "refreshTree");
    }
};

export default actions;
