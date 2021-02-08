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
    data: () => {
        return {
            // featureIsOnCompareList: false,
            olFeature: null
        };
    },
    computed: {
        ...mapGetters("Map", ["visibleLayerListWithChildrenFromGroupLayers"]),
        ...mapGetters("Tools/CompareFeatures", Object.keys(getters)),
        featureIsOnCompareList: {
            get () {
                const gfiFeature = {featureId: this.feature.getId(),
                    layerId: this.feature.getLayerId(),
                    attributesToShow: this.feature.getAttributesToShow(),
                    properties: this.feature.getMappedProperties()};

                return this.isFeatureSelected(gfiFeature);
            },
            set (value) {
                return value; // TODO: Ob das so richtig ist??? Setter nur wegen Fehlermeldung eingebaut.
            }
        },

        /**
         * Returns the correct title, depending on whether the feature is on the comparelist or not.
         * @returns {String} Title for the comparelist.
         */
        titleCompareList: function () {
            return this.featureIsOnCompareList ? this.$t("modules.tools.gfi.favoriteIcons.compareFeatureIcon.fromCompareList") : this.$t("modules.tools.gfi.favoriteIcons.compareFeatureIcon.toCompareList");
        }
    },
    watch: {
        feature () {
            this.initialize();
        }
    },
    created () {
        this.initialize();
    },
    methods: {
        ...mapActions("Tools/Gfi", Object.keys(actions)),
        componentExists,

        /**
         * Checks if the feature is on the comparelist.
         * Starts to prepare the data and sets up the listener.
         * @param {Object} feature The feature from property
         * @returns {void}
         */
        initialize: function () {
            this.fetchOlFeature();

            // if (this.olFeature) {
            //     this.featureIsOnCompareList = this.olFeature.get("isOnCompareList");
            //     this.olFeature.on("propertychange", this.toggleFeatureIsOnCompareList.bind(this));
            // }
        },

        /**
         * Returns the olFeature from layer in the layerList associated with the feature.
         * It also searches in clustered features.
         * @returns {ol/Feature} The olFeature
         */
        fetchOlFeature: function () {
            if (this.visibleLayerListWithChildrenFromGroupLayers?.length > 0) {
                const foundLayer = this.visibleLayerListWithChildrenFromGroupLayers.find(layer => layer.get("id") === this.feature.getLayerId());

                if (foundLayer && typeof foundLayer.get("source").getFeatures === "function") {
                    const foundFeatures = foundLayer.get("source").getFeatures();

                    foundFeatures.forEach(feature => {
                        if (feature.get("features")) {
                            feature.get("features").forEach(feat => {
                                if (feat?.getId() === this.feature.getId()) {
                                    this.olFeature = feat;
                                }
                            });
                        }
                        else if (feature?.getId() === this.feature.getId()) {
                            this.olFeature = feature;
                        }
                    });
                }
            }
        },

        /**
         * Indicates whether the feature is on the comparelist.
         * @param {Event} event The given event.
         * @returns {void}
         */
        // toggleFeatureIsOnCompareList: function (event) {
        //     if (event.key === "isOnCompareList") {
        //         this.featureIsOnCompareList = event.target.get("isOnCompareList");
        //     }
        // },

        /**
         * Triggers the event "addFeatureToList" to the CompareFeatures module to add the feature.
         * @param {Event} event The click event.
         * @returns {void}
         */
        toogleFeatureToCompareList: function (event) {
            const gfiFeature = {featureId: this.feature.getId(),
                layerId: this.feature.getLayerId(),
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
        v-if="olFeature && componentExists('compareFeatures')"
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
