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
@import "~/css/mixins.scss";

.btn {
    display: flex;
    justify-content: center;
    white-space: nowrap;
    i {
        margin-right: 0.5rem;
    }
    &:focus, &:active { /*, &:hover { TODO: Use hover with this rule instead when this component is project wide */
        color: $primary;
        background-color: $white;
        border-color: $primary;
    }
    &:hover {
        @include primary_action_hover;
    }
}
</style>
