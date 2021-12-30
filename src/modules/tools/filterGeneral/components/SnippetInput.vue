<script>
export default {
    name: "SnippetInput",
    props: {
        attrName: {
            type: String,
            required: false,
            default: ""
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        info: {
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
        snippetId: {
            type: Number,
            required: false,
            default: 0
        },
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data () {
        return {
            inputValue: this.prechecked ? this.prechecked : "",
            showInfo: false
        };
    },
    computed: {
        infoText: function () {
            return this.info ? this.info : this.$t("modules.tools.filterGeneral.textFieldInfo");
        }
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
        },
        toggleInfo () {
            this.showInfo = !this.showInfo;
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        class="snippetInputContainer"
    >
        <div class="right">
            <div class="info-icon">
                <span
                    :class="['glyphicon glyphicon-info-sign', showInfo ? 'opened' : '']"
                    @click="toggleInfo()"
                    @keydown.enter="toggleInfo()"
                >&nbsp;</span>
            </div>
        </div>
        <div class="input-container">
            <label
                for="snippetInput"
                class="snippetInputLabel left"
            >{{ label }}</label>
            <input
                id="snippetInput"
                v-model="inputValue"
                class="snippetInput"
                type="text"
                name="input"
                :disabled="disabled"
                :placeholder="placeholder"
            >
        </div>
        <div
            v-show="showInfo"
            class="bottom"
        >
            <div class="info-text">
                <span>{{ infoText }}</span>
            </div>
        </div>
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
    .snippetInputContainer {
        padding: 5px;
        margin-bottom: 10px;
        height: auto;
    }
    .snippetInputContainer input {
        clear: left;
        width: 100%;
        box-sizing: border-box;
        outline: 0;
        position: relative;
        margin-bottom: 5px;
    }
    .snippetInputContainer .info-icon {
        float: right;
        font-size: 16px;
        color: #ddd;
    }
    .snippetInputContainer .info-icon .opened {
        color: #000;
    }
    .snippetInputContainer .info-icon:hover {
        cursor: pointer;
        color: #a5a09e;
    }
    .snippetInputContainer .info-text {
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 10px;
        padding: 15px 10px;
    }
    .glyphicon-info-sign:before {
        content: "\E086";
    }
    .snippetInputContainer .bottom {
        clear: left;
        width: 100%;
    }
    .snippetInputContainer .left {
        float: left;
        width: 90%;
    }
    .snippetInputContainer .right {
        position: absolute;
        right: 10px;
    }
</style>
