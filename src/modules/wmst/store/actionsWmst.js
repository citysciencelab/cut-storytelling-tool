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
    /**
     * Sets the postion of the swiper to state according to the x-coordinate of the mousedown event.
     * Adds the event listeners to the target layer on pre- and postrender.
     * @param {*} event the DOM-event
     * @returns {void}
     */
    moveSwiper ({state, commit, rootGetters, dispatch}, event) {
        const {clientX} = event;

        if (state.layerSwiper.isMoving) {
            const map = rootGetters["Map/map"];

            commit("setLayerSwiperValueX", clientX);
            commit("setLayerSwiperStyleLeft", clientX);
            map.render();
            state.layerSwiper.targetLayer.once("prerender", renderEvent => {
                dispatch("drawLayer", renderEvent);
            });
            state.layerSwiper.targetLayer.once("postrender", ({context}) => {
                context.restore();
            });
        }
    },
    /**
     * Manipulates the width of the target layer according to the position of the swiper.
     * @param {*} renderEvent the render event from the target layer
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
