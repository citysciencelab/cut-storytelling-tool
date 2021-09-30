<script>
export default {
    name: "RoutingDistanceDisplay",
    props: {
        distance: {
            type: Number,
            required: true
        }
    },
    data: function () {
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
            return (Math.floor((this.roundedDistance / 1000) * 10) / 10).toLocaleString();
        }
    }
};
</script>

<template>
    <span v-if="roundedDistance < 1000"><b>{{ roundedDistance }}</b>{{ mText }}</span>
    <span v-else><b>{{ kmDistance }}</b>{{ kmText }}</span>
</template>
