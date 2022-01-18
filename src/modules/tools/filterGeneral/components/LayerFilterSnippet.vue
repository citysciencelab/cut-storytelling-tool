<script>
import ProgressBar from "./ProgressBar.vue";
import SnippetCheckbox from "./SnippetCheckbox.vue";
import SnippetDate from "./SnippetDate.vue";
import SnippetDateRange from "./SnippetDateRange.vue";
import SnippetDropdown from "./SnippetDropdown.vue";
import SnippetInput from "./SnippetInput.vue";
import SnippetSlider from "./SnippetSlider.vue";
import SnippetSliderRange from "./SnippetSliderRange.vue";
import isObject from "../../../../utils/isObject";
import FilterApi from "../interfaces/filter.api.js";

export default {
    name: "LayerFilterSnippet",
    components: {
        SnippetCheckbox,
        SnippetDate,
        SnippetDateRange,
        SnippetDropdown,
        SnippetInput,
        SnippetSlider,
        SnippetSliderRange,
        ProgressBar
    },
    props: {
        layerConfig: {
            type: Object,
            required: true
        },
        mapHandler: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            rules: [],
            paging: {
                page: 0,
                total: 0
            },
            disabled: false,
            showStop: false,
            layerModel: null,
            layerService: null,
            api: null
        };
    },
    watch: {
        paging () {
            if (this.paging.page >= this.paging.total) {
                this.setFormDisable(false);
            }
        }
    },
    created () {
        this.activateLayer(this.layerConfig?.layerId);
        this.setLayerService(this.layerModel);

        this.api = new FilterApi(this.layerConfig.filterId, this.layerService);
    },
    mounted () {
        if (Array.isArray(this.layerConfig?.snippets)) {
            this.layerConfig.snippets.forEach(snippet => {
                this.rules.push({
                    attrName: snippet.attrName
                });
            });
        }
    },
    methods: {
        /**
         * Checking if the snippet type exists
         * @param {Object} snippet the snippet configuration
         * @param {String} type the type
         * @returns {Boolean} true if the snippet type is the expected type
         */
        checkSnippetType (snippet, type) {
            return isObject(snippet) && Object.prototype.hasOwnProperty.call(snippet, "type") && snippet.type === type;
        },
        /**
         * Triggered when a rule changed at a snippet.
         * @param {Object} obj the message
         * @param {Number} obj.snippetId the id of the snippet matching the rules index
         * @param {Object} obj.rule the rule to set
         * @returns {void}
         */
        ruleChanged (obj) {
            const snippetId = obj?.snippetId;

            if (typeof snippetId !== "number" || snippetId >= this.rules.length) {
                return;
            }
            this.rules[snippetId] = obj?.rule;
        },
        /**
         * Returns the current rules with a plausability check.
         * @returns {Object[]} the rules as array of objects
         */
        getCurrentRules () {
            if (!Array.isArray(this.rules)) {
                return [];
            }
            const result = [];

            this.rules.forEach(rule => {
                if (typeof rule !== "object" || rule === null || !rule.attrName || !rule.operator) {
                    return;
                }
                result.push(rule);
            });

            return result;
        },
        /**
         * Filters the layer with the current snippet rules.
         * @returns {void}
         */
        filter () {
            const filterQuestion = {
                filterId: this.layerConfig.filterId,
                service: this.layerService,
                snippetId: false,
                commands: {
                    paging: this.layerConfig?.paging ? this.layerConfig.paging : 1000,
                    searchInMapExtent: this.layerConfig?.searchInMapExtent ? this.layerConfig.searchInMapExtent : false
                },
                rules: this.getCurrentRules()
            };

            this.setFormDisable(true);
            this.showStopButton(true);

            if (isObject(this.layerModel)) {
                this.layerModel.set("isSelected", true);
                this.layerModel.set("isVisible", true);

                this.layerModel.layer.getSource().on("featuresloadend", () => {
                    this.runApiFilter(filterQuestion);
                });

                if (this.layerModel.layer.getSource().getFeatures().length) {
                    this.runApiFilter(filterQuestion);
                }
            }
        },
        /**
         * Sets the disabled flag
         * @param {Boolean} disable true/false to en/disable form
         * @returns {void}
         */
        setFormDisable (disable) {
            this.disabled = disable;
        },
        /**
         * Showing or not Showing terminate button
         * @param {Boolean} value true/false to en/disable to show terminate button
         * @returns {void}
         */
        showStopButton (value) {
            this.showStop = value;
        },
        /**
         * Activating the layer for filtering
         * @param {String} layerId the layer Id from config
         * @returns {void}
         */
        activateLayer (layerId) {
            if (typeof layerId === "string" && (!this.layerConfig?.service || this.layerConfig?.service?.type.toLowerCase() === "ol")) {
                const layers = Radio.request("Map", "getLayers"),
                    visibleLayer = typeof layers?.getArray !== "function" ? [] : layers.getArray().filter(layer => {
                        return layer.getVisible() === true && layer.get("id") === layerId;
                    });

                if (Array.isArray(visibleLayer) && !visibleLayer.length) {
                    Radio.trigger("ModelList", "addModelsByAttributes", {"id": layerId});
                }

                this.layerModel = Radio.request("ModelList", "getModelByAttributes", {"id": layerId});
            }
        },
        /**
         * Setting layer service
         * @param {Object} layerModel the layer model
         * @returns {void}
         */
        setLayerService (layerModel) {
            if (isObject(this.layerConfig?.service)) {
                this.layerService = this.layerConfig?.service;
            }
            else if (isObject(layerModel) && typeof this.layerConfig?.service === "undefined") {
                this.layerService = {
                    "type": "OL",
                    "layerId": this.layerConfig?.layerId,
                    "url": layerModel.get("url"),
                    "typename": layerModel.get("featureType"),
                    "namespace": layerModel.get("featureNS")
                };
            }
            else if (layerModel === null && typeof this.layerConfig?.service === "undefined") {
                console.warn("Please check your configuration of layerId or service, the portal could not load them");
            }
        },
        /**
         * Running the api function to filter the layer
         * @param {Object} filterQuestion the filter parameters for api
         * @returns {void}
         */
        runApiFilter (filterQuestion) {
            this.api.filter(filterQuestion, filterAnswer => {
                this.paging = filterAnswer.paging;

                this.mapHandler.visualize(filterAnswer, error => {
                    console.warn("map error", error);
                });
            }, error => {
                console.warn("filter error", error);
            });
        },
        /**
         * Terminating the filter process by terminating every snippet
         * @returns {void}
         */
        stopfilter () {
            this.api.stop(() => {
                this.showStopButton(false);
                this.setFormDisable(false);
            },
            err => {
                console.warn(err);
            });
        }
    }
};
</script>

