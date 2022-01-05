<script>
import ToolTemplate from "../../ToolTemplate.vue";
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
import LayerList from "../components/LayerList.vue";

// will be replaced by api
import InterfaceOL from "../interfaces/interface.ol.js";
import IntervalRegister from "../utils/intervalRegister.js";

export default {
    name: "FilterGeneral",
    components: {
        ToolTemplate,
        LayerFilterSnippet,
        LayerList
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
            }),
            selectedLayers: [],
            alreadySelectedLayers: []
        };
    },
    computed: {
        ...mapGetters("Tools/FilterGeneral", Object.keys(getters)),
        console: () => console,
        alreadySelectedLayersConfig () {
            if (!this.layerSelectorVisible) {
                return this.layers;
            }
            return this.layers.filter(layer => {
                return this.alreadySelectedLayers.includes(layer.layerId);
            });
        }
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
        },
        /**
         * Update selectedLayers array.
         * @param {String[]|String} layerIds ids which should be added or removed
         * @returns {Object[]} selected layer fetched from config
         */
        updateSelectedLayers (layerIds) {
            if (!Array.isArray(layerIds) && typeof layerIds !== "string") {
                return;
            }
            const confLayers = this.layers.filter(layer => {
                return Array.isArray(layerIds) ? layerIds.includes(layer.layerId) : layer.layerId === layerIds;
            });

            if (Array.isArray(layerIds)) {
                layerIds.forEach(layerId => {
                    if (!this.alreadySelectedLayers.includes(layerId)) {
                        this.alreadySelectedLayers.push(layerId);
                    }
                });
            }
            else {
                this.alreadySelectedLayers.push(layerIds);
            }

            this.selectedLayers = confLayers;
        },
        /**
         * Check if layer filter should be displayed.
         * @param {String} layerId layerid to check
         * @returns {Boolean} true if should be displayed false if not
         */
        showLayerSnippet (layerId) {
            if (!Array.isArray(this.selectedLayers)) {
                return false;
            }
            if (!this.layerSelectorVisible) {
                return true;
            }
            return this.selectedLayers.some(selectedLayer => {
                return selectedLayer.layerId === layerId;
            });
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
        :initial-width="300"
    >
        <template #toolBody>
            <div
                v-if="active"
                id="tool-general-filter"
            />
            <LayerList
                v-if="Array.isArray(layers) && layers.length && layerSelectorVisible"
                class="layerSelector"
                :layers="layers"
                :multi-layer-selector="multiLayerSelector"
                @updateselectedlayers="updateSelectedLayers"
            >
                <template
                    #default="slotProps"
                >
                    <div
                        :class="['panel-collapse', 'collapse', showLayerSnippet(slotProps.layer.layerId) ? 'in' : '']"
                        role="tabpanel"
                    >
                        <LayerFilterSnippet
                            :layer-config="slotProps.layer"
                            :api="api"
                            :map-handler="mapHandler"
                        />
                    </div>
                </template>
            </LayerList>
            <div v-else-if="Array.isArray(layers) && layers.length">
                <LayerFilterSnippet
                    v-for="(layerConfig, indexLayer) in layers"
                    :key="'layer-' + indexLayer"
                    :layer-config="layerConfig"
                    :api="api"
                    :map-handler="mapHandler"
                />
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
</style>
