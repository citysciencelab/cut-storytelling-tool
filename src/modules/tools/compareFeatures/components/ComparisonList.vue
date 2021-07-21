<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersCompareFeatures";
import actions from "../store/actionsCompareFeatures";
import mutations from "../store/mutationsCompareFeatures";
import beautifyKey from "../../../../utils/beautifyKey.js";
import {isWebLink} from "../../../../utils/urlHelper.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../../../utils/isPhoneNumber.js";
import {isEmailAddress} from "../../../../utils/isEmailAddress.js";

export default {
    name: "ComparisonList",
    props: {
        listOfFeatures: {
            type: Array,
            default: () => []
        },
        maxAttributesToShow: {
            type: Number,
            default: 12
        },
        enableMoreInfo: {
            type: Boolean,
            default: false
        },
        titleRemoveButton: {
            type: String,
            default: ""
        },
        layerSelection: {
            type: String,
            default: ""
        }
    },
    computed: {
        ...mapGetters("Tools/CompareFeatures", Object.keys(getters))
    },
    methods: {
        ...mapActions("Tools/CompareFeatures", Object.keys(actions)),
        ...mapMutations("Tools/CompareFeatures", Object.keys(mutations)),
        beautifyKey,
        isWebLink,
        isPhoneNumber,
        getPhoneNumberAsWebLink,
        isEmailAddress,
        removeVerticalBar (value) {
            const newValue = value.replaceAll("|", "<br>");

            return newValue;
        },
        makeOberstufenprofileBold (value) {
            const oldProfiles = value;
            let newProfiles = "";

            oldProfiles.replaceAll("|", "<br>");

            newProfiles = oldProfiles.split("|").map(teilstring => teilstring.split(";")).map(([first, last]) => [`<b>${first}</b>`, last].join("; ")).join("<br>");

            return newProfiles;
        }
    }
};
</script>

