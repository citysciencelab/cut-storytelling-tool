<script>
import state from "../store/stateWmst";
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersWmst";
import mutations from "../store/mutationsWmst";
import {getRenderPixel} from "ol/render";

/**
 * FullScreen control that allows switching between fullscreen
 * and normal mode for the map. May also open a new tab if the
 * instance is running in an iFrame.
 */
export default {
    name: "LayerSwiper",
    data: function () {
        return {
        };
    },
    computed: {
        ...mapGetters("Map", ["visibleLayerList", "map"]),
        ...mapGetters("Wmst", Object.keys(getters))
    },
    created: function () {
        state.layerSwiper.targetLayer = this.visibleLayerList.find(element => element.values_.id === "wmst");
    },
    methods: {
        ...mapMutations("Map", ["addLayerToMap", "removeLayerFromMap"]),
        ...mapMutations("Wmst", Object.keys(mutations)),
        move (event) {

            state.layerSwiper.isMoving = true;
            state.layerSwiper.swiper = event.target;
            window.addEventListener("mousemove", this.moveSwiper);
            window.addEventListener("mouseup", this.moveStop);

        },
        moveStop () {
            state.layerSwiper.isMoving = false;
            window.removeEventListener("mousemove", this.moveSwiper);
            window.removeEventListener("mouseup", this.moveStop);
        },
        moveSwiper (event) {
            if (state.layerSwiper.isMoving) {
                const map = this.map;

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
                state.layerSwiper.targetLayer.on("postrender", function (e) {
                    const ctx = e.context;

                    ctx.restore();
                });
            }
        }
    }
};
</script>

<template>
    <div>
        <button
            class="ol-swipe btn"
            title="$t(`common:modules.controls.layerSwiper.title`)"
            @mousedown.self="move"
        >
        </button>
    </div>
</template>

<style lang="less" scoped>
@import "~variables";
button {
    width: 50px;
    background-color: red;
    height: 30px;
}
.ol-swipe {
    max-height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
}

.ol-swipe:before {
    content: "";
    position: absolute;
    top: -5000px;
    bottom: -5000px;
    left: 50%;
    width: 4px;
    background: #fff;
    z-index: -1;
    transform: translate(-2px, 0);
    -webkit-transform: translate(-2px, 0);
}
.ol-swipe.horizontal:before {
    left: -5000px;
    right: -5000px;
    top: 50%;
    bottom: auto;
    width: auto;
    height: 4px;
}

.ol-swipe,
.ol-swipe button {
    cursor: ew-resize;
}
.ol-swipe.horizontal,
.ol-swipe.horizontal button {
    cursor: ns-resize;
}

.ol-swipe:after,
.ol-swipe button:before,
.ol-swipe button:after {
    content: "";
    position: absolute;
    top: 25%;
    bottom: 25%;
    left: 50%;
    width: 2px;
    background: rgba(255, 255, 255, 0.8);
    transform: translate(-1px, 0);
    -webkit-transform: translate(-1px, 0);
}
.ol-swipe button:after {
    transform: translateX(5px);
    -webkit-transform: translateX(5px);
}
.ol-swipe button:before {
    transform: translateX(-7px);
    -webkit-transform: translateX(-7px);
}
</style>
