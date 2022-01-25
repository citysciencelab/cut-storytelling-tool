<script>
import Multiselect from "vue-multiselect";
import {translateKeyWithPlausibilityCheck} from "../../../../utils/translateKeyWithPlausibilityCheck.js";

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
            default: true
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        display: {
            type: String,
            required: false,
            default: "default"
        },
        info: {
            type: [String, Boolean],
            required: false,
            default: false
        },
        label: {
            type: [String, Boolean],
            required: false,
            default: true
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
            default: undefined
        },
        renderIcons: {
            type: String,
            required: false,
            default: undefined
        },
        snippetId: {
            type: Number,
            required: false,
            default: 0
        },
        value: {
            type: Array,
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
            showInfo: false,
            dropdownValue: [],
            dropdownSelected: []
        };
    },
    computed: {
        labelText () {
            if (this.label === true) {
                return this.attrName;
            }
            else if (typeof this.label === "string") {
                return this.translateKeyWithPlausibilityCheck(this.label, key => this.$t(key));
            }
            return "";
        },
        infoText () {
            if (this.info === true) {
                return this.$t("common:modules.tools.filterGeneral.info.snippetDropdown");
            }
            else if (typeof this.info === "string") {
                return this.translateKeyWithPlausibilityCheck(this.info, key => this.$t(key));
            }
            return "";
        },
        emptyList () {
            return this.$t("modules.tools.filterGeneral.dropdown.emptyList");
        },
        noElements () {
            return this.$t("modules.tools.filterGeneral.dropdown.noElements");
        }
    },
    watch: {
        dropdownSelected (value) {
            if (!this.isInitializing || this.isInitializing && Array.isArray(this.prechecked)) {
                if (Array.isArray(value) && value.length) {
                    this.emitCurrentRule(value, this.isInitializing);
                }
                else {
                    this.deleteCurrentRule();
                }
            }
        },
        disabled (value) {
            this.disable = typeof value === "boolean" ? value : true;
        }
    },
    created () {
        this.dropdownSelected = Array.isArray(this.prechecked) ? this.prechecked : [];

        if (!this.visible) {
            this.dropdownValue = Array.isArray(this.prechecked) ? this.prechecked : [];
            this.$nextTick(() => {
                this.isInitializing = false;
                this.disable = false;
            });
        }
        else if (Array.isArray(this.value)) {
            this.dropdownValue = this.value;
            this.$nextTick(() => {
                this.isInitializing = false;
                this.disable = false;
            });
        }
        else if (this.api && this.autoInit !== false) {
            this.api.getUniqueValues(this.attrName, list => {
                this.dropdownValue = list;
                this.$nextTick(() => {
                    this.isInitializing = false;
                    this.disable = false;
                });
            }, error => {
                this.disable = false;
                this.isInitializing = false;
                console.warn(error);
            });
        }
    },
    methods: {
        translateKeyWithPlausibilityCheck,

        /**
         * Returns the label to use in the gui.
         * @returns {String} the label to use
         */
        getLabel () {
            return this.label || this.attrName;
        },
        /**
         * Emits the current rule to whoever is listening.
         * @param {*} value the value to put into the rule
         * @param {Boolean} [startup=false] true if the call comes on startup, false if a user actively changed a snippet
         * @returns {void}
         */
        emitCurrentRule (value, startup = false) {
            this.$emit("changeRule", {
                snippetId: this.snippetId,
                startup,
                fixed: !this.visible,
                attrName: this.attrName,
                operator: this.operator,
                value
            });
        },
        /**
         * Emits the delete rule function to whoever is listening.
         * @returns {void}
         */
        deleteCurrentRule () {
            this.$emit("deleteRule", this.snippetId);
        },
        /**
         * Resets the values of this snippet.
         * @param {Function} onsuccess the function to call on success
         * @returns {void}
         */
        resetSnippet (onsuccess) {
            if (this.visible) {
                this.dropdownSelected = [];
            }
            this.$nextTick(() => {
                if (typeof onsuccess === "function") {
                    onsuccess();
                }
            });
        },
        /**
         * Toggles the info.
         * @returns {void}
         */
        toggleInfo () {
            this.showInfo = !this.showInfo;
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        class="snippetDropdownContainer"
    >
        <div
            v-if="display === 'default'"
            class="snippetDefaultContainer"
        >
            <div
                v-if="label !== false"
                class="left"
            >
                <label
                    class="select-box-label"
                    :for="'snippetSelectBox-' + snippetId"
                >{{ labelText }}</label>
            </div>
            <div
                v-if="info !== false"
                class="right"
            >
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
                    :id="'snippetSelectBox-' + snippetId"
                    v-model="dropdownSelected"
                    :options="dropdownValue"
                    name="select-box"
                    :disabled="disable"
                    :multiple="multiselect"
                    :placeholder="placeholder"
                    :show-labels="false"
                    open-direction="bottom"
                    :hide-selected="true"
                    :close-on-select="true"
                    :clear-on-select="false"
                    :loading="disable"
                >
                    <span slot="noOptions">{{ emptyList }}</span>
                    <span slot="noResult">{{ noElements }}</span>
                </Multiselect>
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
        <div
            v-if="display === 'list'"
            class="snippetListContainer"
        >
            <div class="table-responsive">
                <table class="table table-sm table-hover table-bordered table-striped">
                    <thead
                        v-if="label !== false"
                    >
                        <tr>
                            <th
                                colspan="2"
                            >
                                {{ labelText }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="val in dropdownValue"
                            :key="val"
                        >
                            <td>
                                <label
                                    class="check-box-label"
                                    :for="'snippetCheckbox-' + snippetId + '-' + val"
                                >{{ val }}</label>
                            </td>
                            <td>
                                <label
                                    for="'snippetCheckbox-' + snippetId + '-' + val"
                                />
                                <input
                                    :id="'snippetCheckbox-' + snippetId + '-' + val"
                                    v-model="dropdownSelected"
                                    type="checkbox"
                                    :value="val"
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
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
    .category-layer .right {
        right: 30px;
    }
</style>
