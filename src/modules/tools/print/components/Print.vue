<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import getComponent from "../../../../utils/getComponent";
import Tool from "../../Tool.vue";
import getters from "../store/gettersPrint";
import mutations from "../store/mutationsPrint";
import actions from "../store/actionsPrint";
/**
 * Tool to print a part of the map
 */
export default {
    name: "Print",
    components: {
        Tool
    },
    computed: {
        ...mapGetters("Tools/Print", Object.keys(getters)),
        ...mapGetters(["printSettings"]),
        ...mapActions("Tools/Print", Object.keys(actions)),
        ...mapGetters("Map", ["scales, clickCoord"]),
        ...mapGetters("Tools/Gfi", ["currentFeature"]),
        currentMapScale: {
            get () {
                return this.$store.state.Map.scale;
            },
            set (value) {
                this.$store.commit("Map/setScale", value);
            }
        }
    },
    watch: {
        active: function () {
            if (this.active) {
                this.setCurrentMapScale(this.$store.state.Map.scale);
                this.togglePostrenderListener();
            }
        }
    },

    /**
     * Lifecycle hook: adds a "close"-Listener to close the tool.
     * @returns {void}
     */
    created () {
        this.$on("close", this.close);
        this.setPrintSettings(this.printSettings);
        this.setCurrentLayoutName(this.printSettings.currentLayoutName);

        if (this.layoutList.length === 0) {
            this.retrieveCapabilites();
        }
    },
    methods: {
        ...mapMutations("Tools/Print", Object.keys(mutations)),
        ...mapActions("Tools/Print", [
            "retrieveCapabilites",
            "togglePostrenderListener",
            "getVisibleLayer"
        ]),

        returnScale (scale) {
            return scale < 10000 ? scale : scale.toString().substring(0, scale.toString().length - 3) + " " + scale.toString().substring(scale.toString().length - 3);
        },
        /**
         * Showing the hint information if the current print scale and the current map scale are not the same
         * @param {Event} evt - event that triggered from the mouseenter or mouseleave action
         * @returns {void}
         */
        showHintInfoScale (evt) {
            if (!evt?.type) {
                return;
            }

            if (evt.type === "mouseenter") {
                document.querySelector(".hint-info").style.display = "block";
            }
            else {
                document.querySelector(".hint-info").style.display = "none";
            }
        },

        isGfiAvailable () {
            return this.isGfiAvailable;
        },

        isGfiActive () {
            if (this.currentFeature !== null) {
                return true;
            }
            return false;
        },

        getGfiForPrint () {
            if (this.currentFeature !== null) {
                return [this.currentFeature.getMappedProperties(), this.currentFeature.getTitle(), this.clickCoord];
            }
            return [];
        },

        /**
         * todo
         * @returns {void}
         */
        print () {
            // set the Title to the input shit
            // dispatch them print
        },

        updateScale (scale) {
            debugger;
            this.setCurrentScale = scale;
        },

        selectGfi (evt) {
            this.setIsGfiSelected = evt.target.checked;
        },

        isGfiSelected () {
            return this.isGfiSelected;
        },

        /**
         * Sets active to false.
         * @returns {void}
         */
        close () {
            this.setActive(false);
        }
    }
};
</script>

<template lang="html">
    <Tool
        :title="$t(name)"
        :icon="glyphicon"
        :active="active"
        :show-in-sidebar="true"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-g-f-i="deactivateGFI"
    >
        <template #toolBody>
            <form
                id="printToolNew"
                class="form-horizontal"
            >
                <div class="form-group form-group-sm">
                    <label class="col-sm-5 control-label">{{ $t("common:modules.tools.print.titleLabel") }}</label>
                    <div class="col-sm-7">
                        <input
                            type="text"
                            class="form-control"
                            maxLength="45"
                            :value="title"
                        >
                    </div>
                </div>
                <div class="form-group form-group-sm">
                    <label class="col-sm-5 control-label">{{ $t("common:modules.tools.print.layoutLabel") }}</label>
                    <div class="col-sm-7">
                        <select
                            id="printLayout"
                            class="form-control input-sm"
                        >
                            <option
                                v-for="(layout, i) in layoutList"
                                :key="i"
                                :value="layout.name"
                                :selected="layout.name === currentLayoutName"
                            >
                                {{ layout.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-group form-group-sm">
                    <label class="col-sm-5 control-label">
                        {{ $t("common:modules.tools.print.formatLabel") }}
                    </label>
                    <div class="col-sm-7">
                        <select
                            id="printFormat"
                            class="form-control input-sm"
                        >
                            <option
                                v-for="(format, i) in formatList"
                                :key="i"
                                :value="format"
                                :selected="format === currentFormat"
                            >
                                {{ format }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="form-group form-group-sm scale">
                    <label class="col-sm-5 control-label">{{ $t("common:modules.tools.print.scaleLabel") }}</label>
                    <div class="col-sm-7">
                        <select
                            id="printScale"
                            class="form-control input-sm"
                        >
                            <option
                                v-for="(scale, i) in scaleList"
                                :key="i"
                                :value="scale"
                                :selected="scale === currentScale"
                                @click="updateScale(scale)"
                            >
                                1 : {{ returnScale(scale) }}
                            </option>
                        </select>
                    </div>
                    <div
                        v-if="currentScale !== currentMapScale"
                        class="hint"
                    >
                        <span class="glyphicon glyphicon-info-sign" />
                    </div>
                    <div class="hint-info">
                        {{ $t("common:modules.tools.print.hintInfoScale") }}
                    </div>
                </div>
                <div
                    class="form-group form-group-sm"
                >
                    <label class="col-sm-5 control-label">
                        {{ $t("common:modules.tools.print.withLegendLabel") }}
                    </label>
                    <div class="col-sm-7">
                        <div class="checkbox">
                            <input
                                id="printLegend"
                                type="checkbox"
                                :checked="isLegendSelected"
                            >
                        </div>
                    </div>
                </div>
                <div
                    v-if="isGfiAvailable && isGfiActive"
                    class="form-group form-group-sm"
                >
                    <label class="col-sm-5 control-label">
                        {{ $t("common:modules.tools.print.withInfoLabel") }}
                    </label>
                    <div class="col-sm-7">
                        <div class="checkbox">
                            <input
                                id="printGfi"
                                type="checkbox"
                                :value="isGfiSelected"
                                :checked="isGfiSelected"
                                @click="selectGfi"
                            >
                        </div>
                    </div>
                </div>
                <div class="form-group form-group-sm">
                    <div class="col-sm-12">
                        <button
                            type="button"
                            class="btn btn-lgv-grey btn-block"
                        >
                            {{ $t("common:modules.tools.print.printLabel") }}
                        </button>
                    </div>
                </div>
            </form>
        </template>
    </Tool>
</template>

<style lang="less" scoped>
    @import "~variables";

    input[type="checkbox"] {
        margin-top: 2px;
        margin-left: 0;
    }
    .form-group {
        &.scale{
            position: relative;
            .hint {
                position: absolute;
                width: 20px;
                right: -5px;
                top: 7px;
                cursor: pointer;
                text-align: center;
            }
            .hint-info {
                display: none;
                position: absolute;
                left: 0;
                top: 25px;
                width: 100%;
                z-index: 10;
                background: #fff;
                border: 1px solid #555;
                padding: 5px;
            }
        }
    }
</style>
