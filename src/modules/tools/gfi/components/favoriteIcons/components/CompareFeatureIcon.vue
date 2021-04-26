<script>
import {mapGetters, mapActions} from "vuex";
import actions from "../../../store/actionsGfi";
import componentExists from "../../../../../../utils/componentExists.js";

export default {
    name: "CompareFeatureIcon",
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    data: function () {
        return {
            gfiFeature: {featureId: this.feature.getId(),
                layerId: this.feature.getLayerId(),
                layerName: this.feature.getTitle(),
                attributesToShow: this.feature.getAttributesToShow(),
                properties: this.feature.getMappedProperties()}
        };
    },
    computed: {
        ...mapGetters("Tools/CompareFeatures", ["isFeatureSelected"]),
        /**
         * Returns Boolean after checking if feature is on comparison list.
         * @returns {String} Title for the comparelist.
         */
        featureIsOnCompareList () {
            return this.isFeatureSelected(this.gfiFeature);
        },

        /**
         * Returns the correct title, depending on whether the feature is on the comparelist or not.
         * @returns {String} Title for the comparelist.
         */
        titleCompareList: function () {
            return this.featureIsOnCompareList ? this.$t("modules.tools.gfi.favoriteIcons.compareFeatureIcon.fromCompareList") : this.$t("modules.tools.gfi.favoriteIcons.compareFeatureIcon.toCompareList");
        }
    },
    methods: {
        ...mapActions("Tools/Gfi", Object.keys(actions)),
        ...mapActions("Tools/CompareFeatures", ["isFeatureOnCompareList", "removeFeature"]),
        componentExists,

        /**
         * Triggers the event "addFeatureToList" of the CompareFeatures module to add the feature.
         * @param {Event} event The click event.
         * @returns {void}
         */
        toogleFeatureToCompareList: function (event) {
            if (event?.target?.classList?.contains("glyphicon-star-empty")) {
                this.isFeatureOnCompareList(this.gfiFeature);
            }
            else {
                this.removeFeature(this.gfiFeature);
            }
        }
    }
};
</script>

<template>
    <span
        v-if="componentExists('compareFeatures')"
        :class="['glyphicon', featureIsOnCompareList ? 'glyphicon-star' : 'glyphicon-star-empty']"
        :title="titleCompareList"
        @click="toogleFeatureToCompareList"
    ></span>
</template>

<style lang="less" scoped>
@color: #fec44f;

.glyphicon-star {
    color: @color;
}
</style>
