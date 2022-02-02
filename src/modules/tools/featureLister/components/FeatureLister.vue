<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersFeatureLister";
import actions from "../store/actionsFeatureLister";
import mutations from "../store/mutationsFeatureLister";
import ToolTemplate from "../../ToolTemplate.vue";
import getComponent from "../../../../utils/getComponent";

export default {
    name: "FeatureLister",
    components: {
        ToolTemplate
    },
    computed: {
        ...mapGetters("Tools/FeatureLister", Object.keys(getters))
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapActions("Tools/FeatureLister", Object.keys(actions)),
        ...mapMutations("Tools/FeatureLister", Object.keys(mutations)),
        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);

            // TODO replace trigger when Menu is migrated
            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getComponent(this.$store.state.Tools.FeatureLister.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="glyphicon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <ul class="nav nav-tabs featurelist-navtabs">
                <li
                    id="featurelistThemeChooser"
                    class="active featurelist-navtabs-li text-center"
                    role="presentation"
                >
                    <a href="#">{{ $t("modules.tools.featureLister.chooseTheme") }}</a>
                </li>
                <li
                    id="featurelistFeaturelist"
                    class="featurelist-navtabs-li text-center disabled"
                    role="presentation"
                >
                    <a href="#">{{ $t("modules.tools.featureLister.list") }}</a>
                </li>
                <li
                    id="featurelistFeaturedetails"
                    class="featurelist-navtabs-li text-center disabled"
                    role="presentation"
                >
                    <a href="#">{{ $t("modules.tools.featureLister.details") }}</a>
                </li>
            </ul>
            <div
                id="featurelist-themes"
                class="featurelist-themes panel panel-default"
            >
                <div
                    id="featurelist-themes-header"
                    class="panel-heading"
                >
                    {{ $t("modules.tools.featureLister.visibleVectorLayers") }}
                </div>
                <ul
                    id="featurelist-themes-ul"
                    class="nav nav-pills nav-stacked"
                />
            </div>
        </template>
    </ToolTemplate>
</template>


<style lang="scss" scoped>
    @import "~/css/mixins.scss";
</style>
