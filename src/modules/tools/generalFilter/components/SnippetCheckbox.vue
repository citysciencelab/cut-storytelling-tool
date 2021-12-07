<script>
export default {
    name: "SnippetCheckbox",
    props: {
        label: {
            type: String,
            required: false,
            default: ""
        },
        operator: {
            type: String,
            required: false,
            default: "EQ"
        },
        prechecked: {
            type: Boolean,
            required: false,
            default: false
        },
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data () {
        return {
            checked: this.prechecked
        };
    }
};
</script>

<template>
    <div
        v-show="visible"
        class="snippetCheckboxContainer"
    >
        <input
            id="checkbox"
            v-model="checked"
            class="snippetCheckbox"
            type="checkbox"
            name="checkbox"
        >
        <label for="checkbox">{{ label }}</label>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
</style>
