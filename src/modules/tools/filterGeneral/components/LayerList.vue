<script>
export default {
    name: "LayerList",
    props: {
        layers: {
            type: Array,
            required: true,
            default: () => {
                return [];
            }
        },
        multiLayerSelector: {
            type: Boolean,
            reuired: false,
            default: false
        }
    },
    data () {
        return {
            selectedLayers: []
        };
    },
    watch: {
        selectedLayers () {
            this.$emit("updateselectedlayers", this.selectedLayers);
        }
    },
    methods: {
        /**
         * Updates selectedLayers array.
         * @param {String} filterId id which should be removed or added to selectedLayers array
         * @returns {void}
         */
        updateSelectedLayers (filterId) {
            if (typeof filterId !== "number") {
                return;
            }

            if (!this.multiLayerSelector) {
                this.selectedLayers = this.selectedLayers.includes(filterId) ? [] : [filterId];
                return;
            }

            const index = this.selectedLayers.indexOf(filterId);

            if (index >= 0) {
                this.selectedLayers.splice(index, 1);
            }
            else {
                this.selectedLayers.push(filterId);
            }
        },
        /**
         * Check if Selector should be disabled.
         * @param {String} filterId id to check if should be disabled
         * @returns {void}
         */
        disabled (filterId) {
            return !this.multiLayerSelector && this.selectedLayers.length > 0 && !this.selectedLayers.includes(filterId);
        },
        /**
         * Emitting the function by transfering the filter Id of layer
         * @param {String} filterId id to check if should be disabled
         * @returns {void}
         */
        setLayerLoaded (filterId) {
            this.$emit("setLayerLoaded", filterId);
        }
    }
};
</script>

<template>
    <div
        class="panel-group"
        role="tablist"
        aria-multiselectable="true"
    >
        <div
            v-for="layer in layers"
            :key="layer.filterId"
            class="panel panel-default"
            @click="setLayerLoaded(layer.filterId)"
            @keydown.enter="setLayerLoaded(layer.filterId)"
        >
            <div
                :class="['panel-heading', disabled(layer.filterId) ? 'disabled' : '']"
                role="tab"
            >
                <h2
                    :class="['panel-title', disabled(layer.filterId) ? 'disabled' : '']"
                    @click="updateSelectedLayers(layer.filterId)"
                    @keydown.enter="updateSelectedLayers(layer.filterId)"
                >
                    <a
                        role="button"
                        data-toggle="collapse"
                        data-parent="#accordion"
                        :disabled="disabled(layer.filterId)"
                    >
                        {{ layer.title ? layer.title : layer.layerId }}
                    </a>
                </h2>
                <slot
                    :layer="layer"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
    .panel-heading {
        cursor:default;
        background-color: white !important;
    }
    .panel-heading.disabled {
        background-color: #f5f5f5 !important;
    }
    .panel-title {
        cursor: pointer;
    }
</style>
