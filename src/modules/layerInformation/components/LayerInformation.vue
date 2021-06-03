<script>
import getters from "../store/gettersLayerInformation";
import mutations from "../store/mutationsLayerInformation";
import ToolWindow from "../../../share-components/ToolWindow.vue";
import {mapGetters, mapActions, mapMutations} from "vuex";

/**
 *
 */
export default {
    name: "LayerInformation",
    components: {
        ToolWindow
    },
    computed: {
        ...mapGetters("LayerInformation", Object.keys(getters)),
        ...mapGetters(["metaDataCatalogueId"]),
        showAdditionalMetaData () {
            return this.layerInfo.metaURL !== null && typeof this.abstractText !== "undefined" && this.abstractText !== this.noMetaDataMessage && this.abstractText !== this.noMetadataLoaded;
        },
        showPublication () {
            return typeof this.datePublication !== "undefined" && this.datePublication !== null;
        },
        showRevision () {
            return typeof this.dateRevision !== "undefined" && this.dateRevision !== null;
        },
        showPeriodicity () {
            return this.periodicityKey !== "" && this.periodicityKey !== null && this.periodicityKey !== undefined;
        },
        showDownloadLinks () {
            return this.downloadLinks !== null;
        },
        showUrl () {
            return this.layerInfo.url !== null && this.layerInfo.urlIsVisible !== false && this.layerInfo.typ !== "SensorThings";
        },
        showAttachFile () {
            return this.downloadLinks && this.downloadLinks.length > 1;
        },
        layerUrl () {
            return this.layerInfo.url + "?SERVICE=" + this.layerInfo.typ + "&REQUEST=GetCapabilities";
        },
        showMoreLayers () {
            if (this.layerInfo.metaIdArray) {
                return this.layerInfo.metaIdArray.length > 1;
            }
            return false;
        },
        showInformation () {
            return this.active;
        }

    },

    mounted () {
        if (this.metaDataCatalogueId) {
            this.setMetaDataCatalogueId(this.metaDataCatalogueId);
        }
    },

    methods: {
        ...mapActions("LayerInformation", [
            "changeLayerInfo",
            "activate"
        ]),
        ...mapMutations("LayerInformation", Object.keys(mutations)),
        /**
         * Closes the LayerInformation
         * @returns {void}
         */
        close () {
            this.setActive(false);
            this.$emit("close");
            Radio.trigger("Layer", "setLayerInfoChecked", false);
            Radio.trigger("LayerInformation", "unhighlightLayerInformationIcon");
        },
        /**
         * Changes the abstract Text in case of group layer
         * @param {Event} ev click event of dropdown
         * @returns {void}
         */
        changeLayerAbstract (ev) {
            this.changeLayerInfo(ev.target.text);
            this.setCurrentLayerName(ev.target.text);
        }
    }
};
</script>

