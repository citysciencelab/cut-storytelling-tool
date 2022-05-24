<template>
    <button
        class="btn btn-primary"
        @click="interaction"
    >
        <span class="bootstrap-icon">
            <i
                v-if="icon !== null"
                :class="icon"
            />
            {{ $t(caption) }}
        </span>
    </button>
</template>

<script>
export default {
    name: "SimpleButton",
    props: {
        caption: {
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
button {
    margin: 5px;
}
</style>
