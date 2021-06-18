import {getRenderPixel} from "ol/render";

const actions = {
    toggleSwiper ({commit, state}, id) {
        commit("setSwiperActive", !state.layerSwiper.active);

        if (state.layerSwiper.active) {
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
    },
    // LayerSwiper actions
    moveSwiper ({state, commit}, event) {
        const {clientX} = event;

        if (state.layerSwiper.isMoving) {
            const map = state.layerSwiper.mapObject;

            commit("setLayerSwiperValueX", clientX);
            commit("setLayerSwiperStyleLeft", clientX);
            map.render();
            state.layerSwiper.targetLayer.on("prerender", (renderEvent) => {
                const ctx = renderEvent.context,
                    mapSize = map.getSize(),
                    width = state.layerSwiper.valueX,
                    topLeft = getRenderPixel(renderEvent, [width, 0]),
                    topRight = getRenderPixel(renderEvent, [mapSize[0], 0]),
                    bottomLeft = getRenderPixel(renderEvent, [width, mapSize[1]]),
                    bottomRight = getRenderPixel(renderEvent, mapSize);

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(topLeft[0], topLeft[1]);
                ctx.lineTo(bottomLeft[0], bottomLeft[1]);
                ctx.lineTo(bottomRight[0], bottomRight[1]);
                ctx.lineTo(topRight[0], topRight[1]);
                ctx.closePath();
                ctx.clip();
            });
            state.layerSwiper.targetLayer.on("postrender", ({context}) => {
                context.restore();
            });
        }
    }
};

export default actions;
