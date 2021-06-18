const actions = {
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
