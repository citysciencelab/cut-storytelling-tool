<script>
import {mapActions, mapMutations} from "vuex";
import {isWebLink} from "../../utils/urlHelper.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../utils/isPhoneNumber.js";
import {isEmailAddress} from "../../utils/isEmailAddress.js";

export default {
    name: "List",
    props: {
        identifier: {
            type: String,
            required: true
        },
        tableHeads: {
            type: Object,
            required: true
        },
        tableData: {
            type: Array,
            required: true
        },
        geometryName: {
            type: String,
            default: ""
        }
    },
    methods: {
        ...mapMutations("Map", {setMapCenter: "setCenter"}),
        ...mapActions("Map", ["setZoomLevel"]),
        ...mapActions("MapMarker", ["placingPointMarker"]),
        /**
         * Takes the selected coordinates and centers the map to the new position.
         * @param {String[]} feature clicked feature to zoom to
         * @returns {void}
         */
        setCenter (feature) {
            const coords = feature.getGeometry().flatCoordinates,
                // coordinates come as a string and have to be changed to numbers for the mutation setCenter to work.
                transformedCoords = [parseFloat(coords[0]), parseFloat(coords[1])];

            this.setMapCenter(transformedCoords);
            this.setZoomLevel(6);
            this.placingPointMarker(transformedCoords);
        },
        isWebLink,
        isPhoneNumber,
        getPhoneNumberAsWebLink,
        isEmailAddress,
        removeVerticalBar (value) {
            return typeof value === "string" ? value.replaceAll("|", ", ") : "";
        },
        replaceBoolean (value) {
            if (typeof value === "string") {
                if (value === "true") {
                    return value.replaceAll("true", this.i18n.$t("common:share-components.list.replace.true"));
                }
                if (value === "No") {
                    return value.replaceAll("No", this.i18n.$t("common:share-components.list.replace.No"));
                }
            }
            return "";
        }
    }
};
</script>

<template>
    <div
        :id="`${identifier}-list`"
    >
        <table>
            <tr>
                <th
                    v-for="([key, title], i) of Object.entries(tableHeads)"
                    :key="key + title + i"
                >
                    <p>
                        {{ title }}
                    </p>
                </th>
            </tr>
            <tr
                v-for="(data, i) in tableData"
                :key="data + i"
                @click="geometryName ? setCenter(data) : ''"
            >
                <td
                    v-for="([key, title], j) of Object.entries(tableHeads)"
                    :key="key + title + j"
                >
                    <p v-if="key === geometryName">
                        <button
                            type="button"
                            class="btn btn-lgv-grey col-md-12 col-sm-12"
                        >
                            {{ $t("common:share-components.list.zoomToResult") }}
                        </button>
                    </p>
                    <p v-else-if="isWebLink(data.values_[key])">
                        <a
                            :href="data.values_[key]"
                            target="_blank"
                        >{{ data.values_[key] }}</a>
                    </p>
                    <p v-else-if="isPhoneNumber(data.values_[key])">
                        <a :href="getPhoneNumberAsWebLink(data.values_[key])">{{ data.values_[key] }}</a>
                    </p>
                    <p v-else-if="isEmailAddress(data.values_[key])">
                        <a :href="`mailto:${data.values_[key]}`">{{ data.values_[key] }}</a>
                    </p>
                    <p v-else-if="data.values_[key] === 'true' || data.values_[key] === 'No'">
                        {{ replaceBoolean(data.values_[key]) }}
                    </p>
                    <p v-else>
                        {{ removeVerticalBar(data.values_[key]) }}
                    </p>
                </td>
            </tr>
        </table>
    </div>
</template>

<style lang="less" scoped>
@table-borders: 1px solid #ddd;
@table-padding: 8px;
@import "~variables";

table {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    table-layout: auto;
    td {
        border: @table-borders;
        padding: @table-padding;
        cursor: pointer;
        vertical-align: top;
    }
    th {
        border: @table-borders;
        padding: @table-padding;
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #fb001c;
        color: white;
    }
    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
}
</style>
