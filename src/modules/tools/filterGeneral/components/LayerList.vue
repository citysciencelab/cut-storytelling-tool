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
         * @param {String} layerId id which should be removed or added to selectedLayers array
         * @returns {void}
         */
        updateSelectedLayers (layerId) {
            if (typeof layerId !== "string") {
                return;
            }

            if (!this.multiLayerSelector) {
                this.selectedLayers = this.selectedLayers.includes(layerId) ? [] : [layerId];
                return;
            }

            const index = this.selectedLayers.indexOf(layerId);

            if (index >= 0) {
                this.selectedLayers.splice(index, 1);
            }
            else {
                this.selectedLayers.push(layerId);
            }
        },
        /**
         * Check if Selector should be disabled.
         * @param {String} layerId id to check if should be disabled
         * @returns {void}
         */
        disabled (layerId) {
            return !this.multiLayerSelector && this.selectedLayers.length > 0 && !this.selectedLayers.includes(layerId);
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
            :key="layer.layerId"
            class="panel panel-default"
        >
            <div
                :class="['panel-heading', disabled(layer.layerId) ? 'disabled' : '']"
                role="tab"
            >
                <h2
                    :class="['panel-title', disabled(layer.layerId) ? 'disabled' : '']"
                    @click="updateSelectedLayers(layer.layerId)"
                    @keydown.enter="updateSelectedLayers(layer.layerId)"
                >
                    <a
                        role="button"
                        data-toggle="collapse"
                        data-parent="#accordion"
                        :disabled="disabled(layer.layerId)"
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
