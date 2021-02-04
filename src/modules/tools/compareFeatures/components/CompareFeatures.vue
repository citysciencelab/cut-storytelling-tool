<script>
import Tool from "../../Tool.vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersCompareFeatures";
import actions from "../store/actionsCompareFeatures";
import mutations from "../store/mutationsCompareFeatures";

export default {
    name: "CompareFeatures",
    components: {
        Tool
    },
    computed: {
        ...mapGetters("Tools/CompareFeatures", Object.keys(getters))
    },

    /**
     * Lifecycle hook: adds a "close"-Listener to close the tool.
     * @returns {void}
     */
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapActions("Tools/CompareFeatures", Object.keys(actions)),
        ...mapMutations("Tools/CompareFeatures", Object.keys(mutations)),

        /**
         * Closes this tool window by setting active to false.
         * @returns {void}
         */
        close () {
            this.setActive(false);
            // set the backbone model to active false in modellist for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            const model = Radio.request("ModelList", "getModelByAttributes", {id: this.$store.state.Tools.CompareFeatures.id});

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template lang="html">
    <Tool
        :title="$t(name)"
        :icon="glyphicon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivateGFI="deactivateGFI"
    >
        <template v-slot:toolBody>
            <div
                v-if="active && !hasFeatures"
                id="no-features"
            >
                <h1>
                    {{ name }}
                </h1>
                <p>
                    {{ $t("common:modules.tools.compareFeatures.noFeatures.nothingSelected", {objects: $t("common:modules.tools.compareFeatures.noFeatures.objectName")}) }}
                </p>
                <p>
                    {{ $t("common:modules.tools.compareFeatures.noFeatures.info", {iconEmptyStar: emptyStar, iconYellowStar: yellowStar}) }}
                    <!-- TODO: Glyphicons don´t work -->
                </p>
            </div>
            <div
                v-if="active && hasFeatures"
                id="compare-features"
            > <p>Ich habe Feature</p>
            </div>
        </template>
    </Tool>
</template>

<style lang="less" scoped>
    @import "~variables";

    label {
        margin-top: 7px;
    }
    #no-features {
        color: red;
    }
</style>