<template>
    <Component
        :is="'table'"
    >
        <table v-if="hasFeatures && !hasMultipleLayers">
            <tbody>
                <tr
                    v-for="(column, index) in listOfFeatures"
                    :key="'tool-compareFeatures-' + index"
                >
                    <template
                        v-if="index < maxAttributesToShow && !enableMoreInfo"
                    >
                        <td
                            v-for="(value, key) in column"
                            :key="'tool-compareFeatures-td' + key"
                        >
                            <button
                                v-if="index === 0 && key !== 'col-1'"
                                class="close"
                                :title="titleRemoveButton"
                                @click="removeFeatureFromPreparedList({features: listOfFeatures, featureId: key})"
                            >
                                <span
                                    class="glyphicon glyphicon-remove remove-feature"
                                />
                            </button>
                            <p v-if="isWebLink(value)">
                                <a
                                    :href="value"
                                    target="_blank"
                                >{{ value }}</a>
                            </p>
                            <p v-else-if="isPhoneNumber(value)">
                                <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                            </p>
                            <p v-else-if="isEmailAddress(value)">
                                <a :href="`mailto:${value}`">{{ value }}</a>
                            </p>
                            <p
                                v-else-if="key === 'col-1' || index === 0"
                                class="bold"
                            >
                                {{ beautifyKey($t(value)) }}
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes(';') && key.includes('SCHULEN')"
                            >
                                <span v-html="makeOberstufenprofileBold(value, key)" />
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes('|')"
                            >
                                <span v-html="removeVerticalBar(value)" />
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes('<br>')"
                            >
                                <span v-html="value" />
                            </p>
                            <p v-else>
                                {{ value }}
                            </p>
                        </td>
                    </template>
                    <template v-if="enableMoreInfo">
                        <td
                            v-for="(value, key) in column"
                            :key="'tool-compareFeatures-td' + key"
                        >
                            <button
                                class="close"
                                :title="titleRemoveButton"
                                @click="removeFeatureFromPreparedList({features: listOfFeatures, featureId: key})"
                            >
                                <span
                                    v-if="index === 0 && key !== 'col-1'"
                                    class="glyphicon glyphicon-remove remove-feature"
                                />
                            </button>
                            <p v-if="isWebLink(value)">
                                <a
                                    :href="value"
                                    target="_blank"
                                >{{ value }}</a>
                            </p>
                            <p v-else-if="isPhoneNumber(value)">
                                <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                            </p>
                            <p v-else-if="isEmailAddress(value)">
                                <a :href="`mailto:${value}`">{{ value }}</a>
                            </p>
                            <p
                                v-else-if="key === 'col-1' || index === 0"
                                class="bold"
                            >
                                {{ beautifyKey($t(value)) }}
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes(';') && key.includes('SCHULEN')"
                            >
                                <span v-html="makeOberstufenprofileBold(value, key)" />
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes('|')"
                            >
                                <span v-html="removeVerticalBar(value)" />
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes('<br>')"
                            >
                                <span v-html="value" />
                            </p>
                            <p v-else>
                                {{ value }}
                            </p>
                        </td>
                    </template>
                </tr>
            </tbody>
        </table>
        <table v-if="active && hasMultipleLayers">
            <tbody>
                <tr
                    v-for="(column, index) in listOfFeatures"
                    :key="'tool-compareFeatures-' + index"
                >
                    <template
                        v-if="index < maxAttributesToShow && !enableMoreInfo"
                    >
                        <td
                            v-for="(value, key) in column"
                            :key="'tool-compareFeatures-td' + key"
                        >
                            <button
                                class="close"
                                :title="$t('common:modules.tools.compareFeatures.removeFromList')"
                                @click="removeFeatureFromPreparedList({features: listOfFeatures, featureId: key, selectedLayer: selectedLayer})"
                            >
                                <span
                                    v-if="index === 0 && key !== 'col-1'"
                                    class="glyphicon glyphicon-remove remove-feature"
                                />
                            </button>
                            <p v-if="isWebLink(value)">
                                <a
                                    :href="value"
                                    target="_blank"
                                >{{ value }}</a>
                            </p>
                            <p v-else-if="isPhoneNumber(value)">
                                <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                            </p>
                            <p v-else-if="isEmailAddress(value)">
                                <a :href="`mailto:${value}`">{{ value }}</a>
                            </p>
                            <p
                                v-else-if="key === 'col-1' || index === 0"
                                class="bold"
                            >
                                {{ beautifyKey($t(value)) }}
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes(';') && key.includes('SCHULEN')"
                            >
                                <span v-html="makeOberstufenprofileBold(value, key)" />
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes('|')"
                            >
                                <span v-html="removeVerticalBar(value)" />
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes('<br>')"
                            >
                                <span v-html="value" />
                            </p>
                            <p v-else>
                                {{ value }}
                            </p>
                        </td>
                    </template>
                    <template
                        v-if="enableMoreInfo"
                    >
                        <td
                            v-for="(value, key) in column"
                            :key="'tool-compareFeatures-td' + key"
                        >
                            <button
                                class="close"
                                :title="$t('common:modules.tools.compareFeatures.removeFromList')"
                                @click="removeFeatureFromPreparedList({features: listOfFeatures, featureId: key, selectedLayer: selectedLayer})"
                            >
                                <span
                                    v-if="index === 0 && key !== 'col-1'"
                                    class="glyphicon glyphicon-remove remove-feature"
                                />
                            </button>
                            <p v-if="isWebLink(value)">
                                <a
                                    :href="value"
                                    target="_blank"
                                >{{ value }}</a>
                            </p>
                            <p v-else-if="isPhoneNumber(value)">
                                <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                            </p>
                            <p v-else-if="isEmailAddress(value)">
                                <a :href="`mailto:${value}`">{{ value }}</a>
                            </p>
                            <p
                                v-else-if="key === 'col-1' || index === 0"
                                class="bold"
                            >
                                {{ beautifyKey($t(value)) }}
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes(';') && key.includes('SCHULEN')"
                            >
                                <span v-html="makeOberstufenprofileBold(value, key)" />
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes('|')"
                            >
                                <span v-html="removeVerticalBar(value)" />
                            </p>
                            <p
                                v-else-if="typeof value === 'string' && value.includes('<br>')"
                            >
                                <span v-html="value" />
                            </p>
                            <p v-else>
                                {{ value }}
                            </p>
                        </td>
                    </template>
                </tr>
            </tbody>
        </table>
    </Component>
</template>

<style lang="less" scoped>
    @import "~variables";
    @background_color_1: rgb(0, 92, 169);
    @background_color_2: #eee;
    @background_color_3: #ddd;
    @background_color_4: #ccc;
    @font_family_1: "MasterPortalFont Bold","Arial Narrow",Arial,sans-serif;

    #tool-compareFeatures {
        z-index: -1;
        display: inline-flex;
        width: 100%;
    }
    .remove-feature {
        top: 0px !important;
        left: 0px;
    }
    table {
        font-family: @font_family_default;
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
        th {
            border-top: 1px solid #ccc;
            padding: 8px;
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: left;
            background-color: #4CAF50;
            color: white;
        }
        tr {
            &:first-child {
                border-top: 1px solid #ccc;
                max-width: 25px !important;
            }
            &:nth-child(odd) {
                background-color: @background_color_2;
            }
            &:nth-child(even) {
                background-color: @background_color_3;
            }
            &:hover {
                background-color: @background_color_4;
                td {
                    border-left: 1px solid #bbb;
                }
            }
        }
        td {
            padding: 8px;
            text-align: left;
            border-left: 1px solid #ccc;
            vertical-align: top;
            &:nth-child(1) {
                width: 20%;
            }
        }
        p {
            overflow-wrap: break-word;
        }
    }
    .close {
        float: right;
    }
</style>
