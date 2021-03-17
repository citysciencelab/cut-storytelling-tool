<script>
import {mapGetters, mapActions} from "vuex";
import actions from "../../../store/actionsGfi";
import getters from "../../../../compareFeatures/store/gettersCompareFeatures";
import componentExists from "../../../../../../utils/componentExists.js";

export default {
    name: "CompareFeatureIcon",
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters("Map", ["visibleLayerListWithChildrenFromGroupLayers"]),
        ...mapGetters("Tools/CompareFeatures", Object.keys(getters)),
        featureIsOnCompareList () {
            const gfiFeature = {featureId: this.feature.getId(),
                layerId: this.feature.getLayerId(),
                layerName: this.feature.getTitle(),
                attributesToShow: this.feature.getAttributesToShow(),
                properties: this.feature.getMappedProperties()};

            return this.isFeatureSelected(gfiFeature);
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
        componentExists,

        /**
         * Triggers the event "addFeatureToList" of the CompareFeatures module to add the feature.
         * @param {Event} event The click event.
         * @returns {void}
         */
        toogleFeatureToCompareList: function (event) {
            const gfiFeature = {featureId: this.feature.getId(),
                layerId: this.feature.getLayerId(),
                layerName: this.feature.getTitle(),
                attributesToShow: this.feature.getAttributesToShow(),
                properties: this.feature.getMappedProperties()};

            if (event?.target?.classList?.contains("glyphicon-star-empty")) {
                this.addFeatureToList(gfiFeature);
            }
            else {
                this.removeFeatureFromList(gfiFeature);
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
