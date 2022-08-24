<script>
import ExportButtonCSV from "../../../../share-components/exportButton/components/ExportButtonCSV.vue";
import ExportButtonGeoJSON from "../../../../share-components/exportButton/components/ExportButtonGeoJSON.vue";
import {getLayerByLayerId} from "../utils/openlayerFunctions";
import isObject from "../../../../utils/isObject";
import {GeoJSON} from "ol/format.js";

export default {
    name: "SnippetDownload",
    components: {
        ExportButtonCSV,
        ExportButtonGeoJSON
    },
    props: {
        filteredItems: {
            type: Array,
            required: true
        },
        layerId: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            enableFileDownload: false,
            showDownload: false,
            formats: ["CSV", "GeoJSON"],
            selectedFormat: "",
            filename: "",
            json: ""
        };
    },
    methods: {
        /**
         * Sets the download selected format.
         * @param {String} format of the file to download
         * @returns {void}
         */
        setDownloadSelectedFormat (format) {
            this.selectedFormat = format;
            this.enableDownloadBtn();
        },
        /**
         * Makes download area visible or invisible.
         * @returns {void}
         */
        toggleShowDownload () {
            this.showDownload = !this.showDownload;
        },
        /**
         * Enables download button and set json if the selected format is GeoJSON and filteredItems has at least one element.
         * @returns {void}
         */
        enableDownloadBtn () {
            if (this.filename !== "" &&
                this.selectedFormat !== "" &&
                this.selectedFormat !== "none" &&
                Array.isArray(this.filteredItems) &&
                this.filteredItems.length > 0) {
                if (this.selectedFormat === "GeoJSON") {
                    this.json = new GeoJSON().writeFeatures(this.filteredItems);
                }
                this.enableFileDownload = true;
            }
            else {
                this.enableFileDownload = false;
            }
        },
        /**
         * Download handler for csv export.
         * @param {Function} onsuccess The function to hand over the data.
         * @returns {void}
         */
        getDownloadHandler (onsuccess) {
            const result = [],
                features = this.filteredItems,
                model = getLayerByLayerId(this.layerId),
                gfiAttributes = typeof model?.get === "function" && isObject(model.get("gfiAttributes")) ? model.get("gfiAttributes") : {};

            if (!Array.isArray(features)) {
                onsuccess([]);
                return;
            }
            features.forEach(item => {
                if (!isObject(item) || typeof item.getProperties !== "function" || !isObject(item.getProperties())) {
                    return;
                }
                const properties = {},
                    geometryName = typeof item.getGeometryName === "function" ? item.getGeometryName() : false;

                Object.entries(item.getProperties()).forEach(([attrName, value]) => {
                    if (attrName === geometryName) {
                        return;
                    }
                    else if (Object.prototype.hasOwnProperty.call(gfiAttributes, attrName)) {
                        properties[gfiAttributes[attrName]] = value;
                        return;
                    }
                    properties[attrName] = value;
                });

                if (typeof item?.getGeometry === "function" &&
                    item.getGeometry().getType() === "Point" &&
                    typeof item.getGeometry().getCoordinates()[0] !== "undefined" &&
                    typeof item.getGeometry().getCoordinates()[1] !== "undefined") {
                    const map = Radio.request("Map", "getMap"),
                        view = typeof map?.getView === "function" ? map.getView() : undefined,
                        projection = typeof view?.getProjection === "function" ? view.getProjection() : undefined,
                        code = typeof projection?.getCode === "function" ? projection.getCode() + " | " : "";

                    properties["Koordinaten-System"] = code + item.getGeometry().getCoordinates()[0] + " | " + item.getGeometry().getCoordinates()[1];
                }
                result.push(properties);
            });
            onsuccess(result);
        }
    }
};
</script>

<template>
    <form
        id="tool-filter-download"
        class="form-horizontal"
        role="form"
    >
        <div class="form-group form-group-sm row">
            <div class="col-md-12">
                <input
                    id="tool-filter-download-box"
                    type="checkbox"
                    @click="toggleShowDownload"
                >
                <label
                    class="col-md-6 col-form-label"
                    for="tool-filter-download-box"
                >
                    {{ $t("common:modules.tools.filter.download.label") }}
                </label>
            </div>
        </div>
        <div v-if="showDownload">
            <div class="form-group form-group-sm row">
                <label
                    class="col-md-5 col-form-label"
                    for="tool-filter-download-format"
                >
                    {{ $t("common:modules.tools.draw.download.format") }}
                </label>
                <div class="col-md-7">
                    <select
                        id="tool-filter-download-format"
                        class="form-select form-select-sm"
                        @change="setDownloadSelectedFormat($event.target.value)"
                    >
                        <option value="none">
                            {{ $t("common:modules.tools.draw.download.pleaseChoose") }}
                        </option>
                        <option
                            v-for="format in formats"
                            :key="'tool-filter-download-format-' + format"
                            :value="format"
                            :selected="format === selectedFormat"
                        >
                            {{ format }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="form-group form-group-sm row">
                <label
                    class="col-md-5 col-form-label"
                    for="tool-filter-download-filename"
                >
                    {{ $t("common:modules.tools.draw.download.filename") }}
                </label>
                <div class="col-md-7">
                    <input
                        id="tool-filter-download-filename"
                        v-model="filename"
                        type="text"
                        class="form-control form-control-sm"
                        :placeholder="$t('common:modules.tools.draw.download.enterFilename')"
                        @keyup="enableDownloadBtn"
                    >
                </div>
            </div>
            <div v-if="enableFileDownload && selectedFormat==='CSV'">
                <ExportButtonCSV
                    :url="false"
                    :filename="filename"
                    :handler="getDownloadHandler"
                    :use-semicolon="true"
                    :title="$t('modules.tools.filter.download.labelBtn')"
                    postfix-format=""
                />
            </div>
            <div v-if="enableFileDownload && selectedFormat==='GeoJSON'">
                <ExportButtonGeoJSON
                    :title="$t('modules.tools.filter.download.labelBtn')"
                    :data="json"
                    :filename="filename"
                    postfix-format=""
                />
            </div>
        </div>
    </form>
</template>
