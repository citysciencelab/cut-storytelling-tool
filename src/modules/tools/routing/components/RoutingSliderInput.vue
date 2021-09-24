<script>
export default {
    name: "RoutingSliderInput",
    props: {
        value: {
            type: Number,
            required: true
        },
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        step: {
            type: Number,
            required: false,
            default: 1
        },
        unit: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: true
        }
    }
};
</script>

<template>
    <div class="d-flex flex-column">
        <div class="d-flex justify-content-between">
            <span>{{ min }} {{ unit }}</span>
            <span>
                <b>{{ value }}</b> <span>{{ unit }}</span>
            </span>
            <span>{{ max }} {{ unit }}</span>
        </div>
        <input
            :value="value"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :disabled="disabled"
            @input="$emit('input', Number($event.target.value))"
        >
    </div>
</template>

<style scoped>
.d-flex {
    display: flex;
}
.flex-column {
    flex-direction: column;
}
.justify-content-between {
    justify-content: space-between;
}
</style>
