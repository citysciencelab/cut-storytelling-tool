<script>
import Literal from "./Literal.vue";
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import {mapActions, mapGetters, mapMutations} from "vuex";
import actions from "../store/actionsWfsSearch";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";

export default {
    name: "WfsSearch",
    components: {
        Literal,
        Tool
    },
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters))
    },
    watch: {
        active () {
            if (this.selectSource) {
                this.retrieveData();
            }
        }
    },
    created () {
        // TODO: For each entry in 'instances', a WfsSearch Tool should be created
        this.$on("close", this.close);

        /*
        * TODO
        * Logic:
        * - Integration for remoteOptions regarding suggestions for input fields -> Find a way to make it look properly in the UI
        * - Create a separate Tool for each SearchInstance
        * - Query of the service --> Next up after commit
        *   + Difference between WFS@2.0.0 (Stored Query) and WFS@1.1.0 (query has to be built)
        */
    },
    methods: {
        ...mapMutations("Tools/WfsSearch", Object.keys(mutations)),
        ...mapActions("Tools/WfsSearch", Object.keys(actions)),
        close () {
            this.setActive(false);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template>
    <Tool
        :title="$t(name)"
        :icon="glyphicon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivateGFI="deactivateGFI"
        :initial-width="initialWidth"
    >
        <template v-slot:toolBody>
            <form
                class="form-horizontal"
                role="form"
            >
                <div
                    v-if="userHelp"
                    class="form-group form-group-sm"
                >
                    <div class="col-md-12 col-sm-12">
                        <!-- TODO: May need to add $t() to be properly displayed -->
                        {{ userHelp }}
                        <hr>
                    </div>
                </div>
                <template v-for="(clause, i) of clauses">
                    <Literal
                        :key="'tool-wfsSearch-clause' + i"
                        :literal="clause"
                    />
                    <hr :key="'tool-wfsSearch-clause-divider' + i">
                </template>
                <div class="form-group form-group-sm">
                    <div class="col-md-6 col-sm-6">
                        <button
                            type="button"
                            class="btn btn-lgv-grey col-md-12 col-sm-12"
                            @click="todoReset"
                        >
                            <!-- TODO: Translation -->
                            Reset
                        </button>
                    </div>
                    <div class="col-md-6 col-sm-6">
                        <button
                            type="button"
                            class="btn btn-lgv-grey col-md-12 col-sm-12"
                            @click="todoSuche"
                        >
                            <!-- TODO: Translation -->
                            Suche
                        </button>
                    </div>
                </div>
                <hr>
                <!-- TODO: - Result Table / List -> reusable? -->
            </form>
        </template>
    </Tool>
</template>

<style lang="less" scoped>
@import "~variables";
</style>
