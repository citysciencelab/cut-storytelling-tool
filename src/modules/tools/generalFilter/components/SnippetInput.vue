<script>
export default {
    name: "SnippetInput",
    props: {
        label: {
            type: String,
            required: false,
            default: ""
        },
        operator: {
            type: String,
            required: false,
            default: "IN"
        },
        placeholder: {
            type: String,
            required: false,
            default: ""
        },
        prechecked: {
            type: String,
            required: false,
            default: ""
        },
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        class="snippetInputContainer"
    >
        <label
            for="input"
            class="snippetInputLabel"
        >{{ label }}</label>
        <input
            class="snippetInput"
            type="text"
            name="input"
            :placeholder="placeholder"
            :value="prechecked"
        >
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    input {
        box-sizing: border-box;
        outline: 0;
        position: relative;
        width: 100%;
    }
</style>