<template lang="html">
    <ToolWindow
        v-if="showInformation"
        id="layerInformation"
        class="layerInformation"
        @close="close"
    >
        <template v-slot:title>
            <span>{{ $t("common:modules.layerInformation.informationAndLegend") }}</span>
        </template>
        <template v-slot:body>
            <div class="body">
                <h4
                    class="subtitle"
                    :title="title"
                >
                    {{ $t(title) }}
                </h4>

                <div
                    v-if="showMoreLayers"
                    class="dropdown mb-2"
                >
                    <button
                        id="changeLayerInfo"
                        class="btn btn-default dropdown-toggle"
                        type="button"
                        data-toggle="dropdown"
                    >
                        {{ $t("common:modules.layerInformation.changeLayerInfo") }}
                        <span class="caret"></span>
                    </button>
                    <ul
                        class="dropdown-menu"
                    >
                        <li
                            v-for="name in layerInfo.layerNames"
                            :key="name"
                        >
                            <a
                                href="#"
                                class="abstractChange"
                                :class="{ active: name === currentLayerName }"
                                @click="changeLayerAbstract"
                            >{{ $t(name) }}</a>
                        </li>
                    </ul>
                </div>
                <div
                    class="mb-2 abstract"
                    v-html="abstractText"
                ></div>
                <div v-if="showAdditionalMetaData">
                    <p
                        v-for="url in metaURLs"
                        :key="url"
                        class="pull-right"
                    >
                        <a
                            :href="url"
                            target="_blank"
                        >
                            {{ $t("common:modules.layerInformation.additionalMetadata") }}
                        </a>
                    </p>
                </div>
                <p v-if="showPublication">
                    {{ $t("common:modules.layerInformation.publicationCreation") }}: {{ datePublication }}
                </p>
                <p v-if="showRevision">
                    {{ $t("common:modules.layerInformation.lastModified") }}: {{ dateRevision }}
                </p>
                <p v-if="showPeriodicity">
                    {{ $t("common:modules.layerInformation.periodicityTitle") }}: {{ $t(periodicityKey) }}
                </p>
                <hr>
                <ul class="nav nav-tabs">
                    <li
                        value="layerinfo-legend"
                        class="tab-toggle active"
                    >
                        <a
                            data-toggle="tab"
                            href="#layerinfo-legend"
                        >{{ $t("common:modules.layerInformation.legend") }}
                        </a>
                    </li>
                    <li
                        v-if="showDownloadLinks"
                        value="LayerInfoDataDownload"
                        class="tab-toggle"
                    >
                        <a
                            data-toggle="tab"
                            href="#LayerInfoDataDownload"
                        >{{ $t("common:modules.layerInformation.downloadDataset") }}
                        </a>
                    </li>
                    <li
                        v-if="showUrl"
                        value="url"
                        class="tab-toggle"
                    >
                        <a
                            data-toggle="tab"
                            href="#url"
                        >{{ $t(layerInfo.typ) }} - {{ $t("common:modules.layerInformation.addressSuffix") }}
                        </a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div
                        id="layerinfo-legend"
                        class="tab-pane fade in active"
                    >
                    </div>
                    <div
                        id="LayerInfoDataDownload"
                        class="tab-pane fade row"
                    >
                        <div class="col-md-7">
                            <ul
                                v-if="showDownloadLinks"
                                class="pt-5"
                            >
                                <li
                                    v-for="downloadLink in downloadLinks"
                                    :key="downloadLink.linkName"
                                >
                                    <a
                                        :href="downloadLink.link"
                                        target="_blank"
                                    >
                                        {{ $t(downloadLink.linkName) }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div
                            v-if="(showAttachFile)"
                            class="col-md-5 pt-5"
                        >
                            <span class="download-note">{{ $t(("common:modules.layerInformation.attachFileMessage")) }}</span>
                        </div>
                    </div>
                    <div
                        id="url"
                        class="tab-pane fade"
                    >
                        <ul class="pt-5">
                            <li>
                                <a
                                    :href="layerUrl"
                                    target="_blank"
                                >
                                    {{ layerInfo.url }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </template>
    </ToolWindow>
</template>

<style lang="less" scoped>
    @import "~variables";
    @color_1: #E10019;
    @background_color_1: white;
    @background_color_2: rgb(255, 255, 255);

    .subtitle {
        color: @color_1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        max-width: 100%;
        padding-top: 1px;
        margin-bottom: 9px;
    }
    hr {
        margin: 15px 0px 10px 0px;
    }

    #layerInformation .abstract /deep/ p {
        padding: 2px 10px 2px 0;
    }
    .body {
        >ul {
            background-color: @background_color_1;
        }
        max-height: 66vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 5px 10px;
        font-size: 12px;
    }

    .layerInformation {
        position: absolute;
        top: 20px;
        right: 60px;
        max-width:600px;
        width: 45vw;
        margin: 0 10px 30px 10px;
        z-index: 1010;
        background-color: @background_color_2;
        box-shadow: 8px 8px 12px rgba(0, 0, 0, 0.176);
        border: 1px solid rgb(229, 229, 229);
        @media (max-width: 768px) {
            inset: 12px auto auto 0px;
            max-width:750px;
            width: 95vw;
            max-height: 80vh;
        }
    }

    .header {
        padding: 10px 10px 5px 10px;
        border-bottom: 1px solid rgb(229, 229, 229);
        cursor: move;
    }
    .glyphicon-remove {
        &:hover {
            opacity: 0.7;
            cursor: pointer;
        }
    }

    .nav-tabs {
        display: flex;
        >li {
            font-size: 12px;
            >a {
                text-overflow: ellipsis;
                overflow: hidden;
                height: 100%;
            }
        }
    }
    .tab-content {
        .tab-pane {
            >ul {
                >li {
                    >a {
                        font-size: 12px;
                        text-overflow: ellipsis;
                        display: inline-block;
                        max-width: 95%;
                        overflow: hidden;
                    }
                }
            }
        }
        #layerinfo-legend {
            max-width: 95%;
            overflow: auto;
        }
    }

    .mb-2 {
        margin-bottom: 2rem;
    }

    .dropdown-toggle {
        width: 100%;
    }

    .dropdown-menu {
        width: 100%;
        a.active {
            background-color: @accent_active;
            color: white;
        }
        a:hover {
            background-color: @accent_hover;
        }
    }

    .download-note {
        font-weight: bold;
    }

    .pt-5 {
        padding-top: 5px;
    }

</style>
