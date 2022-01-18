<script>
export default {
    name: "SnippetCheckbox",
    props: {
        api: {
            type: Object,
            required: false,
            default: null
        },
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
            default: "EQ"
        },
        prechecked: {
            type: Boolean,
            required: false,
            default: false
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
            checked: this.prechecked,
            showInfo: false
        };
    },
    computed: {
        infoText: function () {
            return this.info ? this.info : this.$t("modules.tools.filterGeneral.checkBoxInfo");
        }
    },
    watch: {
        checked: {
            handler (value) {
                this.emitCurrentRule(value);
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.emitCurrentRule(this.checked, true);
        });
    },
    methods: {
        /**
         * Emits the current rule to whoever is listening.
         * @param {*} value the value to put into the rule
         * @param {Boolean} [startup=false] true if the call comes on startup, false if a user actively changed a snippet
         * @returns {void}
         */
        emitCurrentRule (value, startup = false) {
            this.$emit("ruleChanged", {
                snippetId: this.snippetId,
                startup,
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
        class="snippetCheckboxContainer"
    >
        <div class="left">
            <input
                id="checkbox"
                v-model="checked"
                class="snippetCheckbox"
                type="checkbox"
                name="checkbox"
                :disabled="disabled"
            >
            <label for="checkbox">{{ label }} </label>
        </div>
        <div class="right">
            <div class="info-icon">
                <span
                    :class="['glyphicon glyphicon-info-sign', showInfo ? 'opened' : '']"
                    @click="toggleInfo()"
                    @keydown.enter="toggleInfo()"
                >&nbsp;</span>
            </div>
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
    .snippetCheckboxContainer {
        padding: 5px;
        margin-bottom: 10px;
        height: auto;
    }
    .snippetCheckboxContainer .info-icon {
        float: right;
        font-size: 16px;
        color: #ddd;
    }
    .snippetCheckboxContainer .info-icon .opened {
        color: #000;
    }
    .snippetCheckboxContainer .info-icon:hover {
        cursor: pointer;
        color: #a5a09e;
    }
    .snippetCheckboxContainer .info-text {
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 10px;
        padding: 15px 10px;
    }
    .glyphicon-info-sign:before {
        content: "\E086";
    }
    .snippetCheckboxContainer .bottom {
        clear: left;
        width: 100%;
    }
    .snippetCheckboxContainer .left {
        float: left;
        width: 90%;
    }
    .snippetCheckboxContainer .right {
        position: absolute;
        right: 10px;
    }
</style>
