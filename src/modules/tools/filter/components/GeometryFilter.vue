<script>
import Draw, {createBox} from "ol/interaction/Draw.js";
import {Vector as VectorSource} from "ol/source";
import {Vector as VectorLayer} from "ol/layer";
import {mapActions, mapMutations} from "vuex";
import * as jsts from "jsts/dist/jsts";
import {
    LineString,
    LinearRing,
    Point,
    Polygon
} from "ol/geom";

export default {
    name: "GeometryFilter",
    data () {
        return {
            isActive: false,
            buffer: 20,
            isBufferInputVisible: false,
            isGeometryVisible: false,
            selectedGeometry: 0
        };
    },
    watch: {
        selectedGeometry () {
            this.removeInteraction(this.draw);
            this.setDrawInteraction();
            this.isBufferInputVisible = false;
        },
        isActive (val) {
            this.draw.setActive(val);
        },
        buffer (val, oldVal) {
            const newValue = isNaN(parseInt(val, 10)) ? 20 : val,
                oldValue = isNaN(parseInt(oldVal, 10)) ? 20 : oldVal,
                jstsGeom = this.ol3Parser.read(this.feature.getGeometry()),
                buffered = jstsGeom.buffer(newValue - oldValue);

            // convert back from JSTS and replace the geometry on the feature
            this.feature.setGeometry(this.ol3Parser.write(buffered));
            this.$emit("updateFilterGeometry", this.feature.getGeometry());
        }
    },
    created () {
        this.ol3Parser = new jsts.io.OL3Parser();
        this.ol3Parser.inject(
            Point,
            LineString,
            LinearRing,
            Polygon
        );

        this.setLayer();
        this.setDrawInteraction();
    },

    beforeDestroy () {
        this.removeInteraction(this.draw);
        this.removeLayerFromMap(this.layer);
    },

    methods: {
        ...mapActions("Maps", ["addInteraction", "removeInteraction", "addLayer"]),
        ...mapMutations("Maps", ["removeLayerFromMap"]),

        /**
         * Translates the given key using i18next.
         * @param {String} translationKey The key to translate.
         * @returns {String} The translation.
         */
        translate (translationKey) {
            return this.$t(translationKey);
        },

        /**
         * Returns the list of all possible geometries with translations.
         * @returns {Object[]} A list of objects containing type an name of geometries.
         */
        getGeometries () {
            return [
                {
                    "type": "Polygon",
                    "name": this.$t("common:modules.tools.filter.geometryFilter.geometries.polygon")
                },
                {
                    "type": "Rectangle",
                    "name": this.$t("common:modules.tools.filter.geometryFilter.geometries.rectangle")
                },
                {
                    "type": "Circle",
                    "name": this.$t("common:modules.tools.filter.geometryFilter.geometries.circle")
                },
                {
                    "type": "LineString",
                    "name": this.$t("common:modules.tools.filter.geometryFilter.geometries.lineString")
                }
            ];
        },

        /**
         * Returns the currently selected geometry bases on the index set at the select box.
         * @returns {Object} The currently selected geometry as object with type and name.
         */
        getSelectedGeometry () {
            const geometries = this.getGeometries();

            return geometries[this.selectedGeometry];
        },

        /**
         * Sets the draw action when the selected geometry changes.
         * @returns {void}
         */
        setDrawInteraction () {
            const selectedGeometry = this.getSelectedGeometry();

            this.draw = new Draw({
                source: this.layer.getSource(),
                type: selectedGeometry.type === "Rectangle" ? "Circle" : selectedGeometry.type,
                geometryFunction: selectedGeometry.type !== "Rectangle" ? undefined : createBox()
            });

            this.draw.setActive(this.isActive);

            this.draw.on("drawend", (evt) => {
                this.feature = evt.feature;
                this.isGeometryVisible = true;

                if (selectedGeometry.type === "LineString") {
                    const jstsGeom = this.ol3Parser.read(this.feature.getGeometry()),
                        buffered = jstsGeom.buffer(this.buffer);

                    this.isBufferInputVisible = true;

                    // convert back from JSTS and replace the geometry on the feature
                    this.feature.setGeometry(this.ol3Parser.write(buffered));
                }
                this.$emit("updateFilterGeometry", this.feature.getGeometry());
            });

            this.draw.on("drawstart", () => {
                this.layer.getSource().clear();
            });

            this.addInteraction(this.draw);
        },

        /**
         * Initializes the layer and registers it at the map.
         * @returns {void}
         */
        setLayer () {
            this.layer = new VectorLayer({
                id: "geometry-filter",
                name: "geometry-filter",
                source: new VectorSource(),
                alwaysOnTop: true
            });

            this.addLayer(this.layer);
        },

        /**
         * Removes the current area from the map.
         * @returns {void}
         */
        removeGeometry () {
            this.isGeometryVisible = false;
            this.layer.getSource().clear();
            this.$emit("updateFilterGeometry", false);
        }
    }
};
</script>

<template lang="html">
    <div>
        <form>
            <div class="mb-3">
                <div class="form-check">
                    <input
                        id="geometryFilterChecked"
                        v-model="isActive"
                        class="form-check-input"
                        type="checkbox"
                        value=""
                    >
                    <label
                        class="form-check-label"
                        for="geometryFilterChecked"
                    >
                        {{ translate("common:modules.tools.filter.geometryFilter.activate") }}
                    </label>
                    <div
                        id="geometryFilterHelp"
                        class="form-text"
                    >
                        {{ translate("common:modules.tools.filter.geometryFilter.help") }}
                    </div>
                </div>
            </div>
            <div
                v-if="isActive"
                class="mb-3"
            >
                <div class="form-floating">
                    <select
                        id="geometrySelect"
                        v-model="selectedGeometry"
                        class="form-select"
                    >
                        <option
                            v-for="(geometry, index) in getGeometries()"
                            :key="index"
                            :value="index"
                        >
                            {{ geometry.name }}
                        </option>
                    </select>
                    <label for="geometrySelect">
                        {{ translate("common:modules.tools.filter.geometryFilter.selectGeometry") }}
                    </label>
                </div>
            </div>
            <div
                v-if="isBufferInputVisible"
                class="mb-3"
            >
                <label
                    for="inputLineBuffer"
                    class="form-label"
                >
                    {{ translate("common:modules.tools.filter.geometryFilter.buffer") }}
                </label>
                <input
                    id="inputLineBuffer"
                    v-model="buffer"
                    class="form-control"
                    type="number"
                >
            </div>
            <div v-if="isGeometryVisible">
                <button
                    id="buttonRemoveGeometry"
                    class="btn btn-primary"
                    @click="removeGeometry"
                >
                    {{ translate("common:modules.tools.filter.geometryFilter.removeGeometry") }}
                </button>
            </div>
        </form>
        <hr>
    </div>
</template>

<style lang="scss" scoped>
    form {
        font-size: 16px;
    }

    hr {
        margin-left: -20px;
        margin-right: -20px;
    }

    .form-check {
        label {
            margin-top: 3px;
        }
    }
</style>
