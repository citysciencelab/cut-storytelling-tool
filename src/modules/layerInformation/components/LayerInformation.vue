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
        ...mapGetters("LayerInformation", Object.keys(getters)),
        ...mapMutations("LayerInformation", Object.keys(mutations)),
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
            return this.periodicityKey !== "";
        },
        showDownloadLinks () {
            return this.downloadLinks !== null;
        },
        showUrl () {
            return this.layerInfo.url !== null && this.layerInfo.urlIsVisible !== false && this.layerInfo.typ !== "SensorThings";
        },
        showAttachFile () {
            return this.downloadLinks && this.downloadLinks.length > 1;
        }
        // newUrl () {
        //     return this.layerInfo.url? + "SERVICE=" + this.layerInfo.typ + "&REQUEST=GetCapabilities";
        // }

    },

    created () {
        console.log("created");
    },

    methods: {
        ...mapActions("LayerInformation", [
            "additionalLayerInfo"
        ]),
        close () {
            this.$emit("close");
        },
        /**
         * Highlights the Layer Information Icon in the layertree
         * @returns {void}
         */
        highlightLayerInformationIcon: function () {
            this.$el.find("span.glyphicon-info-sign").addClass("highlightLayerInformationIcon");
        },

        /**
         * Unhighlights the Layer Information Icon in the layertree
         * @returns {void}
         */
        unhighlightLayerInformationIcon: function () {
            this.$el.find("span.glyphicon-info-sign").removeClass("highlightLayerInformationIcon");
        }
    }
};
</script>

<template lang="html">
    <ToolWindow @close="close">
        <template v-slot:title>
            <span>{{ $t("common:modules.layerInformation.informationAndLegend") }}</span>
        </template>
        <template v-slot:body>
            <div class="body">
                <h4
                    class="subtitle"
                    :title="layerInfo.layername"
                >
                    {{ $t(layerInfo.layername) }}
                </h4>
                <div v-html="abstractText"></div>
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
                        >{{ $t(layerInfo.typ) }}-{{ $t("common:modules.layerInformation.addressSuffix") }}
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
                        class="tab-pane fade"
                    >
                        <div class="layerInfoDownloadFirstCol pull-left"></div>
                        <ul
                            v-if="showDownloadLinks"
                            class="list-unstyled"
                        >
                            <li
                                v-for="downloadLink in downloadLinks"
                                :key="downloadLink"
                            >
                                <a
                                    :href="downloadLink.link"
                                    target="_blank"
                                >
                                    {{ $t(downloadLink.linkName) }}
                                </a>
                            </li>
                        </ul>
                        <div
                            v-if="(showAttachFile)"
                            class="layerInfoDownloadSecCol pull-right"
                        >
                            <span class="download-note">{{ $t(("common:modules.layerInformation.attachFileMessage")) }}</span>
                        </div>
                    </div>
                </div>
                <div
                    id="url"
                    class="tab-pane fade"
                >
                    <ul class="list-unstyled">
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
        </template>
    </ToolWindow>
</template>

<style lang="less" scoped>
    @import "~variables";

</style>
