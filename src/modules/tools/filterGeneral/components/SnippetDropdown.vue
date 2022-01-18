<script>
export default {
    name: "SnippetDropdown",
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
        addSelectAll: {
            type: [String, Boolean],
            required: false,
            default: false
        },
        autoInit: {
            type: Boolean,
            required: false,
            default: false
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        display: {
            type: String,
            required: false,
            default: ""
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
        multiselect: {
            type: Boolean,
            required: false,
            default: false
        },
        operator: {
            type: String,
            required: false,
            default: "EQ"
        },
        placeholder: {
            type: String,
            required: false,
            default: ""
        },
        prechecked: {
            type: Array,
            required: false,
            default: () => {
                return [];
            }
        },
        renderIcons: {
            type: String,
            required: false,
            default: "fromLegend"
        },
        snippetId: {
            type: Number,
            required: false,
            default: 0
        },
        value: {
            type: [Array, undefined],
            required: false,
            default: undefined
        },
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data () {
        return {
            disable: true,
            isInitializing: true,
            invalid: false,
            showInfo: false,
            multipleClass: "multipleClass",
            singleClass: "singleClass",
            dropdownValue: [],
            dropdownSelected: []
        };
    },
    computed: {
        infoText: function () {
            return this.info ? this.info : this.$t("modules.tools.filterGeneral.dropDownInfo");
        }
    },
    watch: {
        dropdownSelected: {
            handler (value) {
                this.emitCurrentRule(value, this.isInitializing);
            }
        },
        disabled: {
            handler (value) {
                this.disable = typeof value === "boolean" ? value : true;
            }
        }
    },
    mounted () {
        this.dropdownValue = !this.visible ? this.prechecked : this.value;
        // triggers emitCurrentRule
        this.dropdownSelected = Array.isArray(this.prechecked) ? this.prechecked : [];

        if (this.visible && typeof this.dropdownValue === "undefined") {
            this.setUniqueValues(list => {
                this.dropdownValue = list;
            });
        }
        else if (!this.visible && typeof this.dropdownValue === "undefined") {
            this.invalid = true;
        }

        if (typeof this.dropdownValue !== "undefined" && this.dropdownValue.length > 0) {
            this.disable = false;
        }

        this.$nextTick(() => {
            this.isInitializing = false;
        });
    },
    methods: {
        translate (key) {
            return i18next.t(key);
        },
        toggleInfo () {
            this.showInfo = !this.showInfo;
        },
        setUniqueValues (onsuccess) {
            this.api.getUniqueValues(this.attrName, list => {
                if (typeof onsuccess === "function") {
                    onsuccess(list);
                    this.disable = false;
                }
            }, error => {
                this.disable = false;
                console.warn(error);
            });
        },
        /**
         * Emits the current rule to whoever is listening.
         * @param {*} value the value to put into the rule
         * @param {Boolean} [startup=false] true if the call comes on startup, false if a user actively changed a snippet
         * @returns {void}
         */
        emitCurrentRule (value, startup = false) {
            let result = value;

            if (Array.isArray(value)) {
                result = [];
                value.forEach(v => {
                    if (v) {
                        result.push(v);
                    }
                });
            }
            this.$emit("ruleChanged", {
                snippetId: this.snippetId,
                startup,
                rule: {
                    attrName: this.attrName,
                    operator: this.operator,
                    value: result
                }
            });
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        v-if="!invalid"
        class="snippetDropdownContainer"
    >
        <div class="left">
            <label
                class="select-box-label"
                for="select-box"
            >{{ label }}:</label>
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
        <div class="select-box-container">
            <select
                id="select-box"
                v-model="dropdownSelected"
                name="select-box"
                :disabled="disable"
                :class="multiselect ? multipleClass : singleClass"
                :multiple="multiselect"
            >
                <option
                    v-for="(optionValue, index) in dropdownValue"
                    :key="'optionValue' + '-' + index"
                    :value="index"
                >
                    {{ optionValue }}
                </option>
            </select>
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
    select {
        box-sizing: border-box;
        outline: 0;
        position: relative;
        width: 100%;
        margin-bottom: 5px;
    }
    .multipleClass {
        display: inline-block;
        width: 100%;
        height: 100px;
        padding: .375rem 1.75rem .375rem .75rem;
        line-height: 1.5;
        color: #495057;
        vertical-align: middle;
        background: #fff;
        border: 1px solid rgb(34,34,34);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    .singleClass {
        display: inline-block;
        width: 100%;
        height: 25px;
        color: #495057;
        vertical-align: middle;
        background: #fff;
        border: 1px solid rgb(34,34,34);
    }
    .disabled {
        border-color: #dddddd;
        background-color: #f8f8f8;
    }
    .enabled {
        border-color: initial;
        background-color: initial;
    }
    .snippetDropdownContainer {
        padding: 5px;
        margin-bottom: 10px;
        height: auto;
    }
    .snippetDropdownContainer .info-icon {
        float: right;
        font-size: 16px;
        color: #ddd;
    }
    .snippetDropdownContainer .info-icon .opened {
        color: #000;
    }
    .snippetDropdownContainer .info-icon:hover {
        cursor: pointer;
        color: #a5a09e;
    }
    .snippetDropdownContainer .info-text {
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 10px;
        padding: 15px 10px;
    }
    .glyphicon-info-sign:before {
        content: "\E086";
    }
    .snippetDropdownContainer select {
        clear: left;
        width: 100%;
    }
    .snippetDropdownContainer .bottom {
        clear: left;
        width: 100%;
    }
    .snippetDropdownContainer .left {
        float: left;
        width: 90%;
    }
    .snippetDropdownContainer .right {
        position: absolute;
        right: 10px;
    }
</style>
