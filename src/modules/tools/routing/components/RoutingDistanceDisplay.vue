<script>
import thousandsSeparator from "../../../../utils/thousandsSeparator";
export default {
    name: "RoutingDistanceDisplay",
    props: {
        distance: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            mText: " m",
            kmText: " km"
        };
    },
    computed: {
        /**
         * Computed value for the rounded distance
         * @returns {Number} rounded distance
         */
        roundedDistance () {
            return Math.floor(this.distance);
        },
        /**
         * Computed value to return the distance in kilometer
         * @returns {Number} kilometer distance
         */
        kmDistance () {
            return thousandsSeparator(Math.floor((this.roundedDistance / 1000) * 10) / 10);
        }
    }
};
</script>

<template>
    <span v-if="roundedDistance < 1000"><b>{{ roundedDistance }}</b>{{ mText }}</span>
    <span v-else><b>{{ kmDistance }}</b>{{ kmText }}</span>
</template>
