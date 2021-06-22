<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersWmst";
import mutations from "../store/mutationsWmst";
import actions from "../store/actionsWmst";

export default {
    name: "LayerSwiper",
    computed: {
        ...mapGetters("Map", ["visibleLayerList"]),
        ...mapGetters("Wmst", Object.keys(getters))
    },
    created: function () {
        window.addEventListener("mousemove", this.moveSwiper);
        window.addEventListener("mouseup", this.moveStop);
        this.setLayerSwiperTargetLayer(this.visibleLayerList.find(element => element.values_.id === this.timeSlider.layerId));
    },
    beforeDestroy: function () {
        window.removeEventListener("mousemove", this.moveSwiper);
        window.removeEventListener("mouseup", this.moveStop);
        this.resetLayer();
    },
    methods: {
        ...mapMutations("Wmst", Object.keys(mutations)),
        ...mapActions("Wmst", Object.keys(actions))
    }
};
</script>

<template>
    <div id="layerSwiper-wrapper">
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

.ol-swipe {
    width: 50px;
    background-color: red;
    height: 30px;
    max-height: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    cursor: ew-resize;
    &:before {
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
}

</style>
