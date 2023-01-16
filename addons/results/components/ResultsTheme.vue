<script>
import beautifyKey from "../../../src/utils/beautifyKey.js";
import {isWebLink} from "../../../src/utils/urlHelper.js";
import {translateKeyWithPlausibilityCheck} from "../../../src/utils/translateKeyWithPlausibilityCheck.js";
import {mapGetters, mapActions} from "vuex";
import {getPropertiesWithFullKeys} from "../../../src/modules/tools/gfi/utils/getPropertiesWithFullKeys";
import axios from "axios";

export default {
    name: "ResultsTheme",
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            filteredProps: {},
            beautifyKeysParam: true,
            showObjectKeysParam: false
        };
    },
    computed: {
        ...mapGetters("Tools/Gfi", ["gfiFeatures"]),
        ...mapGetters("MapMarker", ["markerPolygon"])
    },
    watch: {},
    mounted () {
        this.$parent.$emit("hidemarker");
        const toolWindow = document.getElementsByClassName("gfi-footer")[0];

        if (toolWindow) {
            toolWindow.style = "display: none;";
        }
    },
    methods: {
        ...mapActions("MapMarker", ["removePolygonMarker", "placingPolygonMarker"]),
        beautifyKey,
        isWebLink,
        translateKeyWithPlausibilityCheck,

        /**
         * Saves the geometry as WKT.
         * @param {string} ring polygon from feature
         * @returns {String} the coordinates as WKT
         */
        getCoordinates (ring) {
            const coordinatesString = ring ? ring.slice(10, ring.length - 2) : "",
                coordinates = coordinatesString.replace(/,/g, " ");

            return coordinates;
        },

        /**
         * checks if given feature has a function getMappedProperties
         * @param {Object} feature the current feature to check
         * @return {Boolean} returns true if given feature has a function getMappedProperties
         */
        mappedPropertiesExists (feature) {
            return typeof feature === "object" && feature !== null && typeof feature.getMappedProperties === "function";
        },


        /**
         * checks if the given feature has one or more mapped properties
         * @param {Object} feature the current feature to check
         * @returns {Boolean} returns true if feature has mapped properties
         */
        hasMappedProperties (feature) {
            return Object.keys(feature.getMappedProperties()).length !== 0;
        },

        /**
         * returns the mapped properties of the given feature or parses the properites through getPropertiesWithFullKeys if the component flag showObjectKeysParam is set
         * @param {Object} feature the current feature
         * @param {Boolean} [showObjectKeysParam=false] the switch to activate getPropertiesWithFullKeys
         * @returns {Object} returns mapped properties
         */
        getMappedPropertiesOfFeature (feature, showObjectKeysParam = false) {
            if (showObjectKeysParam === true) {
                const properties = getPropertiesWithFullKeys(feature.getMappedProperties());

                return properties !== false ? properties : {};
            }
            return feature.getMappedProperties();
        },

        getFile (link) {
            // window.open("blank so far", "_blank", "noreferrer");
            axios.get("https://re2-api-internal.cut.hcu-hamburg.de/" + link[0], {}, {
                auth: {
                    username: "csl",
                    password: "cut2022re2!"
                }
            }).then(function (response) {
                window.open("data:image/jpg," + encodeURI(response.data));
            })
                .catch(function (error) {
                    // Error callback
                    console.error(error);
                });
        }
    }
};

</script>

<template>
    <div>
        <table
            class="table table-hover"
        >
            <tbody v-if="mappedPropertiesExists(feature)">
                <tr v-if="!hasMappedProperties(feature)">
                    <td class="bold">
                        {{ $t("modules.tools.gfi.themes.default.noAttributeAvailable") }}
                    </td>
                </tr>
                <tr
                    v-for="(value, key) in getMappedPropertiesOfFeature(feature, showObjectKeysParam)"
                    v-else
                    :key="key"
                >
                    <td
                        class="bold firstCol"
                    >
                        <span v-if="beautifyKeysParam">
                            {{ beautifyKey(translateKeyWithPlausibilityCheck(key, v => $t(v))) }}
                        </span>
                        <span v-else>
                            {{ key }}
                        </span>
                    </td>
                    <td v-if="key === 'Bilder' && value.length > 0 || key === 'Audio' && value.length > 0">
                        <span
                            v-if="value"
                            class="external_link"
                            @keydown="getFile(value)"
                            @click="getFile(value)"
                        >Link</span>
                    </td>
                    <td
                        v-else-if="Array.isArray(value)"
                        v-html="value.join('<br>')"
                    />
                    <td
                        v-else-if="key === 'DateCreated'"
                    >
                        {{ new Date(value).toLocaleDateString() }}
                    </td>
                    <td
                        v-else-if="typeof value === 'string' && value.includes('<br>')"
                        v-html="value"
                    />
                    <td v-else>
                        {{ value }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
.table-hover {
    .external_link {
        cursor: pointer;
        text-decoration: underline;
        color: blue;
    }
}
</style>