<template>
    <div
        class="panel-body"
    >
        <div
            v-if="Object.prototype.hasOwnProperty.call(layerConfig, 'snippets') && Array.isArray(layerConfig.snippets)"
        >
            <div
                v-for="(snippet, indexSnippet) in layerConfig.snippets"
                :key="'snippet-' + indexSnippet"
            >
                <div
                    v-if="checkSnippetType(snippet, 'checkbox')"
                    class="snippet"
                >
                    <SnippetCheckbox
                        :api="api"
                        :attr-name="snippet.attrName"
                        :disabled="disabled"
                        :info="snippet.info"
                        :label="snippet.label"
                        :operator="snippet.operator"
                        :prechecked="snippet.prechecked"
                        :snippet-id="indexSnippet"
                        :visible="snippet.visible"
                        @ruleChanged="ruleChanged"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'dropdown')"
                    class="snippet"
                >
                    <SnippetDropdown
                        :api="api"
                        :attr-name="snippet.attrName"
                        :add-select-all="snippet.addSelectAll"
                        :auto-init="snippet.autoInit"
                        :disabled="disabled"
                        :display="snippet.display"
                        :info="snippet.info"
                        :label="snippet.label"
                        :multiselect="snippet.multiselect"
                        :operator="snippet.operator"
                        :placeholder="snippet.placeholder"
                        :prechecked="snippet.prechecked"
                        :render-icons="snippet.renderIcons"
                        :snippet-id="indexSnippet"
                        :value="snippet.value"
                        :visible="snippet.visible"
                        @ruleChanged="ruleChanged"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'text')"
                    class="snippet"
                >
                    <SnippetInput
                        :api="api"
                        :attr-name="snippet.attrName"
                        :disabled="disabled"
                        :info="snippet.info"
                        :label="snippet.label"
                        :operator="snippet.operator"
                        :placeholder="snippet.placeholder"
                        :prechecked="snippet.prechecked"
                        :snippet-id="indexSnippet"
                        :visible="snippet.visible"
                        @ruleChanged="ruleChanged"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'date')"
                    class="snippet"
                >
                    <SnippetDate
                        :api="api"
                        :attr-name="snippet.attrName"
                        :disabled="disabled"
                        :info="snippet.info"
                        :format="snippet.format"
                        :label="snippet.label"
                        :max-value="snippet.maxValue"
                        :min-value="snippet.minValue"
                        :operator="snippet.operator"
                        :prechecked="snippet.prechecked"
                        :snippet-id="indexSnippet"
                        :visible="snippet.visible"
                        @ruleChanged="ruleChanged"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'dateRange')"
                    class="snippet"
                >
                    <SnippetDateRange
                        :api="api"
                        :attr-name="snippet.attrName"
                        :disabled="disabled"
                        :info="snippet.info"
                        :format="snippet.format"
                        :label="snippet.label"
                        :max-value="snippet.maxValue"
                        :min-value="snippet.minValue"
                        :operator="snippet.operator"
                        :prechecked="snippet.prechecked"
                        :snippet-id="indexSnippet"
                        :visible="snippet.visible"
                        @ruleChanged="ruleChanged"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'slider')"
                    class="snippet"
                >
                    <SnippetSlider
                        :api="api"
                        :attr-name="snippet.attrName"
                        :decimal-step="snippet.decimalStep"
                        :disabled="disabled"
                        :info="snippet.info"
                        :label="snippet.label"
                        :min-value="snippet.minValue"
                        :max-value="snippet.maxValue"
                        :operater="snippet.operator"
                        :prechecked="snippet.prechecked"
                        :snippet-id="indexSnippet"
                        :visible="snippet.visible"
                        @ruleChanged="ruleChanged"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'sliderRange')"
                    class="snippet"
                >
                    <SnippetSliderRange
                        :api="api"
                        :attr-name="snippet.attrName"
                        :decimal-step="snippet.decimalStep"
                        :disabled="disabled"
                        :info="snippet.info"
                        :label="snippet.label"
                        :min-value="snippet.minValue"
                        :max-value="snippet.maxValue"
                        :operater="snippet.operator"
                        :prechecked="snippet.prechecked"
                        :snippet-id="indexSnippet"
                        :visible="snippet.visible"
                        @ruleChanged="ruleChanged"
                    />
                </div>
            </div>
            <div class="snippet">
                <button
                    @click="filter()"
                >
                    Filtern
                </button>
                <button
                    v-if="paging.page < paging.total && showStop"
                    @click="stopfilter()"
                >
                    {{ $t("button.stop") }}
                </button>
                <ProgressBar
                    :paging="paging"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    .snippet {
        display: block;
        margin-bottom: 15px;
        b {
            display: block;
        }
    }
</style>
