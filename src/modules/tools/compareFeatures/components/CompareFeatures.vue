<script>
import Modal from "../../../../share-components/modals/Modal.vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersCompareFeatures";
import state from "../store/stateCompareFeatures";
import actions from "../store/actionsCompareFeatures";
import mutations from "../store/mutationsCompareFeatures";
import beautifyKey from "../../../../utils/beautifyKey.js";
import {isWebLink} from "../../../../utils/urlHelper.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../../../utils/isPhoneNumber.js";
import {isEmailAddress} from "../../../../utils/isEmailAddress.js";

export default {
    name: "CompareFeatures",
    components: {
        Modal
    },
    data: function () {
        return {
            selected: ""
        };
    },
    computed: {
        ...mapGetters("Tools/CompareFeatures", Object.keys(getters)),
        rowsToShow: () => {
            return state.numberOfAttributesToShow;
        }
    },

    /**
     * Lifecycle hook: adds a "close"-Listener to close the tool.
     * @returns {void}
     */
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapActions("Tools/CompareFeatures", Object.keys(actions)),
        ...mapMutations("Tools/CompareFeatures", Object.keys(mutations)),
        beautifyKey,
        isWebLink,
        isPhoneNumber,
        getPhoneNumberAsWebLink,
        isEmailAddress,

        /**
         * Closes this tool window by setting active to false.
         * @returns {void}
         */
        close () {
            this.setActive(false);
            // set the backbone model to active false in modellist for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            const model = Radio.request("ModelList", "getModelByAttributes", {id: this.$store.state.Tools.CompareFeatures.id});

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template lang="html">
    <Modal
        :title="$t(name)"
        :icon="glyphicon"
        :showModal="active"
        @modalHid="close"
    >
        <template>
            <h4 class="modal-title">
                {{ name }}
            </h4>
            <select
                v-if="hasMultipleLayers"
                v-model="selected"
                class="font-arial form-control input-sm pull-left"
                @change="selectLayerWithFeatures(selected.layerId)"
            >
                <option
                    disabled
                    value=""
                >
                    {{ $t("common:modules.tools.compareFeatures.topicsSelection") }}
                </option>
                <option
                    v-for="layer in selectableLayers"
                    :key="'tool-compare-features-option' + layer.layerId"
                    :value="layer.layerId"
                >
                    {{ layer.layerName }}
                </option>
            </select>
            <div
                v-if="active && !hasFeatures"
                id="no-features"
            >
                <p>
                    {{ $t("common:modules.tools.compareFeatures.noFeatures.nothingSelected", {objects: $t("common:modules.tools.compareFeatures.noFeatures.objectName")}) }}
                </p>
                <p v-html="$t('common:modules.tools.compareFeatures.noFeatures.info', {iconEmptyStar: emptyStar, iconYellowStar: yellowStar, interpolation: {escapeValue: false}})">
                </p>
            </div>
            <div
                v-if="active && hasFeatures && !hasMultipleLayers"
                id="compare-features"
            >
                <table>
                    <tbody v-if="!showMoreInfo">
                        <tr
                            v-for="(column, index) in preparedList[Object.keys(preparedList)[0]]"
                            :key="'tool-compare-features-' + index"
                        >
                            <td
                                v-for="(value, key) in column"
                                v-if="index < rowsToShow"
                                :key="'tool-compare-features-td' + key"
                            >
                                <button
                                    v-if="index === 0 && key !== 'col-1'"
                                    class="close"
                                    @click="removeFeatureFromPreparedList({'features': preparedList[Object.keys(preparedList)[0]], 'featureId': key})"
                                >
                                    <span
                                        class="glyphicon glyphicon-remove closer"
                                    ></span>
                                </button>
                                <p v-if="isWebLink(value)">
                                    <a
                                        :href="value"
                                        target="_blank"
                                    >Link</a>
                                </p>
                                <p v-else-if="isPhoneNumber(value)">
                                    <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                                </p>
                                <p v-else-if="isEmailAddress(value)">
                                    <a :href="`mailto:${value}`">{{ value }}</a>
                                </p>
                                <p
                                    v-else-if="typeof value === 'string' && value.includes('<br>')"
                                    v-html="value"
                                ></p>
                                <p
                                    v-else-if="key === 'col-1'"
                                    class="bold"
                                >
                                    {{ beautifyKey($t(value)) }}
                                </p>
                                <p v-else>
                                    {{ value }}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-if="showMoreInfo">
                        <tr
                            v-for="(column, index) in preparedList[Object.keys(preparedList)[0]]"
                            :key="'tool-compare-features-' + index"
                        >
                            <td
                                v-for="(value, key) in column"
                                :key="'tool-compare-features-td' + key"
                            >
                                <button
                                    class="close"
                                    @click="removeFeatureFromPreparedList({'features': preparedList[Object.keys(preparedList)[0]], 'featureId': key})"
                                >
                                    <span
                                        v-if="index === 0 && key !== 'col-1'"
                                        class="glyphicon glyphicon-remove closer"
                                    ></span>
                                </button>
                                <p v-if="isWebLink(value)">
                                    <a
                                        :href="value"
                                        target="_blank"
                                    >Link</a>
                                </p>
                                <p v-else-if="isPhoneNumber(value)">
                                    <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                                </p>
                                <p v-else-if="isEmailAddress(value)">
                                    <a :href="`mailto:${value}`">{{ value }}</a>
                                </p>
                                <p
                                    v-else-if="typeof value === 'string' && value.includes('<br>')"
                                    v-html="value"
                                ></p>
                                <p
                                    v-else-if="key === 'col-1'"
                                    class="bold"
                                >
                                    {{ beautifyKey($t(value)) }}
                                </p>
                                <p v-else>
                                    {{ value }}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                v-if="active && hasMultipleLayers"
                id="compare-features"
            >
                <table>
                    <tbody v-if="!showMoreInfo">
                        <tr
                            v-for="(column, index) in preparedList[selected]"
                            :key="'tool-compare-features-' + index"
                        >
                            <td
                                v-for="(value, key) in column"
                                v-if="index < rowsToShow"
                                :key="'tool-compare-features-td' + key"
                            >
                                <button
                                    class="close"
                                    @click="removeFeatureFromPreparedList({'features': preparedList[selected], 'featureId': key, 'selectedLayer': selected})"
                                >
                                    <span
                                        v-if="index === 0 && key !== 'col-1'"
                                        class="glyphicon glyphicon-remove closer"
                                    ></span>
                                </button>
                                <p v-if="isWebLink(value)">
                                    <a
                                        :href="value"
                                        target="_blank"
                                    >Link</a>
                                </p>
                                <p v-else-if="isPhoneNumber(value)">
                                    <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                                </p>
                                <p v-else-if="isEmailAddress(value)">
                                    <a :href="`mailto:${value}`">{{ value }}</a>
                                </p>
                                <p
                                    v-else-if="typeof value === 'string' && value.includes('<br>')"
                                    v-html="value"
                                ></p>
                                <p
                                    v-else-if="key === 'col-1'"
                                    class="bold"
                                >
                                    {{ beautifyKey($t(value)) }}
                                </p>
                                <p v-else>
                                    {{ value }}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-if="showMoreInfo">
                        <tr
                            v-for="(column, index) in preparedList[selected]"
                            :key="'tool-compare-features-' + index"
                        >
                            <td
                                v-for="(value, key) in column"
                                :key="'tool-compare-features-td' + key"
                            >
                                <button
                                    class="close"
                                    @click="removeFeatureFromPreparedList({'features': preparedList[selected], 'featureId': key, 'selectedLayer': selected})"
                                >
                                    <span
                                        v-if="index === 0 && key !== 'col-1'"
                                        class="glyphicon glyphicon-remove closer"
                                    ></span>
                                </button>
                                <p v-if="isWebLink(value)">
                                    <a
                                        :href="value"
                                        target="_blank"
                                    >Link</a>
                                </p>
                                <p v-else-if="isPhoneNumber(value)">
                                    <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                                </p>
                                <p v-else-if="isEmailAddress(value)">
                                    <a :href="`mailto:${value}`">{{ value }}</a>
                                </p>
                                <p
                                    v-else-if="typeof value === 'string' && value.includes('<br>')"
                                    v-html="value"
                                ></p>
                                <p
                                    v-else-if="key === 'col-1'"
                                    class="bold"
                                >
                                    {{ beautifyKey($t(value)) }}
                                </p>
                                <p v-else>
                                    {{ value }}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                v-if="hasFeatures"
                id="buttons"
            >
                <button
                    class="btn btn-primary btn-infos"
                    @click="moreInfo()"
                >
                    {{ !showMoreInfo ? $t("common:modules.tools.compareFeatures.moreInfo") : $t("common:modules.tools.compareFeatures.lessInfo") }}
                </button>
                <button
                    class="btn btn-primary btn-infos"
                    @click="preparePrint()"
                >
                    {{ $t("common:modules.tools.compareFeatures.exportAsPdf") }}
                </button>
            </div>
        </template>
    </Modal>
</template>

<style lang="less" scoped>
    @import "~variables";
    @background_color_1: rgb(0, 92, 169);
    @font_family_1: "MasterPortalFont Bold","Arial Narrow",Arial,sans-serif;

    .modal-title {
        font-family: @font_family_1;
    }
    select {
        margin-bottom: 5px;
        width: auto;
    }
    #compare-features {
        max-height: 80vh;
        display: inline-flex;
        overflow-y: auto;
        width: 100%;
    }

    .btn {
        background-color: @background_color_1;
        &:hover {
            opacity: 0.9;
        }
    }
    #buttons {
        text-align: center;
        margin: 10px;
    }
    .closer {
        position: relative !important;
        right: 0px !important;
        top: 0px !important;
    }
    td {
        border: 1px solid #999;
        padding: 0.5rem;
        text-align: left;
    }
    table {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    table td, table th {
        border: 1px solid #ddd;
        padding: 8px;
    }

    table tr:nth-child(even){background-color: #f2f2f2;}

    table tr:hover {background-color: #ddd;}

    table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #4CAF50;
        color: white;
    }

    label {
        margin-top: 7px;
    }
    .close {
        float: right;
    }
</style>
