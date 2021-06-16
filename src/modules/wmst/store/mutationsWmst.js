import {generateSimpleMutations} from "../../../app-store/utils/generators";
import initialState from "./stateWmst";
import {getRenderPixel} from "ol/render";

const mutations = {
    ...generateSimpleMutations(initialState),
    // TimeSlider mutations
    setTimeSliderActive (state, active) {
        state.timeSlider.active = active;
    },
    setDefaultValue (state, defaultValue) {
        state.timeSlider.defaultValue = defaultValue;
    },
    setLayerId (state, layerId) {
        state.timeSlider.layerId = layerId;
    },
    setMin (state, min) {
        state.timeSlider.min = min;
    },
    setMax (state, max) {
        state.timeSlider.max = max;
    },
    setStep (state, step) {
        state.timeSlider.step = step;
    },
    // LayerSwiper mutations
    setSwiperActive (state, active) {
        state.layerSwiper.active = active;
    },
    setLayerSwiperValueX (state, clientX) {
        state.layerSwiper.valueX = clientX;
    },
    setLayerSwiperTargetLayer (state, layer) {
        state.layerSwiper.targetLayer = layer;
    },
    setLayerSwiperMapObject (state, map) {
        state.layerSwiper.mapObject = map;
    },
    move (state, event) {
        state.layerSwiper.isMoving = true;
        state.layerSwiper.swiper = event.target;
    },
    moveStop (state) {
        state.layerSwiper.isMoving = false;
    },
    moveSwiper (state, event) {
        if (state.layerSwiper.isMoving) {
            const map = state.layerSwiper.mapObject;

            state.layerSwiper.valueX = event.clientX;
            state.layerSwiper.swiper.style.left = event.clientX + "px";
            map.render();
            state.layerSwiper.targetLayer.on("prerender", function (e) {
                const ctx = e.context,
                    mapSize = map.getSize(),
                    width = state.layerSwiper.valueX,
                    tl = getRenderPixel(e, [width, 0]),
                    tr = getRenderPixel(e, [mapSize[0], 0]),
                    bl = getRenderPixel(e, [width, mapSize[1]]),
                    br = getRenderPixel(e, mapSize);

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(tl[0], tl[1]);
                ctx.lineTo(bl[0], bl[1]);
                ctx.lineTo(br[0], br[1]);
                ctx.lineTo(tr[0], tr[1]);
                ctx.closePath();
                ctx.clip();
            });
            // soll hierdurch eigentlich der Layer zurückgesetzt werden?
            state.layerSwiper.targetLayer.on("postrender", function (e) {
                const ctx = e.context;

                ctx.restore();
            });
        }
    }
};

export default mutations;
