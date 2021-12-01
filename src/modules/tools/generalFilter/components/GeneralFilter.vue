<script>
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersGeneralFilter";
import mutations from "../store/mutationsGeneralFilter";
import LayerFilterSnippet from "./LayerFilterSnippet.vue";

export default {
    name: "GeneralFilter",
    components: {
        Tool,
        LayerFilterSnippet
    },
    data () {
        return {
            storePath: this.$store.state.Tools.GeneralFilter
        };
    },
    computed: {
        ...mapGetters("Tools/GeneralFilter", Object.keys(getters)),
        console: () => console
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapMutations("Tools/GeneralFilter", Object.keys(mutations)),

        close () {
            this.setActive(false);
            const model = getComponent(this.storePath.id);

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
        :deactivate-gfi="deactivateGFI"
        :initial-width="300"
    >
        <template #toolBody>
            <div
                v-if="active"
                id="tool-general-filter"
            />
            <LayerFilterSnippet />
        </template>
    </Tool>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
</style>
