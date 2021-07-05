<script>
import Modal from "../../../../share-components/modals/Modal.vue";
import List from "../../../../share-components/list/List.vue";
import {mapActions, mapGetters, mapMutations} from "vuex";
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import Literal from "./Literal.vue";
import actions from "../store/actionsWfsSearch";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";
import {createUserHelp} from "../utils/literalFunctions";
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
        ...mapGetters("Language", ["currentLocale"]),
        headers () {
            const {resultList} = this.currentInstance,
                isObject = typeof resultList === "object";

            if (isObject) {
                return Object.assign({}, resultList);
            }
            if (resultList === "showAll") {
                const lengths = this.results.map(feature => Object.keys(feature.values_).length),
                    indexOfFeatureWithMostAttr = lengths.indexOf(Math.max(...lengths));

                return Object.keys(this.results[indexOfFeatureWithMostAttr].values_)
                    .reduce((acc, curr) => {
                        acc[curr] = curr;
                        return acc;
                    }, {});
            }
            return console.error("WfsSearch: Missing configuration for parameter resultList.");
        },
        geometryName () {
            return this.results[0].getGeometryName();
        },
        showResults () {
            return this.showResultList;
        }
    },
    watch: {
        active (val) {
            (val ? this.prepareModule : this.resetModule)();
        },
        currentLocale () {
            if (this.active && this.userHelp !== "hide") {
                createUserHelp(this.currentInstance.literals);
            }
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
        },
        async search () {
            Radio.trigger("Util", "showLoader");
            const features = await searchFeatures(this.$store, this.currentInstance, this.service);

            Radio.trigger("Util", "hideLoader");
            this.setResults([]);
            features.forEach(feature => {
                this.results.push(feature);
            });
            this.setShowResultList(true);
        }
    }
};
</script>

<template>
    <div>
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
                    <template
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
                        <hr>
                    </template>
                    <div
                        v-if="userHelp !== 'hide'"
                        class="form-group form-group-sm"
                    >
                        <i class="col-md-1 col-sm-1 glyphicon glyphicon-info-sign" />
                        <span
                            class="col-md-11 col-sm-11"
                            :aria-label="$t('common:modules.tools.wfsSearch.userHelp.label')"
                            v-html="$t('common:modules.tools.wfsSearch.userHelp.text', {userHelp})"
                        />
                    </div>
                    <hr>
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
                                @click="search"
                            >
                                {{ $t("common:modules.tools.wfsSearch.searchButton") }}
                            </button>
                        </div>
                        <div
                            v-if="results.length > 0 && headers"
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
        <Modal
            :title="$t(name)"
            :icon="glyphicon"
            :showModal="showResults"
            @modalHid="setShowResultList(false)"
        >
            <template v-if="showResults && results.length">
                <header slot="header">
                    <h4>{{ currentInstance.resultDialogTitle ? $t(currentInstance.resultDialogTitle) : $t(name) }}</h4>
                    <hr>
                </header>
                <List
                    :key="'tool-wfsSearch-list'"
                    :identifier="$t(name)"
                    :geometry-name="geometryName"
                    :table-heads="headers"
                    :table-data="results"
                />
            </template>
            <template v-else>
                <header slot="header">
                    <h4>{{ $t(name) }}</h4>
                    <hr>
                </header>
                <span>{{ $t("common:modules.tools.wfsSearch.noResults") }}</span>
            </template>
        </Modal>
    </div>
</template>

<style lang="less" scoped>
@import "~variables";
.btn {
    margin-top: 10px;
}
.form-group > span {
    display: inline-block;
}

</style>

<style lang="less">
    #modal-1-container {
        #modal-1-inner-wrapper {
            padding: 10px;
            min-width: 70vw;

            #modal-1-content-container {
                padding: 0;
                overflow: auto;
                max-height: 70vh;
            }
        }
}
</style>
