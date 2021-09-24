<script>
export default {
    name: "RoutingDurationDisplay",
    props: {
        duration: {
            type: Number,
            required: true
        }
    },
    computed: {
        minutes () {
            return Math.floor(this.duration / 60);
        },
        hours () {
            return Math.floor(this.duration / 3600);
        },
        minutesMinusHours () {
            return Math.floor((this.duration / 60) % 60);
        }
    }
};
</script>

<template>
    <span>
        <b v-if="duration < 60">&lt; 1 min</b>
        <b v-else-if="duration > 3600">{{ hours }} h
            <span v-if="minutesMinusHours > 0">&nbsp;{{ minutesMinusHours }} min</span>
        </b>
        <b v-else>{{ minutes }} min</b>
    </span>
</template>
