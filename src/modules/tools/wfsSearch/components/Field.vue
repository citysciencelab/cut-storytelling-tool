<script>
import {mapGetters} from "vuex";
import getters from "../store/gettersWfsSearch";

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
            default: ""
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
            type: String || Array,
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
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters)),
        htmlElement () {
            return this.options === null ? "input" : "select";
        },
        selectableOptions () {
            const {options} = this;

            if (typeof options === "string") {
                // TODO: If options is a String, receive the choosable parameters from the requestConfig
            }
            else if (typeof options === "object") {
                return options;
            }

            return null;
        }
    },
    methods: {
        isObject (val) {
            return typeof val === "object";
        }
    }
};
// TODO: Utilize fieldName
// TODO: Utilize type
</script>

<template>
    <div>
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
                :class="'form-control' + htmlElement === 'select' ? 'input-sm' : ''"
                :placeholder="htmlElement === 'input' ? inputPlaceholder : ''"
                :defaultValue="htmlElement === 'input' ? defaultValue : ''"
                :required="required"
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
