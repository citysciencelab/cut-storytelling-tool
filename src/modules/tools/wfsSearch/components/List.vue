<script>
import {mapActions, mapGetters} from "vuex";
import actions from "../store/actionsWfsSearch";
import getters from "../store/gettersWfsSearch";
import {isWebLink} from "../../../../utils/urlHelper.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../../../utils/isPhoneNumber.js";
import {isEmailAddress} from "../../../../utils/isEmailAddress.js";

export default {
    name: "List",
    props: {
        tableTitle: {
            type: String,
            default: ""
        },
        tableHeads: {
            type: Array,
            default: () => []
        },
        tableData: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters))
    },
    methods: {
        ...mapActions("Tools/WfsSearch", Object.keys(actions)),
        isWebLink,
        isPhoneNumber,
        getPhoneNumberAsWebLink,
        isEmailAddress,
        removeVerticalBar (value) {
            if (typeof value === "string") {
                const newValue = value.replaceAll("|", ", ");

                return newValue;
            }
            return "";
        },
        replaceBoolean (value) {
            if (typeof value === "string" && value === "true") {
                return value.replaceAll("true", "ja");
            }
            if (typeof value === "string" && value === "No") {
                return value.replaceAll("No", "nein");
            }
            return "";
        }
    }
};
</script>

<template>
    <div
        :id="`tool-wfsSearch-list-${tableTitle}`"
    >
        <table v-if="!customTableHeaders">
            <tr>
                <th
                    v-for="(header, i) in tableHeads"
                    :key="header + i"
                >
                    <p>
                        {{ header }}
                    </p>
                </th>
            </tr>
            <tr
                v-for="(data, i) in tableData"
                :key="data + i"
                @click="setCenter(results[i])"
            >
                <td
                    v-for="(key, j) in tableHeads"
                    :key="key + j"
                >
                    <p v-if="key === 'the_geom'">
                        <button
                            type="button"
                            class="btn btn-lgv-grey col-md-12 col-sm-12"
                        >
                            {{ $t("common:modules.tools.wfsSearch.zoomToResult") }}
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
        <table v-if="customTableHeaders">
            <tr>
                <th
                    v-for="(header, i) in tableHeads"
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
                @click="setCenter(results[i])"
            >
                <td
                    v-for="(key, j) in tableHeads"
                    :key="key + j"
                >
                    <p v-if="key.attribute === 'the_geom'">
                        <button
                            type="button"
                            class="btn btn-lgv-grey col-md-12 col-sm-12"
                        >
                            {{ $t("common:modules.tools.wfsSearch.zoomToResult") }}
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

hr {
    width: 100%;
}
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
