<script>
import {mapGetters} from "vuex";
import LayerSwiper from "./LayerSwiper.vue";
import TimeSlider from "./TimeSlider.vue";

export default {
    name: "WmsTime",
    components: {
        LayerSwiper,
        TimeSlider
    },
    data: () => ({width: window.innerWidth, mobileWidth: 800}),
    computed: {
        ...mapGetters("WmsTime", ["currentTimeSliderObject", "layerAppendix", "layerSwiper", "timeSlider"]),
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
    <div id="wmsTime">
        <TimeSlider
            v-if="timeSlider.active"
            :class="{'moveLeft': layerSwiper.active && minWidth}"
            :layer-id="currentTimeSliderObject.layerId"
        />
        <TimeSlider
            v-if="timeSlider.active && layerSwiper.active && minWidth"
            :class="{'moveRight': layerSwiper.active}"
            :layer-id="currentTimeSliderObject.layerId + layerAppendix"
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
