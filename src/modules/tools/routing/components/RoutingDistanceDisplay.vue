<script>
export default {
    name: "RoutingDistanceDisplay",
    props: {
        distance: {
            type: Number,
            required: true
        }
    },
    computed: {
        roundedDistance () {
            return Math.floor(this.distance);
        },
        kmDistance () {
            return (Math.floor((this.roundedDistance / 1000) * 10) / 10).toLocaleString();
        }
    }
};
</script>

<template>
    <span v-if="roundedDistance < 1000"><b>{{ roundedDistance }}</b>&nbsp;m</span>
    <span v-else><b>{{ kmDistance }}</b>&nbsp;km</span>
</template>
