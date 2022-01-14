<script>
import Multiselect from "vue-multiselect";

export default {
    name: "SnippetDropdown",
    components: {
        Multiselect
    },
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
            type: [Array],
            required: false,
            default: () => {
                return [];
            }
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

        if (this.visible && this.dropdownValue.length === 0) {
            this.setUniqueValues(list => {
                this.dropdownValue = list;
            });
        }
        else if (!this.visible && this.dropdownValue.length === 0) {
            this.invalid = true;
        }

        if (this.dropdownValue.length > 0) {
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
            <Multiselect
                id="select-box"
                v-model="dropdownSelected"
                :options="dropdownValue"
                name="select-box"
                :disabled="disable"
                :multiple="multiselect"
                :placeholder="label"
                :show-labels="false"
                open-direction="bottom"
                :hide-selected="true"
                :close-on-select="true"
                :clear-on-select="false"
                :loading="disable"
            />
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

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
    .select-box-container .multiselect .multiselect__spinner:after, .multiselect__spinner:before {
        position: absolute;
        content: "";
        top: 50%;
        left: 50%;
        margin: -8px 0 0 -8px;
        width: 16px;
        height: 16px;
        border-radius: 100%;
        border: 2px solid transparent;
        border-top-color: #828282;
        box-shadow: 0 0 0 1px transparent;
    }
    .select-box-container .multiselect .multiselect__option {
        display: block;
        min-height: 30px;
        line-height: 10px;
        text-decoration: none;
        text-transform: none;
        vertical-align: middle;
        position: relative;
        cursor: pointer;
        white-space: nowrap;
    }
    .select-box-container .multiselect .multiselect__option--highlight {
        background: #3177b1;
        outline: none;
        color: #fff;
    }
    .select-box-container .multiselect .multiselect__tag {
        position: relative;
        display: inline-block;
        padding: 4px 26px 4px 10px;
        border-radius: 5px;
        margin-right: 10px;
        color: #fff;
        line-height: 1;
        background: #3177b1;
        margin-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        max-width: 100%;
        text-overflow: ellipsis;
    }
    .select-box-container .multiselect .multiselect__option--highlight:after {
        content: attr(data-select);
        background: #a1d0ff;
        color: white;
    }
    .select-box-container .multiselect .multiselect__tag-icon::after {
        content: "\D7";
        color: #dddddd;
        font-size: 14px;
    }
    .select-box-container .multiselect .multiselect__tag-icon:hover {
        background: #299ec1;
    }
    .select-box-container .multiselect .multiselect__placeholder {
        color: #adadad;
        display: inline-block;
        margin-bottom: 10px;
        padding-top: 2px;
    }
    .select-box-container .multiselect .multiselect__tag-icon:focus, .multiselect__tag-icon:hover {
        background: #ddd;
    }
</style>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    select {
        box-sizing: border-box;
        outline: 0;
        position: relative;
        width: 100%;
        margin-bottom: 5px;
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
    .snippetDropdownContainer .right {
        position: absolute;
        right: 10px;
    }
</style>
