<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import Literal from "./Literal.vue";
import actions from "../store/actionsWfsSearch";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";
import {searchFeatures} from "../utils/requests";

export default {
    name: "WfsSearch",
    components: {
        Literal,
        Tool
    },
    data: () => ({and: "and", or: "or"}),
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters)),
        ...mapGetters("Language", ["currentLocale"])
    },
    watch: {
        active (val) {
            (val ? this.prepareModule : this.resetModule)();
            if (this.userHelp !== "hide") {
                this.adjustUserHelp();
            }
        },
        currentLocale () {
            if (this.active && this.userHelp !== "hide") {
                this.adjustUserHelp();
            }
        }
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapMutations("Tools/WfsSearch", Object.keys(mutations)),
        ...mapActions("Tools/WfsSearch", Object.keys(actions)),
        adjustUserHelp () {
            const translatedAnd = i18next.t("common:modules.tools.wfsSearch.userHelp.and"),
                translatedOr = i18next.t("common:modules.tools.wfsSearch.userHelp.or");

            this.setUserHelp(this.userHelp
                .replaceAll(this.and, translatedAnd)
                .replaceAll(this.or, translatedOr));

            this.and = translatedAnd;
            this.or = translatedOr;
        },
        close () {
            this.setActive(false);
            this.resetModule(true);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        },
        async search () {
            const features = await searchFeatures(this.currentInstance, this.service);

            features.forEach(feature => {
                console.log(feature.values_);
            });
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
                <template v-if="instances.length > 1">
                    <div class="form-group form-group-sm">
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
                    >
                        {{ $t("common:modules.tools.wfsSearch.userHelp.text", {userHelp}) }}
                    </span>
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
                            @click="search"
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
