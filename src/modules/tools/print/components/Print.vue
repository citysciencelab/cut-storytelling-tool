<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import Tool from "../../Tool.vue";
import getters from "../store/gettersPrint";
import mutations from "../store/mutationsPrint";
import getComponent from "../../../../utils/getComponent";
import thousandsSeparator from "../../../../utils/thousandsSeparator.js";
import axios from "axios";

/**
 * Tool to print a part of the map
 */
export default {
    name: "Print",
    components: {
        Tool
    },
    data () {
        return {
            showHintInfoScale: false
        };
    },
    computed: {
        ...mapGetters("Tools/Print", Object.keys(getters)),
        ...mapGetters("Map", ["scales, size", "scale"]),
        ...mapGetters("Tools/Gfi", ["currentFeature"]),
        currentScale: {
            get () {
                return this.$store.state.Tools.Print.currentScale;
            },
            set (value) {
                this.setCurrentScale(value);
            }
        },
        documentTitle: {
            get () {
                return this.title;
            },
            set (value) {
                this.setTitle(value);
            }
        }
    },
    watch: {
        active: function () {
            if (this.active) {
                this.retrieveCapabilites();
                this.setCurrentMapScale(this.scale);
            }
            this.togglePostrenderListener();
        },
        scale: function (value) {
            this.setCurrentMapScale(value);
        }
    },

    /**
     * Lifecycle hook: adds a "close"-Listener to close the tool.
     * sets listener to laylerlist.
     * @returns {void}
     */
    created () {
        this.$on("close", this.close);

        Backbone.Events.listenTo(Radio.channel("ModelList"), {
            "updatedSelectedLayerList": function () {
                if (typeof this.eventListener !== "undefined") {
                    this.setVisibleLayer(this.visibleLayerList.concat(this.invisibleLayer));
                    this.updateCanvasLayer();
                }
            }
        });
    },
    mounted () {
        if (this.layoutList.length === 0) {
            this.$nextTick(() => {
                if (this.active) {
                    this.retrieveCapabilites();
                    this.setCurrentMapScale(this.scale);
                }
                this.togglePostrenderListener();
            });
        }

        this.setCurrentMapScale(this.scale);
    },
    methods: {
        ...mapMutations("Tools/Print", Object.keys(mutations)),
        ...mapActions("Tools/Print", [
            "retrieveCapabilites",
            "togglePostrenderListener",
            "createMapFishServiceUrl",
            "startPrint",
            "getOptimalResolution",
            "updateCanvasLayer"
        ]),

        /**
         * returns the "beautified" scale to be shown in the dropdown box
         * @param {Number} scale the scale to beautify
         * @returns {String} the beautified scale
         */
        returnScale (scale) {
            if (typeof scale !== "number") {
                return "";
            }
            else if (scale < 10000) {
                return String(scale);
            }
            return thousandsSeparator(scale, " ");
        },
        /**
         * if Scale is changed
         * @param {event} event the click event
         * @returns {void}
         */
        scaleChanged (event) {
            const scale = parseInt(event.target.value, 10),
                resolution = {
                    "scale": scale,
                    "mapSize": Radio.request("Map", "getSize"),
                    "printMapSize": this.layoutMapInfo
                };

            this.setIsScaleSelectedManually(true);
            this.getOptimalResolution(resolution);
            this.updateCanvasLayer();
            Radio.trigger("Map", "render");
        },

        /**
         * if Layout is changed
         * @param {String} value the chosen layout
         * @returns {void}
         */
        layoutChanged (value) {
            this.setCurrentLayoutName(value);
            this.updateCanvasLayer();
            Radio.trigger("Map", "render");
        },

        /**
         * returns if gfi is available
         * @returns {boolean} if gfi is available
         */
        showGfiAvailable () {
            return this.isGfiAvailable;
        },

        /**
         * starts the print
         * @returns {void}
         */
        print () {
            this.startPrint(async (url, payload) => {
                return axios.post(url, payload);
            });
            this.setPrintStarted(true);
        },

        /**
         * Selcts the gfi
         * @param {event} evt the click event
         * @returns {void}
         */
        selectGfi (evt) {
            this.setIsGfiSelected = evt.target.checked;
        },
        /**
         * Downloads the pdf for print
         * @param {Event} event the click event
         * @returns {void}
         */
        downloadFile (event) {
            event.preventDefault();
            const a = document.createElement("A");

            a.href = this.fileDownloadUrl;
            a.download = this.fileDownloadUrl.substr(this.fileDownloadUrl.lastIndexOf("/") + 1);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

        /**
         * Sets active to false.
         * @param {event} event the click event
         * @returns {void}
         */
        close (event) {
            event.stopPropagation();
            this.setActive(false);

            // TODO replace trigger when ModelList is migrated
            // set the backbone model to active false in modellist for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            const model = getComponent(this.$store.state.Tools.Print.id);

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
        :show-in-sidebar="true"
        :initial-width="350"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <form
                id="printToolNew"
                class="form-horizontal"
            >
                <div class="form-group form-group-sm">
                    <label
                        class="col-sm-5 control-label"
                        for="docTitle"
                    >{{ $t("common:modules.tools.print.titleLabel") }}</label>
                    <div class="col-sm-7">
                        <input
                            id="docTitle"
                            v-model="documentTitle"
                            type="text"
                            class="form-control"
                            maxLength="45"
                        >
                    </div>
                </div>
                <div class="form-group form-group-sm">
                    <label
                        class="col-sm-5 control-label"
                        for="printLayout"
                    >{{ $t("common:modules.tools.print.layoutLabel") }}</label>
                    <div class="col-sm-7">
                        <select
                            id="printLayout"
                            class="form-control input-sm"
                            @change="layoutChanged($event.target.value)"
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
                    <label
                        class="col-sm-5 control-label"
                        for="printFormat"
                    >
                        {{ $t("common:modules.tools.print.formatLabel") }}
                    </label>
                    <div class="col-sm-7">
                        <select
                            id="printFormat"
                            class="form-control input-sm"
                            @change="setCurrentFormat($event.target.value)"
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
                    <label
                        class="col-sm-5 control-label"
                        for="printScale"
                    >{{ $t("common:modules.tools.print.scaleLabel") }}</label>
                    <div class="col-sm-7">
                        <select
                            id="printScale"
                            v-model="currentScale"
                            class="form-control input-sm"
                            @change="scaleChanged($event)"
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
                        :class="{
                            'hint': true,
                            'grey-icon': currentScale === currentMapScale
                        }"
                        @mouseover="showHintInfoScale = true"
                        @focusin="showHintInfoScale = true"
                        @mouseleave="showHintInfoScale = false"
                        @focusout="showHintInfoScale = false"
                    >
                        <span class="glyphicon glyphicon-info-sign" />
                    </div>
                    <div
                        v-if="currentScale !== currentMapScale"
                        v-show="showHintInfoScale"
                        class="hint-info"
                    >
                        {{ $t("common:modules.tools.print.hintInfoScale") }}
                    </div>
                </div>
                <div
                    class="form-group form-group-sm"
                >
                    <label
                        class="col-sm-5 control-label"
                        for="printLegend"
                    >
                        {{ $t("common:modules.tools.print.withLegendLabel") }}
                    </label>
                    <div class="col-sm-7">
                        <div class="checkbox">
                            <input
                                id="printLegend"
                                type="checkbox"
                                :checked="isLegendSelected"
                                @change="setIsLegendSelected($event.target.checked)"
                            >
                        </div>
                    </div>
                </div>
                <div
                    class="form-group form-group-sm"
                >
                    <label
                        class="col-sm-5 control-label"
                        for="printGfi"
                    >
                        {{ $t("common:modules.tools.print.withInfoLabel") }}
                    </label>
                    <div class="col-sm-7">
                        <div class="checkbox">
                            <input
                                id="printGfi"
                                type="checkbox"
                                :disabled="currentFeature === null"
                                :checked="isGfiSelected"
                                @change="setIsGfiSelected($event.target.checked)"
                            >
                        </div>
                    </div>
                </div>
                <div class="form-group form-group-sm">
                    <div class="col-sm-12">
                        <button
                            type="button"
                            class="btn btn-lgv-grey btn-block"
                            @click="print"
                        >
                            {{ $t("common:modules.tools.print.printLabel") }}
                        </button>
                    </div>
                </div>
                <div
                    v-if="printStarted"
                    class="form-group form-group-sm"
                >
                    <div class="col-sm-12">
                        <div class="progress">
                            <div
                                class="progress-bar"
                                role="progressbar"
                                :style="progressWidth"
                            >
                                <span class="sr-only">30% Complete</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="form-group form-group-sm"
                >
                    <div class="col-sm-12">
                        <button
                            class="btn btn-lgv-grey btn-block"
                            :disabled="!printFileReady"
                            @click="downloadFile"
                        >
                            {{ $t("common:modules.tools.print.downloadFile") }}
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
                position: absolute;
                left: 0;
                top: 25px;
                width: 100%;
                z-index: 10;
                background: #fff;
                border: 1px solid #555;
                padding: 5px;
            }
            .grey-icon {
                span {
                    color: #a5a5a5;
                }
            }
        }
    }
</style>
