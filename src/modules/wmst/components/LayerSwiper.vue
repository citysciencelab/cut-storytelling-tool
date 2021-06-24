<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersWmst";
import mutations from "../store/mutationsWmst";
import actions from "../store/actionsWmst";

export default {
    name: "LayerSwiper",
    computed: {
        ...mapGetters("Map", ["visibleLayerList", "map"]),
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
        this.map.render();
    },
    methods: {
        ...mapMutations("Wmst", Object.keys(mutations)),
        ...mapActions("Wmst", Object.keys(actions))
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
