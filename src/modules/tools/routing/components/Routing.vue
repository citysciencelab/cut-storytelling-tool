<script>
import Tool from "../../Tool.vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersRouting";
import actions from "../store/actionsRouting";
import mutations from "../store/mutationsRouting";
import * as constantsRouting from "../store/constantsRouting";
import RoutingLoadingSpinner from "./RoutingLoadingSpinner.vue";

export default {
    name: "Routing",
    components: {
        Tool,
        RoutingLoadingSpinner
    },
    data () {
        return {
            constantsRouting
        };
    },
    computed: {
        ...mapGetters("Tools/Routing", Object.keys(getters)),
        ...mapGetters("Tools/Routing/Directions", ["isLoadingDirections"]),
        ...mapGetters("Tools/Routing/Isochrones", ["isLoadingIsochrones"]),
        ...mapGetters("QuickHelp", {quickHelpActive: "active"}),
        /**
         * Computed value to get the current component for the active tab
         * @returns {Object} vue component to render
         */
        activeRoutingToolOptionComponent () {
            return this.filteredRoutingToolOptions.find(option => option.id === this.activeRoutingToolOption)?.component;
        }
    },
    async created () {
        this.$on("close", this.close);
        // updateMap is called too late in Tool.vue when routing tool is set to active:true in config.json
        if (!this.renderToWindow) {
            Radio.trigger("Map", "updateSize");
        }
        try {
            await this.initRouting();
        }
        catch (e) {
            this.addSingleAlert({
                category: this.$t("common:modules.alerting.categories.error"),
                content: e.message
            });
            this.$emit("close");
        }
    },
    methods: {
        ...mapMutations("Tools/Routing", Object.keys(mutations)),
        ...mapActions("Tools/Routing", Object.keys(actions)),
        ...mapActions("Alerting", ["addSingleAlert"]),
        /**
         * Closes this tool window by setting active to false and removes the marker if it was placed.
         * @returns {void}
         */
        close () {
            this.setActive(false);
            // set the backbone model to active false in modellist for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            const model = Radio.request("ModelList", "getModelByAttributes", {
                id: this.$store.state.Tools.Routing.id
            });

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * Changes the active tab
         * Will not change the tab if a batch process is running
         * @param {String} option to change to
         * @returns {void}
         */
        changeActiveRoutingToolOption (option) {
            if (this.taskHandler) {
                return;
            }
            this.setActiveRoutingToolOption(option);
        },
        /**
         * Toggles the quickHelp module with the routing option
         * @returns {void}
         */
        showHelp () {
            if (this.quickHelpActive) {
                Radio.trigger("QuickHelp", "closeWindowHelp");
            }
            else {
                Radio.trigger("QuickHelp", "showWindowHelp", "routing");
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
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <div
                v-if="active"
                id="routing"
            >
                <div
                    class="d-flex"
                >
                    <div
                        v-for="routingToolOption of filteredRoutingToolOptions"
                        :key="routingToolOption.id"
                        :style="{
                            width: `calc(100% / ${filteredRoutingToolOptions.length})`,
                        }"
                        :class="[
                            'routingtooltab d-flex justify-content-center py-4 pointer',
                            activeRoutingToolOption === routingToolOption.id ? 'active' : '',
                        ]"
                        @click="changeActiveRoutingToolOption(routingToolOption.id)"
                        @keydown.enter="changeActiveRoutingToolOption(routingToolOption.id)"
                    >
                        <span class="glyphicon glyphicon-option-vertical" />
                        <span>{{ $t("common:modules.tools.routing.tabs." + routingToolOption.id) }}</span>
                        <RoutingLoadingSpinner
                            v-if="(routingToolOption.id === 'DIRECTIONS' && isLoadingDirections) || (routingToolOption.id === 'ISOCHRONES' && isLoadingIsochrones)"
                            class="ml-2"
                        />
                    </div>

                    <div
                        class="d-flex flex-column justify-content-center ml-2"
                        :title="$t('common:modules.tools.routing.helpTooltip')"
                        @click="showHelp()"
                        @keydown.enter="showHelp()"
                    >
                        <span class="glyphicon glyphicon-question-sign" />
                    </div>
                </div>


                <hr>

                <component :is="activeRoutingToolOptionComponent" />
            </div>
        </template>
    </Tool>
</template>

<style lang="less" scoped>
@import "~variables";
.d-flex {
  display: flex;
}
.flex-column {
    flex-direction: column;
}
.justify-content-center {
  justify-content: center;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.ml-2 {
    margin-left: 0.5rem;
}
.pointer {
  cursor: pointer;
}
.routingtooltab.active {
  background: #dbdbdb;
}
.glyphicon-question-sign {
    font-size: 20px;
}
</style>
