<script>
import Modal from "../../../../share-components/modals/components/Modal.vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import * as constants from "../store/constantsCompareFeatures";
import ComparisonList from "./ComparisonList.vue";
import getters from "../store/gettersCompareFeatures";
import state from "../store/stateCompareFeatures";
import actions from "../store/actionsCompareFeatures";
import mutations from "../store/mutationsCompareFeatures";
import {preparePrint} from "../utils/preparePrint.js";
import beautifyKey from "../../../../utils/beautifyKey.js";
import {isWebLink} from "../../../../utils/urlHelper.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../../../utils/isPhoneNumber.js";
import {isEmailAddress} from "../../../../utils/isEmailAddress.js";

export default {
    name: "CompareFeatures",
    components: {
        Modal,
        ComparisonList
    },
    data () {
        return {
            iconEmptyStar: constants.iconEmptyStar,
            iconYellowStar: constants.iconYellowStar
        };
    },
    computed: {
        ...mapGetters("Tools/CompareFeatures", Object.keys(getters)),
        selected: {
            get () {
                return state.selectedLayer;
            },
            set (newValue) {
                this.selectLayerWithFeatures(newValue);
            }
        }
    },
    created () {
        this.$on("close", this.close);
    },
    updated () {
        this.enableButton();
    },
    methods: {
        ...mapActions("Tools/CompareFeatures", Object.keys(actions)),
        ...mapMutations("Tools/CompareFeatures", Object.keys(mutations)),
        preparePrint,
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
        :show-modal="active"
        @modalHid="close"
    >
        <Modal
            :title="$t('common:modules.tools.compareFeatures.title')"
            :icon="glyphicon"
            :show-modal="showAlert && !active"
            @modalHid="setShowAlert(false)"
        >
            <div>
                <div v-if="!listFull">
                    <h4 v-if="currentFeatureName">
                        {{ $t("common:modules.tools.compareFeatures.feedback.addedWithName", {currentFeatureName}) }}
                    </h4>
                    <h4 v-else>
                        {{ $t("common:modules.tools.compareFeatures.feedback.added") }}
                    </h4>
                    <hr>
                </div>
                <div
                    v-else
                    id="tool-compareFeatures-buttons-feedback-listFull"
                >
                    <h4 v-if="currentFeatureName">
                        {{ $t("common:modules.tools.compareFeatures.feedback.notAddedWithName", {currentFeatureName}) }}
                    </h4>
                    <h4 v-else>
                        {{ $t("common:modules.tools.compareFeatures.feedback.notAdded") }}
                    </h4>
                    <hr>
                    <p>{{ $t("common:modules.tools.compareFeatures.feedback.limitReached") }}</p>
                    <p>{{ $t("common:modules.tools.compareFeatures.feedback.removeObjects") }}</p>
                    <hr>
                </div>
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
                        @click="setActive(true)"
                    >
                        {{ $t("common:modules.tools.compareFeatures.feedback.goToComparisonlist") }}
                    </button>
                </div>
            </div>
        </Modal>
        <template #header>
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
                    >
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
        </template>
        <div>
            <div
                v-if="!hasFeatures"
                id="tool-compareFeatures-no-features"
            >
                <hr>
                <p class="bold">
                    {{ $t("common:modules.tools.compareFeatures.noFeatures.nothingSelected", {objects: $t("common:modules.tools.compareFeatures.noFeatures.objectName")}) }}
                </p>
                <br>
                <p v-html="$t('common:modules.tools.compareFeatures.noFeatures.info', {iconEmptyStar, iconYellowStar, interpolation: {escapeValue: false}})" />
            </div>
            <ComparisonList
                v-if="hasFeatures && !hasMultipleLayers"
                id="tool-compareFeatures-comparisonListSingleLayer"
                :list-of-features="preparedList[Object.keys(preparedList)[0]]"
                :max-attributes-to-show="numberOfAttributesToShow"
                :enable-more-info="showMoreInfo"
                :title-remove-button="$t('common:modules.tools.compareFeatures.removeFromList')"
            />
            <ComparisonList
                v-if="active && hasMultipleLayers"
                id="tool-compareFeatures-comparisonListMultipleLayers"
                :list-of-features="preparedList[selectedLayer]"
                :selected-layer="selectedLayer"
                :max-attributes-to-show="numberOfAttributesToShow"
                :enable-more-info="showMoreInfo"
                :title-remove-button="$t('common:modules.tools.compareFeatures.removeFromList')"
            />
        </div>
        <template #footer>
            <div
                v-if="showButtons"
                id="tool-compareFeatures-buttons"
            >
                <hr>

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
                    @click="preparePrint();"
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
    #tool-compareFeatures-buttons-feedback-listFull {
        text-align: center;
    }
    h4 {
        padding-top: 10px;
        padding-left: 20px;
        padding-right: 20px;
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
    #tool-compareFeatures-no-features {
        padding: 15px;
        padding-top: 0;
        p {
            line-height: 22px;
            &:first-child {
                font-family: @font_family_1;
                font-size: 14px;
            }
        }
    }
    label {
        margin-top: 7px;
    }
    #test {
        width: 20px;
    }
</style>

<style lang="less">

    #modal-1-container #modal-1-overlay {
        z-index: 1000;
    }
    #modal-1-container #modal-1-inner-wrapper #modal-1-content-container {
        padding: 0;
        overflow: auto;
        max-height: 70vh;
    }
</style>
