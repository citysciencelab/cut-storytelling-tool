<script>
import Field from "./Field.vue";
import {mapGetters} from "vuex";
import getters from "../store/gettersWfsSearch";

export default {
    name: "Literal",
    components: {
        Field
    },
    props: {
        literal: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters)),
        suggestionsLength () {
            return this.currentInstance?.suggestionsLength;
        }
    }
};
</script>

<template>
    <!-- TODO: Find a way for the visual indicator for the "and" and "or"; also do something with the type -->
    <Field
        v-if="literal.field"
        :key="`tool-wfsSearch-clause-literal-field-${literal.field.id}-${literal.field.fieldName}`"
        :default-value="literal.field.defaultValue"
        :dropdown-input-uses-id="literal.field.usesId"
        :field-id="literal.field.id"
        :field-name="literal.field.fieldName"
        :input-label="literal.field.inputLabel"
        :input-placeholder="literal.field.inputPlaceholder"
        :input-title="literal.field.inputTitle"
        :options="literal.field.options"
        :required="literal.field.required"
        :suggestions-length="suggestionsLength"
        :type="literal.field.type"
    />
    <!-- TODO: This div can be styled for visual highlighting -> Also, weird UI behaviour when a field is "dangling" between clauses cause of this -->
    <div v-else-if="literal.clause">
        <template
            v-for="(lit, i) of literal.clause.literals"
        >
            <Literal
                :key="'tool-wfsSearch-clause-literal' + i"
                :literal="lit"
            />
        </template>
    </div>
</template>

<style scoped>

</style>
