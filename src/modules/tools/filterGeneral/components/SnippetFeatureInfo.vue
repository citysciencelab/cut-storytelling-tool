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
            // the infos that are displayed
            featureInfo: null
        };
    },
    computed: {
        titleText () {
            if (typeof this.title === "string") {
                return translateKeyWithPlausibilityCheck(this.title, key => this.$t(key));
            }
            return "";
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
        // this is only used to beautify the keys of the feature info
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
         * Sets the gfiAttributes of a layer by the id if available.
         * @param {String} layerId - The id of the layer.
         * @returns {void}
         */
        setGfiAttributes (layerId) {
            const layer = getLayerByLayerId(layerId);

            this.gfiAttributes = layer?.get("gfiAttributes");
        },

        /**
         * Merge feature info and deletes duplicate values.
         * @param {Object|Null} existingInfo - Existing feature info otherwise null.
         * @param {Object|boolean} newInfo - New available feature info otherwise false.
         * @returns {Object} New merged Object.
         */
        mergeFeatureInfo (existingInfo, newInfo) {
            // No new feature info
            if (!newInfo) {
                return existingInfo;
            }
            // No existing feature info - first merge
            if (existingInfo === null) {
                return newInfo;
            }

            const obj = {};

            Object.keys({...existingInfo, ...newInfo}).forEach(key => {

                const unionInfo = [...existingInfo[key]?.split(", ") || "", ...newInfo[key]?.split(", ") || ""];

                obj[key] = [...new Set(unionInfo)].join(", ");
            });

            return obj;
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
            <template v-for="(value, key, index) in featureInfo">
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
