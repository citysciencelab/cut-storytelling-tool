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
        },
        defaultSelection: () => {
            return Object.keys(state.layerFeatures)[0];
        }
    },

    /**
     * Lifecycle hook: adds a "close"-Listener to close the tool.
     * @returns {void}
     */
    created () {
        this.$on("close", this.close);
    },
    updated () {
        console.log(this.defaultSelection);
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
            <h1>{{ name }}</h1>
            <select
                v-if="hasMultipleLayers"
                v-model="selected"
                class="font-arial form-control input-sm pull-left"
                @change="selectLayerWithFeatures(selected.layerId)"
            >
                
                <option
                    v-for="layer in selectableLayers"
                    :key="'tool-compare-features-option' + layer.layerId"
                    :value="layer.layerId"
                >
                    {{ defaultSelection }}
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
                                    class="close"
                                    @click="removeFeatureFromPreparedList({'features': preparedList[Object.keys(preparedList)[0]], 'featureId': key})"
                                >
                                    <span
                                        v-if="index === 0 && key !== 'col-1'"
                                        class="glyphicon glyphicon-remove closer"
                                    ></span>
                                </button>

                                {{ value }}
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

                                {{ value }}
                            </td>
                        </tr>
                    </tbody>
                    <button @click="moreInfo()">
                        More Info
                    </button>
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
                                {{ value }}
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
                                {{ value }}
                            </td>
                        </tr>
                    </tbody>
                    <button @click="moreInfo()">
                        More Info
                    </button>
                </table>
            </div>
        </template>
    </Modal>
</template>

<style lang="less" scoped>
    @import "~variables";
    table {
        border-collapse: collapse;
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
    label {
        margin-top: 7px;
    }
    #no-features {
        color: red;
    }
    .close {
        float: right;
    }
</style>
