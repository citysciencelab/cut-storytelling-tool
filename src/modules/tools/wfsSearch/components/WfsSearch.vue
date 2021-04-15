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
        active (val) {
            (val ? this.prepareModule : this.resetModule)();
        }
    },
    created () {
        this.$on("close", this.close);
        /*
        * TODO
        * Logic:
        * - Integration for remoteOptions regarding suggestions for input fields -> Find a way to make it look properly in the UI
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
// TODO: Prequeries should be used through the requestConfig; the fieldName is known
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
                    v-if="instances.length > 1"
                    class="form-group form-group-sm"
                >
                    <label
                        class="col-md-5 col-sm-5 control-label"
                        for="tool-wfsSearch-instances-select"
                    >
                        {{ $t("common:modules.tools.wfsSearch.instancesSelectLabel") }}
                        <!-- TODO: Add me to the language files-->
                    </label>
                    <div class="col-md-7 col-sm-7">
                        <select
                            id="tool-wfsSearch-instances-select"
                            class="form-control input-sm"
                            required
                            @change="instanceChanged($event.currentTarget.value)"
                        >
                            <option
                                v-for="({title}, i) of instances"
                                :key="title + i"
                                :value="i"
                            >
                                {{ title }}
                            </option>
                        </select>
                    </div>
                </div>
                <hr v-if="instances.length > 1">
                <div
                    v-if="instances[currentInstance].userHelp"
                    class="form-group form-group-sm"
                >
                    <div class="col-md-12 col-sm-12">
                        <!-- TODO: May need to add $t() to be properly displayed -->
                        {{ instances[currentInstance].userHelp }}
                    </div>
                    <hr>
                </div>
                <template v-for="(literal, i) of instances[currentInstance].literals">
                    <Literal
                        :key="'tool-wfsSearch-clause' + i"
                        :literal="literal"
                    />
                    <hr :key="'tool-wfsSearch-clause-divider' + i">
                </template>
                <div class="form-group form-group-sm">
                    <div class="col-md-6 col-sm-6">
                        <button
                            type="button"
                            class="btn btn-lgv-grey col-md-12 col-sm-12"
                        >
                            <!-- TODO: Add @click event -->
                            {{ $t("common:modules.tools.wfsSearch.resetButton") }}
                        </button>
                    </div>
                    <div class="col-md-6 col-sm-6">
                        <button
                            type="button"
                            class="btn btn-lgv-grey col-md-12 col-sm-12"
                            :disabled="requiredFields"
                            @click="searchFeatures"
                        >
                            {{ $t("common:modules.tools.wfsSearch.searchButton") }}
                        </button>
                    </div>
                </div>
                <hr> <!-- TODO: The divider should only be shown if there is a result table / list -->
                <!-- TODO: - Result Table / List -> reusable? -->
            </form>
        </template>
    </Tool>
</template>

<style lang="less" scoped>
@import "~variables";
</style>
