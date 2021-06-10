<script>
import {mapGetters} from "vuex";
import TimeSlider from "./TimeSlider.vue";

export default {
    name: "Wmst",
    components: {
        TimeSlider
    },
    computed: {
        ...mapGetters("Wmst", ["swiper", "timeSlider"])
    }
};
</script>

<template>
    <div>
        <TimeSlider
            v-if="timeSlider.active"
            :class="{'moveLeft': swiper.active}"
        />
        <!-- TODO: Make sure that the correct layer will be displayed after deselection! -->
        <TimeSlider
            v-if="timeSlider.active && swiper.active"
            :class="{'moveRight': swiper.active}"
        />
        <!-- <LayerSwiper v-if="btnClicked" />-->
    </div>
</template>

<style lang="less" scoped>
    .transform(@value) {
        transform: translateX(@value);
    }
    .timeSlider-wrapper {
        .transform(-50%);
    }
    .moveLeft {
        .transform(-120%);
    }
    .moveRight {
        .transform(20%);
    }
</style>
