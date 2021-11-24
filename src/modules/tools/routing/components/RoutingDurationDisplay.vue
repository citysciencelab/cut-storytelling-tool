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
        /**
         * Computed value from the duration as minutes
         * @returns {Number} minutes
         */
        minutes () {
            return Math.floor(this.duration / 60);
        },
        /**
         * Computed value from the duration as hours
         * @returns {Number} hours
         */
        hours () {
            return Math.floor(this.duration / 3600);
        },
        /**
         * Computed value from the duration to get the remaining minutes in the hour
         * @returns {void} remaining minutes in the hour
         */
        minutesMinusHours () {
            return Math.floor((this.duration / 60) % 60);
        }
    }
};
</script>

<template>
    <span>
        <b v-if="duration < 60">&lt; 1 min</b>
        <b v-else-if="duration >= 3600">{{ hours }} h
            <span
                v-if="minutesMinusHours > 0"
                class="minutesminushours"
            >&nbsp;{{ minutesMinusHours }} min</span>
        </b>
        <b v-else>{{ minutes }} min</b>
    </span>
</template>
