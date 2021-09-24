<script>
import {mapGetters, mapActions} from "vuex";
import * as constants from "./../store/constantsRouting";
import {GeoJSON, GPX} from "ol/format.js";
import convertFeaturesToKml from "../../../../utils/convertFeaturesToKml";

export default {
    name: "RoutingDownload",
    props: {
        hideGpx: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            constants
        };
    },
    computed: {
        ...mapGetters("Tools/Routing", ["download", "activeRoutingToolOption"]),
        ...mapGetters("Tools/Routing/Directions", ["directionsRouteSource"]),
        ...mapGetters("Tools/Routing/Isochrones", ["isochronesAreaSource"]),
        isDisabled () {
            return this.download.fileName.length === 0;
        },
        downloadFormatOptions () {
            let downloadFormatOptions = constants.downloadFormatOptions;

            if (this.hideGpx) {
                downloadFormatOptions = downloadFormatOptions.filter(d => d !== "GPX");
            }

            return downloadFormatOptions;
        }
    },
    methods: {
        ...mapActions("Tools/Routing", ["transformCoordinatesLocalToWgs84Projection"]),
        getDownloadFeatures () {
            if (this.activeRoutingToolOption === "DIRECTIONS") {
                return [this.directionsRouteSource.getFeatures().find(feature => !feature.get("isHighlight"))];
            }

            return this.isochronesAreaSource.getFeatures();
        },
        /**
         * Converts the features from OpenLayers Features to features in the chosen format.
         *
         * @param {module:ol/Feature[]} features which are to be converted.
         * @param {module:ol/format} format Format in which the features should be saved.
         * @returns {string} The features written in the chosen format as a String.
         */
        async convertFeatures (features, format) {
            const convertedFeatures = [];

            for (const feature of features) {

                const clone = feature.clone(),
                    geometry = clone.getGeometry(),
                    type = geometry.getType(),
                    coords = geometry.getCoordinates();

                let coordinates = [];

                if (type === "Point") {
                    coordinates = await this.transformCoordinatesLocalToWgs84Projection(coords);
                }
                else if (type === "LineString") {
                    coordinates = await Promise.all(coords.map(coord => this.transformCoordinatesLocalToWgs84Projection(coord)));
                }
                else if (type === "Polygon") {
                    for (const coord of coords) {
                        coordinates.push(await Promise.all(coord.map(c => this.transformCoordinatesLocalToWgs84Projection(c))));
                    }
                }
                geometry.setCoordinates(coordinates);
                convertedFeatures.push(clone);
            }
            return format.writeFeatures(convertedFeatures);
        },
        async getDownloadStringInFormat (features) {
            switch (this.download.format) {
                case "GEOJSON":
                    return this.convertFeatures(features, new GeoJSON());
                case "GPX":
                    return this.convertFeatures(features, new GPX());
                case "KML":
                    return convertFeaturesToKml(features);
                default:
                    return undefined;
            }
        },
        getFileName () {
            return this.download.fileName.includes(".") ? this.download.fileName : `${this.download.fileName}.${this.download.format}`;
        },
        async downloadResult () {
            if (this.isDisabled) {
                return;
            }
            const isIE = Radio.request("Util", "isInternetExplorer"),
                downloadString = await this.getDownloadStringInFormat(this.getDownloadFeatures()),
                fileName = this.getFileName();

            if (isIE) {
                window.navigator.msSaveOrOpenBlob(new Blob([downloadString]), fileName);
            }
            else {
                const url = `data:text/plain;charset=utf-8,${encodeURIComponent(downloadString)}`,
                    a = document.createElement("a");

                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    }
};
</script>

<template>
    <div>
        <h6>{{ $t('common:modules.tools.routing.download.header') }}</h6>

        <div class="d-flex mb-2">
            <label
                for="routing-DownloadFormatOptions"
                class="col-md-4 col-sm-4 control-label d-flex align-self-center"
            >{{ $t('common:modules.tools.routing.download.format') }}</label>

            <div class="col-md-8 col-sm-8">
                <select
                    id="routing-DownloadFormatOptions"
                    class="form-control input-sm mt-4"
                    @change="download.format = $event.target.value"
                >
                    <option
                        v-for="option in downloadFormatOptions"
                        :id="option"
                        :key="'routing-DownloadFormatOptions-' + option"
                        :value="option"
                        :selected="option === download.format"
                    >
                        {{ option }}
                    </option>
                </select>
            </div>
        </div>

        <div class="d-flex mb-2">
            <label
                for="routing-download-filename"
                class="col-md-4 col-sm-4 control-label d-flex align-self-center"
            >{{ $t('common:modules.tools.routing.download.filename') }}</label>

            <div class="col-md-8 col-sm-8">
                <input
                    id="routing-download-filename"
                    v-model="download.fileName"
                    type="text"
                    class="form-control"
                    :placeholder="$t('common:modules.tools.routing.download.filenamePlaceholder')"
                >
            </div>
        </div>

        <div class="form-group form-group-sm">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <button
                    class="btn btn-block"
                    type="button"
                    :disabled="isDisabled"
                    @click="downloadResult()"
                >
                    <span
                        class="glyphicon glyphicon-floppy-disk pointer"
                    />
                    {{ $t('common:modules.tools.routing.download.saveResult') }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.d-flex {
    display: flex;
}
.flex-column {
    flex-direction: column;
}
.justify-content-between {
    justify-content: space-between;
}
.align-self-center {
    align-self: center;
}

.mb-2 {
    margin-bottom: 0.5rem;
}
</style>
