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
        api: {
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
            }
        };
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
         * Returns the service object for the filter question based on config.
         * @returns {Object} the service object to use
         */
        getService () {
            if (typeof this.layerConfig?.layerId === "string") {
                return {
                    layerId: this.layerConfig.layerId
                };
            }
            return this.layerConfig?.service ? this.layerConfig.service : {};
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
                service: this.getService(),
                filterId: 1,
                snippetId: false,
                commands: {
                    paging: this.layerConfig?.paging ? this.layerConfig.paging : 1000,
                    searchInMapExtent: this.layerConfig?.searchInMapExtent ? this.layerConfig.searchInMapExtent : false
                },
                rules: this.getCurrentRules()
            };

            this.api.filter(filterQuestion, filterAnswer => {
                this.paging = filterAnswer.paging;

                this.mapHandler.visualize(filterAnswer, error => {
                    console.warn("map error", error);
                });
            }, error => {
                console.warn("filter error", error);
            });
        }
    }
};
</script>

<template>
    <div>
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
                        :label="snippet.label"
                        :operator="snippet.operator"
                        :prechecked="snippet.prechecked"
                        :visible="snippet.visible"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'dropdown')"
                    class="snippet"
                >
                    <SnippetDropdown
                        :multiselect="Object.prototype.hasOwnProperty.call(snippet, 'multiselect') ? snippet.multiselect : 'false'"
                        :operator="Object.prototype.hasOwnProperty.call(snippet, 'operater') ? snippet.operator : 'EQ'"
                        :value="Object.prototype.hasOwnProperty.call(snippet, 'value') ? snippet.value : ''"
                        :label="Object.prototype.hasOwnProperty.call(snippet, 'label') ? snippet.label : ''"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'text')"
                    class="snippet"
                >
                    <SnippetInput
                        :snippet-id="indexSnippet"
                        :attr-name="snippet.attrName"
                        :label="snippet.label"
                        :operator="snippet.operator"
                        :placeholder="snippet.placeholder"
                        :prechecked="snippet.prechecked"
                        :visible="snippet.visible"
                        @ruleChanged="ruleChanged"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'date')"
                    class="snippet"
                >
                    <SnippetDate
                        :attr-name="snippet.attrName"
                        :format="snippet.format"
                        :label="snippet.label"
                        :max-value="snippet.maxValue"
                        :min-value="snippet.minValue"
                        :operator="snippet.operator"
                        :prechecked="snippet.prechecked"
                        :visible="snippet.visible"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'dateRange')"
                    class="snippet"
                >
                    <SnippetDateRange
                        :attr-name="snippet.attrName"
                        :format="snippet.format"
                        :label="snippet.label"
                        :max-value="snippet.maxValue"
                        :min-value="snippet.minValue"
                        :operator="snippet.operator"
                        :prechecked="snippet.prechecked"
                        :visible="snippet.visible"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'slider')"
                    class="snippet"
                >
                    <SnippetSlider
                        :attr-name="snippet.attrName"
                        :decimal-step="snippet.decimalStep"
                        :label="snippet.label"
                        :min-value="snippet.minValue"
                        :max-value="snippet.maxValue"
                        :operater="snippet.operator"
                        :prechecked="snippet.prechecked"
                        :visible="snippet.visible"
                    />
                </div>
                <div
                    v-else-if="checkSnippetType(snippet, 'sliderRange')"
                    class="snippet"
                >
                    <SnippetSliderRange
                        :operator="Object.prototype.hasOwnProperty.call(snippet, 'operater') ? snippet.operater : 'BETWEEN'"
                        :values="Object.prototype.hasOwnProperty.call(snippet, 'value') ? snippet.value : ''"
                        :label="Object.prototype.hasOwnProperty.call(snippet, 'label') ? snippet.label : ''"
                    />
                </div>
            </div>
        </div>
        <div class="snippet">
            <button
                @click="filter()"
            >
                Filtern
            </button>
            <ProgressBar
                :paging="paging"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    .snippet {
        display: block;
        margin-bottom: 20px;
        b {
            display: block;
        }
    }
</style>
