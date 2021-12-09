<script>
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersFilterGeneral";
import mutations from "../store/mutationsFilterGeneral";
import LayerFilterSnippet from "./LayerFilterSnippet.vue";
import {convertToNewConfig} from "../utils/convertToNewConfig";

export default {
    name: "FilterGeneral",
    components: {
        Tool,
        LayerFilterSnippet
    },
    data () {
        return {
            storePath: this.$store.state.Tools.FilterGeneral
        };
    },
    computed: {
        ...mapGetters("Tools/FilterGeneral", Object.keys(getters)),
        console: () => console
    },
    created () {
        this.$on("close", this.close);
    },
    mounted () {
        this.$nextTick(() => {
            this.initialize();
            // console.log("Alte Config", this.configs);
            // console.log("Neue Config", this.convertToNewConfig(this.configs));
        });
    },
    methods: {
        ...mapMutations("Tools/FilterGeneral", Object.keys(mutations)),
        ...mapActions("Tools/FilterGeneral", ["initialize"]),
        convertToNewConfig,
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
            <LayerFilterSnippet
                v-if="Array.isArray(layers) && layers.length"
                :layers-config="layers"
            />
        </template>
    </Tool>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
</style>
