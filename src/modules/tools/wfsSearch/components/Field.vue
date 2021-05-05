<script>
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";
import {fieldValueChanged} from "../utils/literalFunctions";

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

            // TODO: Test me against a usable external file, which uses the dot separated syntax; nesting
            if (typeof this.options === "string" && notRoot && this.parsedSource !== null && Object.keys(this.selectedOptions).length > 0) {
                const optionsArr = this.options.split("."),
                    selectedValues = [];

                // Check if the prior needed parameters are selected
                selectedValues.push(...Object.keys(this.selectedOptions));

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
                let keys = [];

                if (this.options === "") {
                    if (this.dropdownInputUsesId) {
                        // TODO: The loop below can be copied for the significant parts below
                        Object.entries(this.parsedSource).forEach(([key, {id}]) => keys.push({fieldValue: id, displayName: `${key} (${id})`}));
                        return keys;
                    }

                    return Object.keys(this.parsedSource);
                }

                const optionsArr = this.options.split("."),
                    currentOption = optionsArr[optionsArr.length - 1];

                if (Object.keys(this.selectedOptions).includes("")) {
                    // TODO: Implement the dropdownInputUsesId part against a usable external file, which uses the dot separated syntax
                    if (optionsArr.length === 1) {
                        keys = this.parsedSource[this.selectedOptions[""]][currentOption];
                    }
                    else if (this.selectedOptions.includes("ALL DA VALUES")) {
                        // TODO: Implement me against a usable external file, which uses the dot separated syntax; nesting
                    }
                }
                return keys;
            }
            // Options are already given through the config
            else if (typeof this.options === "object") {
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
        valueChanged (value) {
            // NOTE: The extra object is sadly needed so that the object is reactive :(
            this.setRequiredValues({...fieldValueChanged(this.fieldId, value, this.instances[this.currentInstance].literals, this.requiredValues)});

            if (typeof this.options === "string") {
                this.setSelectedOptions({options: this.options, value});
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
            {{ inputLabel }}
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
                :defaultValue="htmlElement === 'input' ? defaultValue : ''"
                :required="required"
                :disabled="disabled"
                @change="valueChanged($event.currentTarget.value)"
            >
                <template v-if="htmlElement === 'select'">
                    <option
                        value=""
                    >
                        {{ $t("common:modules.tools.wfsSearch.optionsPlaceholder") }}
                    </option>
                    <!-- TODO: The value part can and will lead to problems when using with objects that are not from the external source -->
                    <option
                        v-for="option of selectableOptions"
                        :key="isObject(option) ? option.fieldValue : option"
                        :value="isObject(option) ? option.fieldValue : option"
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
