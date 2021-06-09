<script>
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersLayerSwiper";
import mutations from "../store/mutationsLayerSwiper";
import state from "../store/stateLayerSwiper";
import ControlIcon from "../../ControlIcon.vue";
import TableStyleControl from "../../TableStyleControl.vue";

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
        component () {
            return Radio.request("Util", "getUiStyle") === "TABLE"
                ? TableStyleControl
                : ControlIcon;
        }
    },
    methods: {
        move (event) {
            state.isMoving = true;
            console.log("I wanna move");
            state.swiper = event.target;
            window.addEventListener("mousemove", this.moveSwiper);
            window.addEventListener("mouseup", this.moveStop);
        },
        moveStop () {
            state.isMoving = false;
            console.log("I stopped moving");
        },
        moveSwiper (event) {
            if (state.isMoving) {
                state.swiper.style.left = event.clientX + "px";
            }
        }
    }
};
</script>

<template>
    <div
        class="ol-swipe"
        @mousedown.self="move"
    >
        <component
            :is="component"
            :title="$t(`common:modules.controls.layerSwiper.title`)"
            :iconName="$t(`common:modules.controls.layerSwiper.title`)"
        />
    </div>
</template>

<style lang="less" scoped>
@import "~variables";
.ol-swipe {
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
