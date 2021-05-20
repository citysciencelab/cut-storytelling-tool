<script>
import {mapActions, mapGetters} from "vuex";
import actions from "../store/actionsWfsSearch";
import getters from "../store/gettersWfsSearch";
import state from "../store/stateWfsSearch";
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
        sendCoords (data) {
            const index = this.tableData.indexOf(data),
                coords = state.results[index].the_geom.flatCoordinates;

            this.setCenter(coords);
        },
        removeVerticalBar (value) {
            if (typeof value === "string") {
                const newValue = value.replaceAll("|", ", ");

                return newValue;
            }
            return "";
        },
        replaceGeom (value) {
            if (typeof value === "object") {
                return this.$t("common:modules.tools.wfsSearch.zoomToResult");
            }
            return "";
        },
        replaceBoolean (value) {
            let newValue = "";

            if (typeof value === "string" && value === "true") {
                newValue = value.replaceAll("true", "ja");

            }
            else if (typeof value === "string" && value === "No") {
                newValue = value.replaceAll("No", "nein");

            }
            return newValue;
        }
    }
};
</script>

<template>
    <div
        id="tool-wfsSearch-list"
    >
        <table>
            <tr>
                <th
                    v-for="(header, i) in tableHeads"
                    :key="header + i"
                >
                    <p v-if="header !== 'the_geom'">
                        {{ header }}
                    </p>
                    <p v-else>
                    </p>
                </th>
            </tr>
            <tr
                v-for="(data, i) in tableData"
                :key="data + i"
                @click="sendCoords(data)"
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
                            {{ replaceGeom(data[key]) }}
                        </button>
                    </p>
                    <p v-else-if="isWebLink(data[key])">
                        <a
                            :href="data[key]"
                            target="_blank"
                        >{{ data[key] }}</a>
                    </p>
                    <p v-else-if="isPhoneNumber(data[key])">
                        <a :href="getPhoneNumberAsWebLink(data[key])">{{ data[key] }}</a>
                    </p>
                    <p v-else-if="isEmailAddress(data[key])">
                        <a :href="`mailto:${data[key]}`">{{ data[key] }}</a>
                    </p>
                    <p v-else-if="data[key] === 'true' || data[key] === 'No'">
                        {{ replaceBoolean(data[key]) }}
                    </p>
                    <p v-else>
                        {{ removeVerticalBar(data[key]) }}
                    </p>
                </td>
            </tr>
        </table>
    </div>
</template>

<style lang="less" scoped>
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
        border: 1px solid #ddd;
        padding: 8px;
        cursor: pointer;
        vertical-align: top;
    }
    th {
        border: 1px solid #ddd;
        padding: 8px;
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
