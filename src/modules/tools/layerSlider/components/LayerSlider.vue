<script>
import {mapGetters, mapMutations} from "vuex";
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import getters from "../store/gettersLayerSlider";
import mutations from "../store/mutationsLayerSlider";

export default {
    name: "LayerSlider",
    components: {
        Tool
    },
    computed: {
        ...mapGetters("Tools/LayerSlider", Object.keys(getters))
    },
    watch: {
        active (isActive) {
            console.log("active");
        }
    },
    created () {
        console.log("created");
        this.$on("close", this.close);
    },
    mounted () {
        // this.checkIfLayermodelExist(this.layerIds);
    },
    methods: {
        ...mapMutations("Tools/LayerSlider", Object.keys(mutations)),

        /**
         * Sets active to false.
         * @returns {void}
         */
        close () {
            this.setActive(false);
            // The value "isActive" of the Backbone model is also set to false to change the CSS class in the menu (menu/desktop/tool/view.toggleIsActiveClass)
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        },

        /**
         * Starts the Windows interval once.
         * @returns {void}
         */
        startInterval: function () {
            if (this.windowsInterval === null) {
                this.forwardLayer();
                this.setWindowsInterval(this.forwardLayer);
            }
        },

        /**
         * Finds the next index in the array in a loop.
         * @returns {void}
         */
        forwardLayer: function () {
            const index = this.getActiveIndex(),
                max = this.layerIds.length - 1;

            if (index > -1 && index < max) {
                this.setActiveIndex(index + 1);
            }
            else {
                this.setActiveIndex(0);
            }
        },

        /**
         * Finds the previous index in the array in a loop.
         * @returns {void}
         */
        backwardLayer: function () {
            const index = this.getActiveIndex(),
                max = this.layerIds.length - 1;

            if (index > 0) {
                this.setActiveIndex(index - 1);
            }
            else {
                this.setActiveIndex(max);
            }
        },

        /**
         * Finds the index in the layerIds array to the activeLayerId or returns -1.
         * @returns {Number} Index im Array mit activeLayerId.
         */
        getActiveIndex: function () {
            return this.layerIds.findIndex(layer => layer.layerId === this.activeLayer.layerId);
        },

        /**
         * Finds the activeLayerId based on the index and initiates storage.
         * @param {Number} index Index in layerIds.
         * @returns {void}
         */
        setActiveIndex: function (index) {
            this.setActiveLayer(this.layerIds[index]);
            this.toggleLayerVisibility(this.activeLayer.layerId);
        },

        /**
         * Determines the visibility of the layerIds
         * @param {String} activeLayerId Id des activeLayer.
         * @returns {void}
         */
        toggleLayerVisibility: function (activeLayerId) {
            this.layerIds.forEach(layer => {
                const status = layer.layerId === activeLayerId;

                this.sendModification(layer.layerId, status);
            });
        },

        /**
         * Triggers the new visibility over the radio
         * @param {String} layerId The layerId
         * @param {Boolean} status Visibility true / false
         * @param {Number} [transparency=0] Transparency of layer.
         * @returns {void}
         */
        sendModification: function (layerId, status, transparency = 0) {
            Radio.trigger("ModelList", "setModelAttributesById", layerId, {
                isSelected: status,
                isVisibleInMap: status,
                transparency: transparency
            });
        },

        /**
         * Resets the tool.
         * @returns {void}
         */
        reset: function () {
            this.stopInterval();
            this.setActiveLayer({layerId: ""});
        },

        /**
         * Stops the windows interval.
         * @returns {void}
         */
        stopInterval: function () {
            const windowsInterval = this.windowsInterval;

            if (typeof windowsInterval !== "undefined") {
                clearInterval(windowsInterval);
                this.setWindowsInterval(null);
            }
        }

        // /**
        //  * Checks if the layer model already exists.
        //  * @param {object[]} layerIds - Configuration of the layers from config.json
        //  * @returns {void}
        //  */
        // checkIfLayermodelExist: function (layerIds) {
        //     layerIds.forEach(layer => {
        //         if (Radio.request("ModelList", "getModelsByAttributes", {id: layer.layerId}).length === 0) {
        //             this.addLayerModel(layer.layerId);
        //         }
        //     });
        // },

        // /**
        //  * Adds the layer model briefly to the model to run prepareLayerObject and then removes the model again.
        //  * @param {string} layerId - Id of the layer
        //  * @returns {void}
        //  */
        // addLayerModel: function (layerId) {
        //     Radio.trigger("ModelList", "addModelsByAttributes", {id: layerId});
        //     this.sendModification(layerId, true);
        //     this.sendModification(layerId, false);
        // },

        // /**
        //  * Triggers the new visibility over the radio
        //  * @param {string} layerId - layerId
        //  * @param {boolean} status - Visibility true / false
        //  * @param {Number} transparency Transparency of layer.
        //  * @returns {void}
        //  */
        // sendModification: function (layerId, status, transparency) {
        //     const transp = transparency || 0;

        //     Radio.trigger("ModelList", "setModelAttributesById", layerId, {
        //         isSelected: status,
        //         isVisibleInMap: status,
        //         transparency: transp
        //     });
        // }
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
    >
        <template #toolBody>
            <div
                v-if="active"
                id="layer-slider"
            >
                <h5>
                    {{ $t(title) }}
                </h5>
                <div
                    v-if="sliderType === 'player'"
                    class="player"
                >
                    <div class="progress">
                        <div
                            class="progress-bar"
                            role="progressbar"
                            aria-valuenow="0"
                            aria-valuemin="0"
                            :aria-valuemax="layerIds.length"
                        />
                    </div>
                    <div class="input-group">
                        <span class="input-group-btn">
                            <button
                                v-if="windowsInterval === null"
                                id="play"
                                type="button"
                                class="btn btn-default active-button"
                                @click="startInterval"
                            >
                                <span
                                    class="glyphicon glyphicon-play"
                                    aria-hidden="true"
                                />
                            </button>
                            <button
                                v-else
                                id="pause"
                                type="button"
                                class="btn btn-default active-button"
                                @click="stopInterval"
                            >
                                <span
                                    class="glyphicon glyphicon-pause"
                                    aria-hidden="true"
                                />
                            </button>
                            <button
                                id="stop"
                                type="button"
                                class="btn btn-default active-button"
                                @click="reset"
                            >
                                <span
                                    class="glyphicon glyphicon-stop"
                                    aria-hidden="true"
                                />
                            </button>
                            <button
                                id="backward"
                                type="button"
                                class="btn btn-default active-button"
                            >
                                <span
                                    class="glyphicon glyphicon-backward"
                                    aria-hidden="true"
                                />
                            </button>
                            <button
                                id="forward"
                                type="button"
                                class="btn btn-default active-button"
                            >
                                <span
                                    class="glyphicon glyphicon-forward"
                                    aria-hidden="true"
                                />
                            </button>
                            <button
                                id="title"
                                type="button"
                                class="btn btn-default disabled"
                            >
                                <span
                                    aria-hidden="true"
                                >
                                    {{ $t("common:modules.tools.layerSlider.titleNotConfigured") }}
                                </span>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </Tool>
</template>

<style lang="less" scoped>
@import "../../../../../css/mixins.less";
@import "~variables";

@color_1: #eee;
@color_2: black;
@background_color_1: rgb(85, 85, 85);
@background_color_2: #eee;

.progress-bar {
    background-color: @secondary_focus;
    transition: all .6s;
}
.progress {
    height: 25px;
    background-color: @background_color_2;
}
.active-button {
    background-color: @background_color_2;
    transition: all .2s ease-in-out;
    &:focus {
        .primary_action_focus();
    }
    &:hover {
        .primary_action_hover();
    }
}

.btn.disabled {
    background-color: @background_color_2;
    opacity: 1;
    padding: 7px 12px 6px 12px;
    > span {
        font-family: @font_family_default;
    }
}
</style>
