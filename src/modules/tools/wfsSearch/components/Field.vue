<script>
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";
import {fieldValueChanged} from "../utils/literalFunctions";
import {buildPath, getOptions, prepareOptionsWithId} from "../utils/pathFunctions";

/**
 * Validates that the prop for the type is correct.
 *
 * @param {String} type The type to be validated.
 * @returns {Boolean} Whether a correct type was given or not.
 */
function validate (type) {
    return ["equal", "like"].indexOf(type) !== -1;
}

export default {
    name: "Field",
    props: {
        defaultValue: {
            type: [String, Array],
            default: ""
        },
        fieldId: {
            type: [String, Array],
            required: true
        },
        fieldName: {
            type: [String, Array],
            required: true
        },
        inputLabel: {
            type: [String, Array],
            required: true
        },
        inputPlaceholder: {
            type: [String, Array],
            default: ""
        },
        inputTitle: {
            type: [String, Array],
            default: ""
        },
        required: {
            type: [Boolean, Array],
            default: false
        },
        options: {
            type: [String, Array],
            default: null
        },
        dropdownInputUsesId: {
            type: [Boolean, Array],
            default: false
        },
        type: {
            type: [String, Array],
            default: "equal",
            validator: function (type) {
                return typeof type === "string" ? validate(type) : type.every(val => validate(val));
            }
        }
    },
    data: () => ({parameterIndex: 0}),
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters)),
        selectableParameters () {
            // This could be checked with any required value
            if (Array.isArray(this.fieldName)) {
                // The array check needs to be done for every property which is not required
                // The "options" part is special, as it already can be an array. The second check makes sure, that the elements of the array should not be displayed but are part of a single field config.
                return {
                    fieldId: this.fieldId[this.parameterIndex],
                    fieldName: this.fieldName[this.parameterIndex],
                    inputLabel: this.inputLabel[this.parameterIndex],
                    defaultValue: Array.isArray(this.defaultValue) ? this.defaultValue[this.parameterIndex] : this.defaultValue,
                    inputPlaceholder: Array.isArray(this.inputPlaceholder) ? this.inputPlaceholder[this.parameterIndex] : this.inputPlaceholder,
                    inputTitle: Array.isArray(this.inputTitle) ? this.inputTitle[this.parameterIndex] : this.inputTitle,
                    required: Array.isArray(this.required) ? this.required[this.parameterIndex] : this.required,
                    options: Array.isArray(this.options) && Object.prototype.toString.call(this.options[0]) !== "[object Object]" ? this.options[this.parameterIndex] : this.options,
                    dropdownInputUsesId: Array.isArray(this.dropdownInputUsesId) ? this.dropdownInputUsesId[this.parameterIndex] : this.dropdownInputUsesId,
                    type: Array.isArray(this.type) ? this.type[this.parameterIndex] : this.type
                };
            }

            return {
                fieldId: this.fieldId,
                fieldName: this.fieldName,
                inputLabel: this.inputLabel,
                defaultValue: this.defaultValue,
                inputPlaceholder: this.inputPlaceholder,
                inputTitle: this.inputTitle,
                required: this.required,
                options: this.options,
                dropdownInputUsesId: this.dropdownInputUsesId,
                type: this.type
            };
        },
        htmlElement () {
            return this.selectableParameters.options === null ? "input" : "select";
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
            const notRoot = this.selectableParameters.options !== "";

            if (typeof this.selectableParameters.options === "string" && notRoot && this.parsedSource !== null && Object.keys(this.selectedOptions).length > 0) {
                const optionsArr = this.selectableParameters.options.split("."),
                    selectedValues = Object.keys(this.selectedOptions);

                return !(this.addedOptions.includes("")
                    && optionsArr.every(option => this.addedOptions.includes(option))
                    && (selectedValues.includes("") && optionsArr.slice(0, optionsArr.length - 1).every(option => selectedValues.includes(option))));
            }
            // Disable all options depending on the root source in the beginning or if the external source hasn't been loaded yet
            return typeof this.selectableParameters.options === "string" ? this.parsedSource === null || notRoot : false;
        },
        selectableOptions () {
            // Options are supposed to be retrieved from the external source
            if (typeof this.selectableParameters.options === "string" && this.parsedSource !== null) {
                if (this.selectableParameters.options === "") {
                    if (this.selectableParameters.dropdownInputUsesId) {
                        return prepareOptionsWithId(this.parsedSource, true);
                    }

                    return Object.keys(this.parsedSource);
                }

                const optionsArr = this.selectableParameters.options.split("."),
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
            // Either options are already given through the config or the standard value 'null' is returned
            return this.selectableParameters.options;
        }
    },
    mounted () {
        if (typeof this.selectableParameters.options === "string") {
            if (this.selectableParameters.options === "") {
                this.addOptions(this.selectableParameters.options);
            }
            else {
                const optionsArr = this.selectableParameters.options.split(".");

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
            this.setRequiredValues({...fieldValueChanged(this.selectableParameters.fieldId, value, this.instances[this.currentInstance].literals, this.requiredValues)});

            if (typeof this.selectableParameters.options === "string") {
                const index = val === "" ? 0 : JSON.parse(val).index;

                this.setSelectedOptions({options: this.selectableParameters.options, value, index});
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
        <div
            v-if="Array.isArray(inputLabel)"
            class="col-md-5 col-sm-5"
        >
            <select
                :id="`tool-wfsSearch-${selectableParameters.fieldName}-${selectableParameters.fieldId}-fieldSelection`"
                class="form-control input-sm"
                :aria-label="$t('common:modules.tools.wfsSearch.fieldSelectionLabel')"
                @change="parameterIndex = $event.currentTarget.value"
            >
                <option
                    v-for="(label, index) of inputLabel"
                    :key="label + index"
                    :value="index"
                >
                    {{ label }}
                </option>
            </select>
        </div>
        <label
            v-else
            class="col-md-5 col-sm-5 control-label"
            :for="`tool-wfsSearch-${selectableParameters.fieldName}-${selectableParameters.fieldId}-input`"
        >
            {{ inputLabel }}
        </label>
        <div class="col-md-7 col-sm-7">
            <component
                :is="htmlElement"
                :id="`tool-wfsSearch-${selectableParameters.fieldName}-${selectableParameters.fieldId}-input`"
                :class="{
                    'form-control': true,
                    'input-sm': htmlElement === 'select'
                }"
                :placeholder="htmlElement === 'input' ? selectableParameters.inputPlaceholder : ''"
                :defaultValue="htmlElement === 'input' ? selectableParameters.defaultValue : ''"
                :required="selectableParameters.required"
                :disabled="disabled"
                :aria-label="Array.isArray(inputLabel) ? selectableParameters.inputLabel : ''"
                @change="valueChanged($event.currentTarget.value)"
            >
                <template v-if="htmlElement === 'select'">
                    <option
                        value=""
                    >
                        {{ $t("common:modules.tools.wfsSearch.optionsPlaceholder") }}
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
