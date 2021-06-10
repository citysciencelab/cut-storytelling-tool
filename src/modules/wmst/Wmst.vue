<script>
import {mapGetters} from "vuex";

export default {
    name: "Wmst",
    computed: {
        ...mapGetters("Wmst", ["timeSlider"])
    }
};
</script>

<template>
    <div>
        <component
            :is="timeSlider.component"
            v-if="timeSlider.active"
        />
        <!-- TODO: Zwei TimeSlider mit jew. einer konditionalen Klasse -> nach links oder rechts verschieben. Wenn der jew. andere abgewählt wird, dann wird wieder in die Mitte geschoben -->
        <!-- <TimeSlider v-if="false" class="someWhereElse" />-->
        <!-- <LayerSwiper v-if="btnClicked" />-->
    </div>
</template>

<style scoped>

</style>
