<script>
import Field from "./Field.vue";

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
    }
};
</script>

<template>
    <!-- TODO: Warn if both clause and field are defined -->
    <!-- TODO: Find a way for the visual indicator for the "and" and "or"; also do something with the type -->
    <!-- TODO: Should clauses have the below class or should this be set on the Field -> Grouping of elements of a clause -->
    <div
        v-if="literal.clause"
        class="form-group form-group-sm"
    >
        <template
            v-for="lit of literal.clause.literals"
        >
            <!-- TODO: Add proper keys -->
            <Literal
                :key="'lit' + lit"
                :literal="lit"
            />
        </template>
    </div>
    <!-- TODO: Check if the v-bind does the trick -> Leads to prop invalidity (console warning) -->
    <Field
        v-else
        v-bind="literal.field"
    />
    <!-- TODO: Maybe conditionally add a divider? -->
</template>

<style scoped>

</style>
