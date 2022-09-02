<script>
import ToolTemplate from "../../ToolTemplate.vue";
import getComponent from "../../../../utils/getComponent";
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersFilter";
import mutations from "../store/mutationsFilter";
import LayerFilterSnippet from "./LayerFilterSnippet.vue";
import MapHandler from "../utils/mapHandler.js";
import {compileLayers} from "../utils/compileLayers.js";
import {
    getLayerByLayerId,
    showFeaturesByIds,
    createLayerIfNotExists,
    zoomToFilteredFeatures,
    zoomToExtent,
    addLayerByLayerId,
    setParserAttributeByLayerId,
    getLayers,
    isUiStyleTable,
    setFilterInTableMenu,
    getSnippetInfos
} from "../utils/openlayerFunctions.js";
import LayerCategory from "./LayerCategory.vue";
import isObject from "../../../../utils/isObject.js";
import GeometryFilter from "./GeometryFilter.vue";

export default {
    name: "FilterGeneral",
    components: {
        ToolTemplate,
        GeometryFilter,
        LayerFilterSnippet,
        LayerCategory
    },
    data () {
        return {
            storePath: this.$store.state.Tools.Filter,
            mapHandler: new MapHandler({
                getLayerByLayerId,
                showFeaturesByIds,
                createLayerIfNotExists,
                zoomToFilteredFeatures,
                zoomToExtent,
                addLayerByLayerId,
                setParserAttributeByLayerId,
                getLayers
            }),
            layerConfigs: [],
            layerLoaded: {},
            layerFilterSnippetPostKey: "",
            filterGeometry: false
        };
    },
    computed: {
        ...mapGetters("Tools/Filter", Object.keys(getters)),
        console: () => console,
        filtersOnly () {
            return this.layerConfigs.filter(layer => {
                return isObject(layer) && !Object.prototype.hasOwnProperty.call(layer, "category");
            });
        },
        categoriesOnly () {
            return this.layerConfigs.filter(layer => {
                return isObject(layer) && Object.prototype.hasOwnProperty.call(layer, "category");
            });
        }
    },
    created () {
        this.$on("close", this.close);
    },
    mounted () {
        this.convertConfig({
            snippetInfos: getSnippetInfos()
        });

        this.layerConfigs = compileLayers(this.layers);

        this.$nextTick(() => {
            if (isUiStyleTable()) {
                setFilterInTableMenu(this.$el.querySelector("#tool-general-filter"));
                this.$el.remove();
            }
        });
    },
    methods: {
        ...mapMutations("Tools/Filter", Object.keys(mutations)),
        ...mapActions("Tools/Filter", [
            "initialize",
            "convertConfig",
            "updateRules",
            "deleteAllRules",
            "updateFilterHits"
        ]),

        close () {
            this.setActive(false);
            const model = getComponent(this.storePath.id);

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * Updates the selected categories in the store.
         * @param {String[]} categories An array of the categories name.
         * @return {void}
         */
        updateSelectedCategories (categories) {
            if (!Array.isArray(categories)) {
                return;
            }
            this.setSelectedCategories(categories);
        },
        /**
         * Update selectedAccordions array.
         * @param {String[]|String} filterIds ids which should be added or removed
         * @returns {Object[]} selected layer fetched from config
         */
        updateSelectedAccordions (filterIds) {
            if (!Array.isArray(filterIds) && typeof filterIds !== "number") {
                return;
            }
            const confLayers = this.transformLayerConfig(this.layerConfigs, filterIds);

            for (const layer of this.layerConfigs) {
                if (layer?.category) {
                    const filteredSubLayer = this.transformLayerConfig(layer.layers, filterIds);

                    if (filteredSubLayer.length === 0) {
                        continue;
                    }
                    confLayers.push({
                        category: layer.category,
                        layers: filteredSubLayer
                    });
                }
            }
            this.setSelectedAccordions(confLayers);
        },
        /**
         * Transform given layer config to an lightweight array of layerIds and filterIds.
         * @param {Object[]} configs The layer configs.
         * @param {String[]} filterIds The filter ids.
         * @returns {Object[]} array of lightweight filter objects which includes filterId and layerId.
         */
        transformLayerConfig (configs, filterIds) {
            const layers = [];

            configs.forEach(layerConfig => {
                if (Array.isArray(filterIds) && filterIds.includes(layerConfig.filterId) || layerConfig.filterId === filterIds) {
                    layers.push({
                        layerId: layerConfig.layerId,
                        filterId: layerConfig.filterId
                    });
                }
            });
            return layers;
        },
        /**
         * Check if layer filter should be displayed.
         * @param {String} filterId filterId to check
         * @returns {Boolean} true if should be displayed false if not
         */
        isLayerFilterSelected (filterId) {
            if (!Array.isArray(this.selectedAccordions)) {
                return false;
            }
            if (!this.layerSelectorVisible) {
                return true;
            }
            return this.selectedAccordions.filter(selectedLayer => {
                if (selectedLayer.category) {
                    return selectedLayer.layers.filter(subLayer => {
                        return subLayer.filterId === filterId;
                    }).length > 0;
                }
                return selectedLayer.filterId === filterId;
            }).length > 0;
        },
        /**
         * Setting the layer loaded true if the layer is clicked from the filter Id
         * @param {String} filterId filterId to check
         * @returns {void}
         */
        setLayerLoaded (filterId) {
            this.layerLoaded[filterId] = true;
        },
        /**
         * Setting the post key for layerFilterSnippet
         * @param {String} value the post key of layerFilterSnippet
         * @returns {void}
         */
        setLayerFilterSnippetPostKey (value) {
            this.layerFilterSnippetPostKey = value;
        },
        /**
         * Sets the geometry/area to filter in.
         * @param {ol/geom/Geometry|Boolean} geometry The geometry (polygon, cycle, etc.) or false.
         * @returns {void}
         */
        updateFilterGeometry (geometry) {
            this.filterGeometry = geometry;
        },
        /**
         * Checks if the geometry selector should be visible.
         * @returns {Boolean} true if the geometry selector should be visible.
         */
        isGeometrySelectorVisible () {
            return isObject(this.geometrySelectorOptions) && this.geometrySelectorOptions.visible !== false;
        },
        /**
         * Sets the active state of the gfi based on the given param.
         * @param {Boolean} active True to enable it, false to disable it
         * @returns {void}
         */
        setGfiActive (active) {
            if (typeof active !== "boolean") {
                return;
            }
            this.$store.commit("Tools/Gfi/setActive", active);
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        icon="bi-funnel-fill"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :initial-width="450"
    >
        <template #toolBody>
            <div
                v-if="active"
                id="tool-general-filter"
            >
                <GeometryFilter
                    v-if="isGeometrySelectorVisible()"
                    :circle-sides="geometrySelectorOptions.circleSides"
                    :default-buffer="geometrySelectorOptions.defaultBuffer"
                    :geometries="geometrySelectorOptions.geometries"
                    :invert-geometry="geometrySelectorOptions.invertGeometry"
                    :fill-color="geometrySelectorOptions.fillColor"
                    :stroke-color="geometrySelectorOptions.strokeColor"
                    :stroke-width="geometrySelectorOptions.strokeWidth"
                    @updateFilterGeometry="updateFilterGeometry"
                    @setGfiActive="setGfiActive"
                />
                <LayerCategory
                    v-if="Array.isArray(layerConfigs) && layerConfigs.length && layerSelectorVisible"
                    class="layerSelector"
                    :filters-only="filtersOnly"
                    :categories-only="categoriesOnly"
                    :changed-selected-layers="selectedAccordions"
                    :selected-categories="selectedCategories"
                    :multi-layer-selector="multiLayerSelector"
                    @selectedaccordions="updateSelectedAccordions"
                    @selectedcategories="updateSelectedCategories"
                    @setLayerLoaded="setLayerLoaded"
                >
                    <template
                        #default="slotProps"
                    >
                        <div
                            :class="['accordion-collapse', 'collapse', isLayerFilterSelected(slotProps.layer.filterId) ? 'show' : '']"
                            role="tabpanel"
                        >
                            <LayerFilterSnippet
                                v-if="isLayerFilterSelected(slotProps.layer.filterId) || layerLoaded[slotProps.layer.filterId]"
                                :api="slotProps.layer.api"
                                :layer-config="slotProps.layer"
                                :map-handler="mapHandler"
                                :min-scale="minScale"
                                :live-zoom-to-features="liveZoomToFeatures"
                                :filter-rules="rulesOfFilters[slotProps.layer.filterId]"
                                :filter-hits="filtersHits[slotProps.layer.filterId]"
                                :filter-geometry="filterGeometry"
                                :is-layer-filter-selected="isLayerFilterSelected"
                                @updateRules="updateRules"
                                @deleteAllRules="deleteAllRules"
                                @updateFilterHits="updateFilterHits"
                            />
                        </div>
                    </template>
                </LayerCategory>
                <div v-else-if="Array.isArray(layerConfigs) && layerConfigs.length">
                    <LayerFilterSnippet
                        v-for="(layerConfig, indexLayer) in filtersOnly"
                        :key="'layer-' + indexLayer + layerFilterSnippetPostKey"
                        :api="layerConfig.api"
                        :layer-config="layerConfig"
                        :map-handler="mapHandler"
                        :min-scale="minScale"
                        :live-zoom-to-features="liveZoomToFeatures"
                        :filter-rules="rulesOfFilters[layerConfig.filterId]"
                        :filter-hits="filtersHits[layerConfig.filterId]"
                        :filter-geometry="filterGeometry"
                        :is-layer-filter-selected="true"
                        @updateRules="updateRules"
                        @deleteAllRules="deleteAllRules"
                        @updateFilterHits="updateFilterHits"
                    />
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
</style>
