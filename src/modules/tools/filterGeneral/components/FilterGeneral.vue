<script>
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersFilterGeneral";
import mutations from "../store/mutationsFilterGeneral";
import LayerFilterSnippet from "./LayerFilterSnippet.vue";
import {convertToNewConfig} from "../utils/convertToNewConfig";
import MapHandler from "../utils/mapHandler.js";
import {
    getFeaturesByLayerId,
    isFeatureInMapExtent,
    getLayerByLayerId,
    showFeaturesByIds,
    createLayerIfNotExists
} from "../utils/openlayerFunctions.js";

// will be replaced by api
import InterfaceOL from "../interfaces/interface.ol.js";
import IntervalRegister from "../utils/intervalRegister.js";

export default {
    name: "FilterGeneral",
    components: {
        Tool,
        LayerFilterSnippet
    },
    data () {
        return {
            storePath: this.$store.state.Tools.FilterGeneral,
            api: new InterfaceOL(new IntervalRegister(), {
                getFeaturesByLayerId,
                isFeatureInMapExtent
            }),
            mapHandler: new MapHandler({
                getLayerByLayerId,
                showFeaturesByIds,
                createLayerIfNotExists
            })
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
            <div v-if="Array.isArray(layers) && layers.length">
                <LayerFilterSnippet
                    v-for="(layerConfig, indexLayer) in layers"
                    :key="'layer-' + indexLayer"
                    :layer-config="layerConfig"
                    :api="api"
                    :map-handler="mapHandler"
                />
            </div>
        </template>
    </Tool>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
</style>
