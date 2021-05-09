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
        ...mapGetters("Tools/WfsSearch", Object.keys(getters))
    },
    mounted () {
        const {clause, field} = this.literal;

        if (clause && field) {
            console.warn("WfsSearch: Both 'clause' and 'field' were defined on the literal. The clause part will be skipped and the field will be used.");
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
        :field-id="literal.field.id"
        :field-name="literal.field.fieldName"
        :input-label="literal.field.inputLabel"
        :input-placeholder="literal.field.inputPlaceholder"
        :input-title="literal.field.inputTitle"
        :required="literal.field.required"
        :options="literal.field.options"
        :type="literal.field.type"
        :dropdownInputUsesId="literal.field.usesId"
    />
    <!-- TODO: This div can be styled for visual highlighting -> Also, visual error probably comes from here! -->
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
