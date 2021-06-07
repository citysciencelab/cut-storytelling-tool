<script>
import {mapActions, mapMutations} from "vuex";
import {isWebLink} from "../../utils/urlHelper.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../utils/isPhoneNumber.js";
import {isEmailAddress} from "../../utils/isEmailAddress.js";

export default {
    name: "List",
    props: {
        tableHeads: {
            type: Array,
            required: true
        },
        tableData: {
            type: Array,
            required: true
        },
        customHeaders: {
            type: Boolean,
            default: false
        },
        geometryName: {
            type: String,
            default: ""
        },
        identifier: {
            type: String,
            default: ""
        }
    },
    computed: {
        headers () {
            if (this.customHeaders) {
                return this.tableHeads;
            }
            return this.tableHeads.map(x => ({title: x, attribute: x}));
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
                    return value.replaceAll("true", "ja");
                }
                if (value === "No") {
                    return value.replaceAll("No", "nein");
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
                    v-for="(header, i) in headers"
                    :key="header + i"
                >
                    <p>
                        {{ header.title }}
                    </p>
                </th>
            </tr>
            <tr
                v-for="(data, i) in tableData"
                :key="data + i"
                @click="geometryName ? setCenter(data) : ''"
            >
                <td
                    v-for="(key, j) in headers"
                    :key="key + j"
                >
                    <p v-if="key.attribute === geometryName">
                        <button
                            type="button"
                            class="btn btn-lgv-grey col-md-12 col-sm-12"
                        >
                            {{ $t("common:share-components.list.zoomToResult") }}
                        </button>
                    </p>
                    <p v-else-if="isWebLink(data.values_[key.attribute])">
                        <a
                            :href="data.values_[key.attribute]"
                            target="_blank"
                        >{{ data.values_[key] }}</a>
                    </p>
                    <p v-else-if="isPhoneNumber(data.values_[key.attribute])">
                        <a :href="getPhoneNumberAsWebLink(data.values_[key.attribute])">{{ data.values_[key.attribute] }}</a>
                    </p>
                    <p v-else-if="isEmailAddress(data.values_[key.attribute])">
                        <a :href="`mailto:${data.values_[key.attribute]}`">{{ data.values_[key.attribute] }}</a>
                    </p>
                    <p v-else-if="data.values_[key.attribute] === 'true' || data.values_[key.attribute] === 'No'">
                        {{ replaceBoolean(data.values_[key.attribute]) }}
                    </p>
                    <p v-else>
                        {{ removeVerticalBar(data.values_[key.attribute]) }}
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
