<script>
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";
import {fieldValueChanged} from "../utils/literalFunctions";
import {buildPath, getOptions, prepareOptionsWithId} from "../utils/pathFunctions";

export default {
    name: "Field",
    props: {
        defaultValue: {
            type: String,
            default: ""
        },
        fieldId: {
            type: String,
            required: true
        },
        fieldName: {
            type: String,
            required: true
        },
        inputLabel: {
            type: String,
            required: true
        },
        inputPlaceholder: {
            type: String,
            default: ""
        },
        inputTitle: {
            type: String,
            default: ""
        },
        required: {
            type: Boolean,
            default: false
        },
        options: {
            type: [String, Array],
            default: null
        },
        dropdownInputUsesId: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: "equal",
            validator: function (value) {
                return ["equal", "like"].indexOf(value) !== -1;
            }
        }
    },
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters)),
        htmlElement () {
            return this.options === null ? "input" : "select";
        },
        /**
         * If the options of the field are from an external source, it is disabled if:
         * - Is not the root element and the root element has not been added yet
         * - The prior needed element (e.g. 'foo' is needed to have the field 'foo.bar') is not added yet
         * - The prior needed / root element (example above) is not selected yet
         *
         * @returns {boolean} Whether the input is disabled or not.
         */
        disabled () {
            const notRoot = this.options !== "";

            if (typeof this.options === "string" && notRoot && this.parsedSource !== null && Object.keys(this.selectedOptions).length > 0) {
                const optionsArr = this.options.split("."),
                    selectedValues = Object.keys(this.selectedOptions);

                return !(this.addedOptions.includes("")
                    && optionsArr.every(option => this.addedOptions.includes(option))
                    && (selectedValues.includes("") && optionsArr.slice(0, optionsArr.length - 1).every(option => selectedValues.includes(option))));
            }
            // Disable all options depending on the root source in the beginning or if the external source hasn't been loaded yet
            return typeof this.options === "string" ? this.parsedSource === null || notRoot : false;
        },
        selectableOptions () {
            // Options are supposed to be retrieved from the external source
            if (typeof this.options === "string" && this.parsedSource !== null) {
                if (this.options === "") {
                    if (this.dropdownInputUsesId) {
                        return prepareOptionsWithId(this.parsedSource, true);
                    }

                    return Object.keys(this.parsedSource);
                }

                const optionsArr = this.options.split("."),
                    lastIndex = optionsArr.length - 1;

                if (Object.keys(this.selectedOptions).includes("")) {
                    const optionKeysWithoutRoot = Object.keys(this.selectedOptions)
                            .filter(option => option !== ""),
                        previousElementsSelected = optionsArr.slice(0, lastIndex)
                            .every(option => optionKeysWithoutRoot.includes(option));

                    if (previousElementsSelected) {
                        return getOptions(buildPath(this.selectedOptions, optionsArr[lastIndex]), this.parsedSource);
                    }
                }

                return [];
            }
            // Options are already given through the config
            if (typeof this.options === "object") {
                return this.options;
            }
            return null;
        }
    },
    mounted () {
        if (typeof this.options === "string") {
            if (this.options === "") {
                this.addOptions(this.options);
            }
            else {
                const optionsArr = this.options.split(".");

                // Current option is always the last part of the string
                this.addOptions(optionsArr[optionsArr.length - 1]);
            }
        }
    },
    methods: {
        ...mapMutations("Tools/WfsSearch", Object.keys(mutations)),
        valueChanged (val) {
            const value = this.htmlElement === "input" || val === "" ? val : JSON.parse(val).value;

            // NOTE: The extra object is sadly needed so that the object is reactive :(
            this.setRequiredValues({...fieldValueChanged(this.fieldId, value, this.instances[this.currentInstance].literals, this.requiredValues)});

            if (typeof this.options === "string") {
                const index = val === "" ? 0 : JSON.parse(val).index;

                this.setSelectedOptions({options: this.options, value, index});
            }
        },
        isObject (val) {
            return typeof val === "object";
        }
    }
};
</script>

<template>
    <div class="form-group form-group-sm">
        <label
            v-if="inputLabel"
            class="col-md-5 col-sm-5 control-label"
            :for="`tool-wfsSearch-${fieldName}-${fieldId}-input`"
        >
            {{ $t(inputLabel) }}
        </label>
        <div class="col-md-7 col-sm-7">
            <component
                :is="htmlElement"
                :id="`tool-wfsSearch-${fieldName}-${fieldId}-input`"
                :class="{
                    'form-control': true,
                    'input-sm': htmlElement === 'select'
                }"
                :placeholder="htmlElement === 'input' ? inputPlaceholder : ''"
                :default-value="htmlElement === 'input' ? defaultValue : ''"
                :required="required"
                :disabled="disabled"
                @change="valueChanged($event.currentTarget.value)"
            >
                <template v-if="htmlElement === 'select'">
                    <option
                        value=""
                    >
                        {{ $t("common:modules.tools.wfsSearch.optionPlaceholder") }}
                    </option>
                    <option
                        v-for="(option, index) of selectableOptions"
                        :key="isObject(option) ? option.fieldValue : option"
                        :value="JSON.stringify(isObject(option) ? {value: option.fieldValue, index} : {value: option, index})"
                        :selected="defaultValue && !required ? defaultValue : ''"
                    >
                        {{ isObject(option) ? (option.displayName ? option.displayName : option.fieldValue) : option }}
                    </option>
                </template>
            </component>
        </div>
    </div>
</template>

<style scoped>

</style>
