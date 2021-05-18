<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import actions from "../store/actionsWfsSearch";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";
import {buildXmlFilter} from "../utils/buildFilter";
import {fieldValueChanged} from "../utils/literalFunctions";
import {buildPath, getOptions, prepareOptionsWithId} from "../utils/pathFunctions";
import {searchFeatures} from "../utils/requests";

export default {
    name: "Field",
    props: {
        defaultValue: {
            type: String,
            default: ""
        },
        dropdownInputUsesId: {
            type: Boolean,
            default: false
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
        options: {
            type: [String, Array],
            default: null
        },
        required: {
            type: Boolean,
            default: false
        },
        suggestionsLength: {
            type: Number,
            default: undefined
        },
        type: {
            type: String,
            default: "equal",
            validator: function (value) {
                return ["equal", "like"].indexOf(value) !== -1;
            }
        }
    },
    data: () => ({showLoader: false, suggestions: [], value: ""}),
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
        },
        showSuggestions () {
            return !this.options && typeof this.suggestionsLength !== "undefined" && this.value.length >= this.suggestionsLength;
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
        ...mapActions("Tools/WfsSearch", Object.keys(actions)),
        async valueChanged (val) {
            const value = this.value = this.htmlElement === "input" || val === "" ? val : JSON.parse(val).value;

            // NOTE: The extra object is sadly needed so that the object is reactive :(
            this.setRequiredValues({...fieldValueChanged(this.fieldId, value, this.currentInstance.literals, this.requiredValues)});

            if (typeof this.options === "string") {
                const index = val === "" ? 0 : JSON.parse(val).index;

                this.setSelectedOptions({options: this.options, value, index});
            }
            else if (this.showSuggestions) {
                this.showLoader = true;
                const xmlFilter = buildXmlFilter({fieldName: this.fieldName, type: "like", value}),
                    suggestions = await searchFeatures(this.currentInstance, this.service, xmlFilter);

                this.showLoader = false;
                // Retrieve the values for the fieldName and make sure they are unique.
                this.suggestions = [...new Set(suggestions.map(v => v.values_[this.fieldName]))];
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
                :list="htmlElement === 'input' && showSuggestions ? `tool-wfsSearch-${fieldName}-${fieldId}-input-suggestions` : ''"
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
            <!-- TODO: Can this be made barrierefrei or is it already? -->
            <i
                v-if="htmlElement === 'input' && showLoader"
                id="todo"
                class="loader"
            />
            <datalist
                v-if="htmlElement === 'input'"
                :id="`tool-wfsSearch-${fieldName}-${fieldId}-input-suggestions`"
            >
                <option
                    v-for="(value, index) in suggestions"
                    :key="value + index"
                    :value="value"
                >
                    {{ value }}
                </option>
            </datalist>
        </div>
    </div>
</template>

<style lang="less" scoped>
/* Loader CSS based on https://codepen.io/lopis/pen/zwprzP  */

.loader {
    position: relative;
    bottom: 2em;
    left: 87.5%;
    height: 1.5em;
    width: 1.5em;
    display: inline-block;
    animation: around 5.4s infinite;

    &:after, &:before {
        content: "";
        background: white;
        position: absolute;
        display: inline-block;
        width: 100%;
        height: 100%;
        border-width: 0.15em;
        border-color: #333 #333 transparent transparent;
        border-style: solid;
        border-radius: 1em;
        box-sizing: border-box;
        top: 0;
        left: 0;
        animation: around 0.7s ease-in-out infinite;
    }

    &:after {
        animation: around 0.7s ease-in-out 0.1s infinite;
        background: transparent;
    }
}

@keyframes around {
    0% {
        transform: rotate(0deg)
    }
    100% {
        transform: rotate(360deg)
    }
}
</style>
