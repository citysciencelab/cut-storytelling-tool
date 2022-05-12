<script>
import isObject from "../../../../utils/isObject.js";
import {getLayerByLayerId} from "../utils/openlayerFunctions";
import beautifyKey from "../../../../utils/beautifyKey.js";

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
    watch: {
        adjustment (adjusting) {
            if (!isObject(adjusting)) {
                return;
            }

            if (adjusting?.start) {
                this.featureInfo = null;
            }

            if (adjusting?.finish) {
                if (typeof this.gfiAttributes === "undefined") {
                    this.featureInfo = this.beautifyObjectKeys(adjusting.adjust);
                }
                else {
                    this.featureInfo = Radio.request("Util", "renameKeys", this.gfiAttributes, adjusting.adjust);
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

            for (const [key, value] of Object.entries(unlovelyObject)) {
                beautifiedObj[beautifyKey(key)] = value;
            }
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
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        class="snippetSummaryContainer"
    >
        <h6 v-if="title">
            {{ title }}
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
    .snippetSummaryContainer {
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
