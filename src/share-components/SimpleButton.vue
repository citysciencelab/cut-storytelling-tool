<script>
export default {
    name: "SimpleButton",
    props: {
        text: {
            type: String,
            required: true
        },
        interaction: {
            type: Function,
            required: true
        },
        icon: {
            type: String,
            default: null,
            required: false
        }
    }
};
</script>

<template>
    <button
        class="btn btn-primary"
        type="button"
        @click="interaction"
    >
        <i
            v-if="icon !== null"
            :class="icon"
            role="img"
        />
        {{ $t(text) }}
    </button>
</template>

<style lang="scss" scoped>
@import "~variables";

.btn {
    display: flex;
    align-items: center;
    white-space: nowrap;
    i {
        margin-right: 0.5rem;
    }
    &:focus, &:active, &:hover {
        color: $primary;
        background-color: $white;
        border-color: $primary;
    }
}
</style>
