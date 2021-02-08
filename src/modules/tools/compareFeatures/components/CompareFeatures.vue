<script>
import Tool from "../../Tool.vue";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersCompareFeatures";
import actions from "../store/actionsCompareFeatures";
import mutations from "../store/mutationsCompareFeatures";
import beautifyKey from "../../../../utils/beautifyKey.js";
import {isWebLink} from "../../../../utils/urlHelper.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../../../utils/isPhoneNumber.js";
import {isEmailAddress} from "../../../../utils/isEmailAddress.js";

export default {
    name: "CompareFeatures",
    components: {
        Tool
    },
    computed: {
        ...mapGetters("Tools/CompareFeatures", Object.keys(getters))
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
    <Tool
        :title="$t(name)"
        :icon="glyphicon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivateGFI="deactivateGFI"
    >
        <template v-slot:toolBody>
            <select
                v-if="hasMultipleLayers"
                class="font-arial form-control input-sm pull-left"
            >
                <option
                    v-for="layer in selectableLayers"
                    :key="layer"
                    :value="layer"
                >
                    {{ layer }}
                </option>
            </select>
            <div
                v-if="active && !hasFeatures"
                id="no-features"
            >
                <h1>
                    {{ name }}
                </h1>
                <p>
                    {{ $t("common:modules.tools.compareFeatures.noFeatures.nothingSelected", {objects: $t("common:modules.tools.compareFeatures.noFeatures.objectName")}) }}
                </p>
                <p>
                    {{ $t("common:modules.tools.compareFeatures.noFeatures.info", {iconEmptyStar: emptyStar, iconYellowStar: yellowStar}) }}
                    <!-- TODO: Glyphicons don´t work -->
                </p>
            </div>
            <div
                v-if="active && hasFeatures"
                id="compare-features"
            >
                <table
                    v-for="features in layerFeatures"
                    :key="features"
                    class="table parent table-hover"
                >
                    <tbody class="child child-1">
                        <tr
                            v-for="(value, key) in features[0].properties"
                            :key="key"
                        >
                            <td class="bold">
                                {{ beautifyKey($t(key)) }}
                            </td>
                        </tr>
                    </tbody>
                    <tbody
                        v-for="feature in features"
                        :key="feature"
                        class="child child-2"
                    >
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            @click="removeFeature(feature)"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <tr
                            v-for="(value, key) in feature.properties"
                            :key="key"
                        >
                            <td v-if="isWebLink(value)">
                                <a
                                    :href="value"
                                    target="_blank"
                                >Link</a>
                            </td>
                            <td v-else-if="isPhoneNumber(value)">
                                <a :href="getPhoneNumberAsWebLink(value)">{{ value }}</a>
                            </td>
                            <td v-else-if="isEmailAddress(value)">
                                <a :href="`mailto:${value}`">{{ value }}</a>
                            </td>
                            <td
                                v-else-if="typeof value === 'string' && value.includes('<br>')"
                                v-html="value"
                            >
                            </td>
                            <td v-else>
                                {{ value }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </Tool>
</template>

<style lang="less" scoped>
    @import "~variables";
    label {
        margin-top: 7px;
    }
    #no-features {
        color: red;
    }
    .child {
    top: 0;
    border-top: hidden;
    }

    .child-1 {
    position: absolute;
    left: 0;
    }

    .child-2 {
    position: relative;
    left: 210px;
    float: left;
    }

    .parent {
    position: relative;
    height: 100%;
    width: 80vw;
    }
</style>
