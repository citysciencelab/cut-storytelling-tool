<script>
export default {
    name: "SnippetInput",
    props: {
        snippetId: {
            type: Number,
            required: false,
            default: 0
        },
        attrName: {
            type: String,
            required: false,
            default: ""
        },
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
    },
    data () {
        return {
            inputValue: this.prechecked ? this.prechecked : ""
        };
    },
    watch: {
        inputValue: {
            handler (value) {
                this.emitCurrentRule(value);
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.emitCurrentRule(this.inputValue);
        });
    },
    methods: {
        /**
         * Emits the current rule to whoever is listening.
         * @param {*} value the value to put into the rule
         * @returns {void}
         */
        emitCurrentRule (value) {
            this.$emit("ruleChanged", {
                snippetId: this.snippetId,
                rule: {
                    attrName: this.attrName,
                    operator: this.operator,
                    value
                }
            });
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
            v-model="inputValue"
            class="snippetInput"
            type="text"
            name="input"
            :placeholder="placeholder"
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
