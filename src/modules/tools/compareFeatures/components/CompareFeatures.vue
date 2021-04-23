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
        ...mapGetters("Tools/CompareFeatures", Object.keys(getters))
    },
    created () {
        this.$on("close", this.close);
    },
    updated () {
        if (!state.hasMultipleLayers && Object.values(state.layerFeatures)[0] !== undefined) {
            const firstObject = Object.values(state.layerFeatures)[0][0],
                length = Object.keys(firstObject.properties).length;

            state.showMoreInfoButton = length > state.numberOfAttributesToShow;
        }
    },
    methods: {
        ...mapActions("Tools/CompareFeatures", Object.keys(actions)),
        ...mapMutations("Tools/CompareFeatures", Object.keys(mutations)),
        beautifyKey,
        isWebLink,
        isPhoneNumber,
        getPhoneNumberAsWebLink,
        isEmailAddress,

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

<template
    lang="html"
    class="template"
>
    <Modal
        :title="$t('common:modules.tools.compareFeatures.title')"
        :icon="glyphicon"
        :showModal="active"
        @modalHid="close"
    >
        <Modal
            :title="$t('common:modules.tools.compareFeatures.title')"
            :icon="glyphicon"
            :showModal="showAlert && !active"
            @modalHid="setShowAlert(false)"
        >
            <div v-if="!listFull">
                <h4>{{ $t("common:modules.tools.compareFeatures.feedback.added") }}</h4>
                <hr>
            </div>
            <div v-if="listFull">
                <h4>{{ $t("common:modules.tools.compareFeatures.feedback.notAdded") }}</h4>
                <hr>
                <p>{{ $t("common:modules.tools.compareFeatures.feedback.limitReached") }}</p>
                <p>{{ $t("common:modules.tools.compareFeatures.feedback.removeObjects") }}</p>
                <hr>
            </div>
            <template>
                <div id="tool-compareFeatures-buttons">
                    <button
                        class="btn btn-primary btn-infos"
                        :title="$t('common:button.back')"
                        @click="setShowAlert(false)"
                    >
                        {{ $t("common:button.back") }}
                    </button>
                    <button
                        class="btn btn-primary btn-infos"
                        :title="$t('common:modules.tools.compareFeatures.feedback.goToComparisonlist')"
                        @click="switchToList"
                    >
                        {{ $t("common:modules.tools.compareFeatures.feedback.goToComparisonlist") }}
                    </button>
                </div>
            </template>
        </Modal>
        <template>
            <h4 class="tool-compareFeatures-modal-title">
                {{ $t('common:modules.tools.compareFeatures.title') }}
            </h4>
            <div
                v-if="hasMultipleLayers"
                id="tool-compareFeatures-select-container"
            >
                <hr>
                <label
                    id="tool-compareFeatures-select-label"
                    class="col-xs-3"
                >{{ $t("common:modules.tools.compareFeatures.topicsSelection") }}</label>
                <div class="col-xs-3">
                    <select
                        id="tool-compareFeatures-select"
                        v-model="selected"
                        class="form-control"
                        @change="selectLayerWithFeatures(selected)"
                    >
                        <option
                            disabled
                            value=""
                        >
                            {{ $t("common:modules.tools.compareFeatures.topicsSelection") }}
                        </option>
                        <option
                            v-for="layer in selectableLayers"
                            :key="'tool-compareFeatures-option' + layer.layerId"
                            :value="layer.layerId"
                        >
                            {{ layer.layerName }}
                        </option>
                    </select>
                </div>
            </div>
            <div
                v-if="!hasFeatures"
                id="tool-compareFeatures-no-features"
            >
                <hr>
                <p>
                    {{ $t("common:modules.tools.compareFeatures.noFeatures.nothingSelected", {objects: $t("common:modules.tools.compareFeatures.noFeatures.objectName")}) }}
                </p>
                <p v-html="$t('common:modules.tools.compareFeatures.noFeatures.info', {iconEmptyStar, iconYellowStar, interpolation: {escapeValue: false}})">
                </p>
            </div>
            <div
                v-if="hasFeatures && !hasMultipleLayers"
                id="tool-compareFeatures"
            >
                <table>
                    <tbody>
                        <tr
                            v-for="(column, index) in preparedList[Object.keys(preparedList)[0]]"
                            :key="'tool-compareFeatures-' + index"
                        >
                            <template
                                v-if="index < numberOfAttributesToShow && !showMoreInfo"
                            >
                                <td
                                    v-for="(value, key) in column"
                                    :key="'tool-compareFeatures-td' + key"
                                >
                                    <button
                                        v-if="index === 0 && key !== 'col-1'"
                                        class="close"
                                        :title="$t('common:modules.tools.compareFeatures.removeFromList')"
                                        @click="removeFeatureFromPreparedList({features: preparedList[Object.keys(preparedList)[0]], featureId: key})"
                                    >
                                        <span
                                            class="glyphicon glyphicon-remove remove-feature"
                                        />
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
                            </template>
                            <template v-if="showMoreInfo">
                                <td
                                    v-for="(value, key) in column"
                                    :key="'tool-compareFeatures-td' + key"
                                >
                                    <button
                                        class="close"
                                        :title="$t('common:modules.tools.compareFeatures.removeFromList')"
                                        @click="removeFeatureFromPreparedList({features: preparedList[Object.keys(preparedList)[0]], featureId: key})"
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
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                v-if="active && hasMultipleLayers"
                id="tool-compareFeatures"
            >
                <table>
                    <tbody>
                        <tr
                            v-for="(column, index) in preparedList[selected]"
                            :key="'tool-compareFeatures-' + index"
                        >
                            <template
                                v-if="index < numberOfAttributesToShow && !showMoreInfo"
                            >
                                <td
                                    v-for="(value, key) in column"
                                    :key="'tool-compareFeatures-td' + key"
                                >
                                    <button
                                        class="close"
                                        :title="$t('common:modules.tools.compareFeatures.removeFromList')"
                                        @click="removeFeatureFromPreparedList({features: preparedList[selected], featureId: key, selectedLayer: selected})"
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
                            </template>
                            <template
                                v-if="showMoreInfo"
                            >
                                <td
                                    v-for="(value, key) in column"
                                    :key="'tool-compareFeatures-td' + key"
                                >
                                    <button
                                        class="close"
                                        :title="$t('common:modules.tools.compareFeatures.removeFromList')"
                                        @click="removeFeatureFromPreparedList({features: preparedList[selected], featureId: key, selectedLayer: selected})"
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
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div
                v-if="showButtons"
                id="tool-compareFeatures-buttons"
            >
                <button
                    class="btn btn-primary btn-infos"
                    :title="!showMoreInfo ? $t('common:modules.tools.compareFeatures.moreInfo') : $t('common:modules.tools.compareFeatures.lessInfo')"
                    :disabled="!showMoreInfoButton"
                    @click="moreInfo()"
                >
                    {{ !showMoreInfo ? $t("common:modules.tools.compareFeatures.moreInfo") : $t("common:modules.tools.compareFeatures.lessInfo") }}
                </button>
                <button
                    class="btn btn-primary btn-infos"
                    :title="$t('common:modules.tools.compareFeatures.exportAsPdf')"
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
    @background_color_2: #eee;
    @background_color_3: #ddd;
    @background_color_4: #ccc;
    @font_family_1: "MasterPortalFont Bold","Arial Narrow",Arial,sans-serif;

    .tool-compareFeatures-modal-title {
        font-family: @font_family_1;
    }
    h4 {
        padding: 20px;
    }
    #tool-compareFeatures-select-container {
        padding-bottom: 50px;
    }
    #tool-compareFeatures-select {
        width: auto;
        font-family: @font_family_default;
    }
    #tool-compareFeatures-select-label {
        font-family: @font_family_1;
        font-size: 13px;
        font-weight: normal;
        line-height: 17px;
        color: #646262;
        margin-right: 20px;
        white-space: nowrap;
    }
    #tool-compareFeatures {
        z-index: -1;
        max-height: 80vh;
        display: inline-flex;
        overflow-y: auto;
        width: 100%;
    }
    .btn {
        background-color: @background_color_1;
        margin-right: 20px;
        margin-left: 20px;
        &:hover {
            opacity: 0.9;
        }
        padding-right: 10px;
    }
    #tool-compareFeatures-buttons {
        text-align: center;
        margin: 10px;
        padding-right: 10px;
    }
    .remove-feature {
        position: relative !important;
        right: 0px !important;
        top: 0px !important;
    }
    td {
        padding: 0.5rem;
        text-align: left;
    }
    // scss schachteln
    table {
        font-family: @font_family_default;
        border-collapse: collapse;
        width: 100%;
    }
    table th {
        border-top: 1px solid #ccc;
        padding: 8px;
    }
    table tr {
        &:first-child {
            border-top: 1px solid #ccc;
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
    table td {
        padding: 8px;
        border-left: 1px solid #ccc;
    }
    table tr:hover {
        background-color: #ddd;
    }
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
    #tool-compareFeatures-no-features {
        width: 50vh;
        padding: 5px;
        padding-top: 0;
        p {
            line-height: 22px;
            &:first-child {
                font-family: @font_family_1;
                font-size: 14px;
            }
        }
    }
</style>

<style lang="less">
    #modal-1-container #modal-1-overlay {
        z-index: 1000;
    }
    #modal-1-container #modal-1-inner-wrapper #modal-1-content-container {
        padding: 0;
    }
</style>
