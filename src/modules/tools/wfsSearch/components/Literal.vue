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
    }
};
</script>

<template>
    <!-- TODO: Warn if both clause and field are defined -->
    <!-- TODO: Find a way for the visual indicator for the "and" and "or"; also do something with the type -->
    <!-- TODO: Grouping of elements of a clause for visualization-->
    <div v-if="literal.clause">
        <template
            v-for="(lit, i) of literal.clause.literals"
        >
            <Literal
                :key="'tool-wfsSearch-clause-literal' + i"
                :literal="lit"
            />
        </template>
    </div>
    <Field
        v-else
        :default-value="literal.field.defaultValue"
        :field-id="literal.field.id"
        :field-name="literal.field.fieldName"
        :input-label="literal.field.inputLabel"
        :input-placeholder="literal.field.inputPlaceholder"
        :input-title="literal.field.inputTitle"
        :required="literal.field.required"
        :options="literal.field.options"
        :type="literal.field.type"
    />
</template>

<style scoped>

</style>
