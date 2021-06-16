<script>
import {mapGetters} from "vuex";
import TimeSlider from "./TimeSlider.vue";
import LayerSwiper from "./LayerSwiper.vue";

export default {
    name: "Wmst",
    components: {
        TimeSlider,
        LayerSwiper
    },
    data: () => ({width: window.innerWidth, mobileWidth: 800}),
    computed: {
        ...mapGetters("Wmst", ["layerSwiper", "timeSlider"]),
        minWidth () {
            return this.width > this.mobileWidth;
        }
    },
    created () {
        window.addEventListener("resize", this.innerWidthChanged);
    },
    methods: {
        innerWidthChanged () {
            this.width = window.innerWidth;
        }
    }
};
</script>

<template>
    <div id="wmst">
        <TimeSlider
            v-if="timeSlider.active"
            :class="{'moveLeft': layerSwiper.active && minWidth}"
            :layer-id="timeSlider.layerId"
        />
        <TimeSlider
            v-if="timeSlider.active && layerSwiper.active && minWidth"
            :class="{'moveRight': layerSwiper.active}"
            :layer-id="timeSlider.layerId + '_secondLayer'"
        />
        <LayerSwiper v-if="layerSwiper.active && minWidth" />
    </div>
</template>

<style lang="less" scoped>
    .transform(@value) {
        transform: translateX(@value);
        transition: ease transform 250ms;
    }
    .timeSlider-wrapper {
        .transform(-50%);
    }
    .moveLeft {
        .transform(-110%);
    }
    .moveRight {
        .transform(10%);
    }

    @media (min-width: 1075px) {
        .moveLeft {
            .transform(-150%);
        }
        .moveRight {
            .transform(50%);
        }
    }
</style>
