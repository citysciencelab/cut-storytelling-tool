<script>
import {mapActions, mapGetters} from "vuex";
import {getCenter as getCenterExtent} from "ol/extent";
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
    computed: {
        ...mapGetters("Map", ["map"])
    },
    methods: {
        ...mapActions("Map", ["zoomTo"]),
        ...mapActions("MapMarker", ["placingPointMarker"]),
        /**
         * Takes the selected coordinates and centers the map to the new position.
         * @param {String[]} feature clicked feature to zoom to
         * @returns {void}
         */
        setCenter (feature) {
            const geometry = feature.getGeometry();

            this.placingPointMarker(getCenterExtent(geometry.getExtent()));
            this.zoomTo({geometryOrExtent: geometry, options: {maxZoom: 5}});
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
                    return value.replaceAll("true", i18next.t("common:share-components.list.replace.true"));
                }
                if (value === "No") {
                    return value.replaceAll("No", i18next.t("common:share-components.list.replace.No"));
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
                    <span>
                        {{ title }}
                    </span>
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
                    <template v-if="key === geometryName">
                        <button
                            type="button"
                            class="btn btn-lgv-grey col-md-12 col-sm-12"
                        >
                            {{ $t("common:share-components.list.zoomToResult") }}
                        </button>
                    </template>
                    <template v-else-if="isWebLink(data.values_[key])">
                        <a
                            :href="data.values_[key]"
                            target="_blank"
                        >{{ data.values_[key] }}</a>
                    </template>
                    <template v-else-if="isPhoneNumber(data.values_[key])">
                        <a :href="getPhoneNumberAsWebLink(data.values_[key])">{{ data.values_[key] }}</a>
                    </template>
                    <template v-else-if="isEmailAddress(data.values_[key])">
                        <a :href="`mailto:${data.values_[key]}`">{{ data.values_[key] }}</a>
                    </template>
                    <template v-else-if="data.values_[key] === 'true' || data.values_[key] === 'No'">
                        {{ replaceBoolean(data.values_[key]) }}
                    </template>
                    <template v-else>
                        {{ removeVerticalBar(data.values_[key]) }}
                    </template>
                </td>
            </tr>
        </table>
    </div>
</template>

<style lang="less" scoped>
@import "~variables";
@table-borders: 1px solid #ddd;
@table-padding: 8px;

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
        padding: 12px @table-padding;
        text-align: left;
        background-color: @primary;
        color: @accent_contrast;
    }

    tr:nth-child(even) {
        background-color: @secondary;
    }
}
</style>
