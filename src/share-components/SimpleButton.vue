<template>
    <button
        class="btn btn-primary"
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

<style lang="scss" scoped>
.btn {
    display: flex;
    align-items: center;
    white-space: nowrap;
    i {
        margin-right: 0.5rem;
    }
}
</style>
