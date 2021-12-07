<script>
import SnippetButton from "./SnippetButton.vue";
import SnippetCheckbox from "./SnippetCheckbox.vue";
import SnippetDate from "./SnippetDate.vue";
import SnippetDropdown from "./SnippetDropdown.vue";
import SnippetInput from "./SnippetInput.vue";
import SnippetSlider from "./SnippetSlider.vue";
import isObject from "../../../../utils/isObject";

export default {
    name: "LayerFilterSnippet",
    components: {
        SnippetCheckbox,
        SnippetDate,
        SnippetDropdown,
        SnippetInput,
        SnippetSlider,
        SnippetButton
    },
    props: {
        layersConfig: {
            type: Array,
            required: true
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
        }
    }
};
</script>

<template>
    <div>
        <div
            v-for="(layerConfig, index) in layersConfig"
            :key="index"
        >
            <div
                v-if="Object.prototype.hasOwnProperty.call(layerConfig, 'snippets') && Array.isArray(layerConfig.snippets)"
            >
                <div
                    v-for="(snippet, indexFilter) in layerConfig.snippets"
                    :key="snippet.attrName + '-' + indexFilter"
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
                            :label="snippet.label"
                            :operator="snippet.operator"
                            :placeholder="snippet.placeholder"
                            :prechecked="snippet.prechecked"
                            :visible="snippet.visible"
                        />
                    </div>
                    <div
                        v-else-if="checkSnippetType(snippet, 'date')"
                        class="snippet"
                    >
                        <SnippetDate
                            :operator="Object.prototype.hasOwnProperty.call(snippet, 'operater') ? snippet.operator : 'EQ'"
                            :value="Object.prototype.hasOwnProperty.call(snippet, 'value') ? snippet.value : ''"
                            :label="Object.prototype.hasOwnProperty.call(snippet, 'label') ? snippet.label : ''"
                        />
                    </div>
                    <div
                        v-else-if="checkSnippetType(snippet, 'dateRange')"
                        class="snippet"
                    >
                        <SnippetDate
                            :operator="Object.prototype.hasOwnProperty.call(snippet, 'operater') ? snippet.operator : 'BETWEEN'"
                            :value="Object.prototype.hasOwnProperty.call(snippet, 'value') ? snippet.value : ''"
                            :label="Object.prototype.hasOwnProperty.call(snippet, 'label') ? snippet.label : ''"
                        />
                    </div>
                    <div
                        v-else-if="checkSnippetType(snippet, 'slider')"
                        class="snippet"
                    >
                        <SnippetSlider
                            :operater="Object.prototype.hasOwnProperty.call(snippet, 'operater') ? snippet.operator : 'BETWEEN'"
                            :value="Object.prototype.hasOwnProperty.call(snippet, 'value') ? snippet.value : ''"
                            :label="Object.prototype.hasOwnProperty.call(snippet, 'label') ? snippet.label : ''"
                        />
                    </div>
                    <div
                        v-else-if="checkSnippetType(snippet, 'sliderRange')"
                        class="snippet"
                    >
                        <SnippetSlider
                            :operator="Object.prototype.hasOwnProperty.call(snippet, 'operater') ? snippet.operater : 'BETWEEN'"
                            :values="Object.prototype.hasOwnProperty.call(snippet, 'value') ? snippet.value : ''"
                            :label="Object.prototype.hasOwnProperty.call(snippet, 'label') ? snippet.label : ''"
                        />
                    </div>
                </div>
            </div>
            <div class="snippet">
                <SnippetButton />
            </div>
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
