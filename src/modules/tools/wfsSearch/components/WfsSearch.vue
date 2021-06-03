<script>
import Modal from "../../../../share-components/modals/Modal.vue";
import Literal from "./Literal.vue";
import List from "../../../../share-components/list/List.vue";
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import {mapActions, mapGetters, mapMutations} from "vuex";
import actions from "../store/actionsWfsSearch";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";
import {searchFeatures} from "../utils/requests";

export default {
    name: "WfsSearch",
    components: {
        Literal,
        List,
        Tool,
        Modal
    },
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters)),
        headers () {
            if (Array.isArray(this.currentInstance.resultList)) {
                this.setCustomTableHeaders(true);
                return [...this.currentInstance.resultList];
            }
            else if (this.currentInstance.resultList === "showAll") {
                const lengths = [];
                let indexOfFeatureWithMostAttr = "";

                this.results.forEach(feature => {
                    lengths.push(Object.keys(feature.values_).length);
                });
                indexOfFeatureWithMostAttr = lengths.indexOf(Math.max(...lengths));
                return Object.keys(this.results[indexOfFeatureWithMostAttr].values_);
            }
            return console.error("Missing configuration for result list");
        },
        showResults () {
            return this.showResultList;
        }
    },
    watch: {
        active (val) {
            (val ? this.prepareModule : this.resetModule)();
        }
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapMutations("Tools/WfsSearch", Object.keys(mutations)),
        ...mapActions("Tools/WfsSearch", Object.keys(actions)),
        searchFeatures,
        close () {
            this.setActive(false);
            this.resetModule(true);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
// TODO: Vorschläge für Inputfelder und Dropdowns für fieldNames sind noch zu implementieren
</script>

<template>
    <div>
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
                            v-if="currentInstance.userHelp"
                            class="form-group form-group-sm"
                        >
                            <div class="col-md-12 col-sm-12">
                                {{ $t(currentInstance.userHelp) }}
                            </div>
                            <hr>
                        </div>
                        <template v-for="(literal, i) of currentInstance.literals">
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
                                    @click="resetResult"
                                >
                                    {{ $t("common:modules.tools.wfsSearch.resetButton") }}
                                </button>
                            </div>
                            <div class="col-md-6 col-sm-6">
                                <button
                                    type="button"
                                    class="btn btn-lgv-grey col-md-12 col-sm-12"
                                    :disabled="requiredFields"
                                    @click="searchFeatures(currentInstance, service)"
                                >
                                    {{ $t("common:modules.tools.wfsSearch.searchButton") }}
                                </button>
                            </div>
                            <div
                                v-if="results.length > 0"
                                class="col-md-12 col-sm-12"
                            >
                                <button
                                    type="button"
                                    class="btn btn-lgv-grey col-md-12 col-sm-12"
                                    @click="setShowResultList(true)"
                                >
                                    {{ $t("common:modules.tools.wfsSearch.showResults") + " " + `(${results.length})` }}
                                </button>
                            </div>
                        </div>
                    </form>
                </template>
            </Tool>
        </template>
        <template>
            <Modal
                :title="$t(name)"
                :icon="glyphicon"
                :showModal="showResults"
                @modalHid="setShowResultList(false)"
            >
                <div
                    v-if="showResults"
                    slot="header"
                >
                    <h4>{{ currentInstance.resultDialogTitle ? $t(currentInstance.resultDialogTitle) : $t(name) }}</h4>
                    <hr>
                </div>
                <div v-if="showResults">
                    <List
                        :key="'tool-wfsSearch-list'"
                        :identifier="$t(name)"
                        :tableHeads="headers"
                        :tableData="results"
                    />
                </div>
            </Modal>
        </template>
    </div>
</template>

<style lang="less" scoped>
@import "~variables";
.btn {
    margin-top: 10px;
}
</style>

<style lang="less">
    #modal-1-container #modal-1-overlay {
        z-index: 1000;
    }
    #modal-1-container #modal-1-inner-wrapper #modal-1-content-container {
        padding: 0;
        overflow: auto;
        max-height: 70vh;
        overflow: auto;
    }
    #modal-1-container #modal-1-inner-wrapper {
        padding: 10px;
        min-width: 70vw;
    }
</style>
