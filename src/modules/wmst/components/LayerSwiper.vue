<script>
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersWmst";
import mutations from "../store/mutationsWmst";

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
        window.addEventListener("mousemove", this.moveSwiper);
        window.addEventListener("mouseup", this.moveStop);
        this.setLayerSwiperTargetLayer(this.visibleLayerList.find(element => element.values_.id === "wmst"));
        this.setLayerSwiperMapObject(this.map);
    },
    beforeDestroy: function () {
        window.removeEventListener("mousemove", this.moveSwiper);
        window.removeEventListener("mouseup", this.moveStop);
    },
    methods: {
        ...mapMutations("Wmst", Object.keys(mutations))
    }
};
</script>

<template>
    <div>
        <button
            class="ol-swipe btn"
            :title="$t(`common:modules.controls.layerSwiper.title`)"
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
