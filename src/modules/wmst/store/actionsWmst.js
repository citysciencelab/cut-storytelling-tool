const actions = {
    toggleSwiper ({commit, state}, id) {
        commit("setSwiperActive", !state.swiper.active);

        if (state.swiper.active) {
            const layerModel = Radio.request("ModelList", "getModelByAttributes", {id}),
                secondId = id + "_secondLayer";

            // TODO: Add the layer to the tree and the map; below doesn't work yet
            layerModel.set("id", secondId);

            Radio.trigger("Parser", "addItem", layerModel);
            Radio.trigger("ModelList", "addModelByAttributes", {id});
        }
        else {
            /*
            TODO
                Wenn hinzugefügter Layer (id + '$$second$$'):
                    - Aktuelle Zeitdaten aus dem hinzugefügten Layer in den originalen Layer übergeben
            TODO:
                Immer:
                    - Layer mit Id "id + $$second$$" deaktivieren und aus der ModelList entfernen
            */
        }
    }
};

export default actions;
