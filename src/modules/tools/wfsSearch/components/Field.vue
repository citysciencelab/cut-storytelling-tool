<script>
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";

export default {
    name: "Field",
    props: {
        defaultValue: {
            type: String,
            default: ""
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
        type: {
            type: String,
            default: "equal",
            validator: function (value) {
                return ["equal", "like"].indexOf(value) !== -1;
            }
        }
    },
    data () {
        return {
            disabled: false
        };
    },
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters)),
        htmlElement () {
            return this.options === null ? "input" : "select";
        },
        // TODO: Can this be moved somewhere else? -> Own store for a Field?
        selectableOptions () {
            const {options, parsedSource, addedOptions} = this;

            // Options are supposed to be retrieved from the external source
            if (typeof options === "string" && parsedSource !== null) {
                if (options === "") {
                    this.addOptions(options);
                    return Object.keys(parsedSource);
                }

                const keys = [],
                    optionsArr = options.split("."),
                    {length} = optionsArr;
                let option = options;

                // Root elements were not added yet
                if (!addedOptions.includes("")) {
                    this.disableField();
                    // TODO: Field needs to be disabled if '""' was not selected
                }
                // It needs to be checked whether all the necessary values have already been added
                for (let i = 0; i < length; i++) {
                    // Found element to add
                    if (i === length - 1) {
                        option = optionsArr[i];
                        this.addOptions(option);
                    }
                    // As values are added like 'foo.bar', for 'bar' to be selectable, 'foo' needs to be present
                    // This is the case, because 'bar' is a parameter of 'foo'
                    else if (!addedOptions.includes(optionsArr[i])) {
                        this.disableField();
                        // TODO: Field needs to be disabled if prior fields are not selected
                    }
                }

                Object.values(parsedSource).forEach(obj => {
                    keys.push(obj[option]);
                });
                return keys;
            }
            // Options are already given through the config
            else if (typeof options === "object") {
                return options;
            }
            return null;
        }
    },
    methods: {
        ...mapMutations("Tools/WfsSearch", Object.keys(mutations)),
        isObject (val) {
            return typeof val === "object";
        },
        disableField () {
            this.disabled = true;
        }
    }
};
// TODO: Utilize fieldName
// TODO: Utilize type
</script>

<template>
    <div class="form-group form-group-sm">
        <label
            v-if="inputLabel"
            class="col-md-5 col-sm-5 control-label"
            :for="`tool-wfsSearch-${fieldName}-input`"
        >
            {{ inputLabel }}
        </label>
        <div class="col-md-7 col-sm-7">
            <component
                :is="htmlElement"
                :id="`tool-wfsSearch-${fieldName}-input`"
                :class="{
                    'form-control': true,
                    'input-sm': htmlElement === 'select'
                }"
                :placeholder="htmlElement === 'input' ? inputPlaceholder : ''"
                :defaultValue="htmlElement === 'input' ? defaultValue : ''"
                :required="required"
                :disabled="disabled"
                @change="todoEventCall($event.currentTarget.value)"
            >
                <template v-if="htmlElement === 'select'">
                    <option
                        v-if="required"
                        value=""
                    >
                        <!-- TODO: Make this a translation -->
                        Please choose an element!
                    </option>
                    <option
                        v-for="option of selectableOptions"
                        :key="isObject(option) ? option.id : option"
                        :value="isObject(option) ? option.id : option"
                        :selected="defaultValue && !required ? defaultValue : ''"
                    >
                        {{ isObject(option) ? (option.displayName ? option.displayName : option.id) : option }}
                    </option>
                </template>
            </component>
        </div>
    </div>
</template>

<style scoped>

</style>
