<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersWmsTime";
import mutations from "../store/mutationsWmsTime";
import actions from "../store/actionsWmsTime";

export default {
    name: "LayerSwiper",
    computed: {
        ...mapGetters("Map", ["visibleLayerList", "map"]),
        ...mapGetters("WmsTime", Object.keys(getters))
    },
    created: function () {
        window.addEventListener("mousemove", this.moveSwiper);
        window.addEventListener("mouseup", this.moveStop);
        this.setLayerSwiperTargetLayer(this.visibleLayerList.find(element => element.values_.id === this.currentTimeSliderObject.layerId + this.layerAppendix));
        this.setLayerSwiperValueX(this.map.getSize()[0] / 2);
        this.map.on("postcompose", this.updateMap);
    },
    beforeDestroy: function () {
        window.removeEventListener("mousemove", this.moveSwiper);
        window.removeEventListener("mouseup", this.moveStop);
        this.map.un("postcompose", this.updateMap);
    },
    methods: {
        ...mapMutations("WmsTime", Object.keys(mutations)),
        ...mapActions("WmsTime", Object.keys(actions))
    }
};
</script>

<template>
    <button
        class="btn"
        :title="$t(`common:modules.controls.layerSwiper.title`)"
        @mousedown.self="move($event.target)"
    />
</template>

<style lang="less" scoped>
@import "~variables";

button {
    width: 50px;
    background-color: @primary;
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
        background: @primary_contrast;
        z-index: -1;
        transform: translate(-2px, 0);
        -webkit-transform: translate(-2px, 0);
    }
}
</style>
