<script>
import isObject from "../../../../utils/isObject.js";
import {getLayerByLayerId} from "../utils/openlayerFunctions";
import beautifyKey from "../../../../utils/beautifyKey.js";
import {translateKeyWithPlausibilityCheck} from "../../../../utils/translateKeyWithPlausibilityCheck.js";

export default {
    name: "SnippetFeatureInfo",
    props: {
        adjustment: {
            type: [Object, Boolean],
            required: false,
            default: false
        },
        title: {
            type: [String, Boolean],
            required: false,
            default: true
        },
        layerId: {
            type: String,
            required: false,
            default: undefined
        },
        snippetId: {
            type: Number,
            required: false,
            default: 0
        },
        visible: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data () {
        return {
            featureInfo: null
        };
    },
    computed: {
        titleText () {
            if (typeof this.title === "string") {
                return translateKeyWithPlausibilityCheck(this.title, key => this.$t(key));
            }
            return "";
        },
        featureInfoWithoutDuplicates () {
            if (this.featureInfo === null) {
                return [];
            }
            const result = {};

            Object.entries(this.featureInfo).forEach(([key, value]) => {
                result[key] = [...new Set(value)].join(", ");
            });
            return result;
        }
    },
    watch: {
        adjustment (adjusting) {
            if (!isObject(adjusting)) {
                return;
            }

            if (adjusting?.start) {
                this.featureInfo = null;
            }

            this.featureInfo = this.mergeFeatureInfo(this.featureInfo, adjusting.adjust);

            if (adjusting?.finish) {
                if (typeof this.gfiAttributes === "undefined") {
                    this.featureInfo = this.beautifyObjectKeys(this.featureInfo);
                }
                else {
                    this.featureInfo = Radio.request("Util", "renameKeys", this.gfiAttributes, this.featureInfo);
                }
                if (this.visible === false) {
                    this.$emit("setSnippetVisibleById", true, this.snippetId);
                }
            }
        }
    },
    created () {
        if (this.layerId) {
            this.setGfiAttributes(this.layerId);
        }
    },
    methods: {
        /**
         * Beautify the keys of an object.
         * @param {Object} unlovelyObject - The object to be beautified.
         * @returns {Object} The beautified object.
         */
        beautifyObjectKeys (unlovelyObject) {
            const beautifiedObj = {};

            Object.entries(unlovelyObject).forEach(([key, value]) => {
                beautifiedObj[beautifyKey(key)] = value;
            });
            return beautifiedObj;
        },

        /**
         * Sets the gfiAttributes of a layer by the id if available
         * and if gfiAttributes are an object. It can also be a string ("ignore" or "showAll").
         * Is used to beautify the keys of the feature info.
         * @param {String} layerId - The id of the layer.
         * @returns {void}
         */
        setGfiAttributes (layerId) {
            const layer = getLayerByLayerId(layerId);

            this.gfiAttributes = isObject(layer?.get("gfiAttributes")) ? layer.get("gfiAttributes") : undefined;
        },

        /**
         * Merge existing and new feature info.
         * @param {Object} existingFeatureInfo - Existing feature info otherwise null.
         * @param {Object|Boolean} newFeatureInfo - New available feature info otherwise false.
         * @returns {Object} New merged feature info.
         */
        mergeFeatureInfo (existingFeatureInfo, newFeatureInfo) {
            if (!newFeatureInfo) {
                return existingFeatureInfo;
            }
            if (existingFeatureInfo === null) {
                return newFeatureInfo;
            }

            Object.entries(newFeatureInfo).forEach(([key, value]) => {
                if (!Object.prototype.hasOwnProperty.call(existingFeatureInfo, key)) {
                    existingFeatureInfo[key] = [];
                }

                existingFeatureInfo[key] = existingFeatureInfo[key].concat(value);
            });

            return existingFeatureInfo;
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        class="snippetFeatureInfoContainer"
    >
        <h6 v-if="title">
            {{ titleText }}
        </h6>
        <dl class="row">
            <template v-for="(value, key, index) in featureInfoWithoutDuplicates">
                <dt
                    :key="key + index"
                    class="col-sm-4"
                >
                    {{ key }}&#58;
                </dt>
                <template v-if="value === ''">
                    <dd
                        :key="key"
                        class="col-sm-8"
                    >
                        ---
                    </dd>
                </template>
                <template v-else>
                    <dd
                        :key="key"
                        class="col-sm-8"
                    >
                        {{ value }}
                    </dd>
                </template>
            </template>
        </dl>
    </div>
</template>

<style lang="scss" scoped>
    .snippetFeatureInfoContainer {
        border: 1px solid #ddd;
        padding: 8px;
        h6 {
            color: #E10019
        }
        .row {
            margin-bottom: 0;
            dt {
                font-weight: normal;
            }
        }
    }
</style>
