<script>
import Draw, {createBox} from "ol/interaction/Draw.js";
import {createRegularPolygon} from "ol/interaction/Draw";
import {Fill, Stroke, Style} from "ol/style";
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
    props: {
        circleSides: {
            type: Number,
            required: false,
            default: 256
        },
        defaultBuffer: {
            type: Number,
            required: false,
            default: 20
        },
        fillColor: {
            type: String,
            required: false,
            default: "rgba(0, 0, 0, 0.33)"
        },
        geometries: {
            type: Array,
            required: false,
            default: () => ["Polygon", "Rectangle", "Circle", "LineString"]
        },
        invertGeometry: {
            type: Boolean,
            required: false,
            default: true
        },
        strokeColor: {
            type: String,
            required: false,
            default: "rgba(0, 0, 0, 1)"
        },
        strokeWidth: {
            type: Number,
            required: false,
            default: 1
        }
    },
    data () {
        return {
            isActive: false,
            buffer: 0,
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
            this.$emit("setGfiActive", !val);
        },
        buffer (val) {
            if (!this.feature) {
                return;
            }
            const newValue = isNaN(parseInt(val, 10)) ? this.defaultBuffer : val,
                jstsGeom = this.ol3Parser.read(this.initFeatureGeometry),
                buffered = jstsGeom.buffer(newValue);

            if (newValue <= 0) {
                return;
            }
            this.setGeometryAtFeature(this.feature, this.ol3Parser.write(buffered), this.invertGeometry);

            clearInterval(this.intvBuffer);
            this.intvBuffer = setInterval(() => {
                clearInterval(this.intvBuffer);
                this.emitGeometryOfLineBuffer(this.feature.getGeometry().getCoordinates());
            }, 800);
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

        this.buffer = this.defaultBuffer;
        this.initFeatureGeometry = null;

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
            const result = [],
                possibleGeometries = {
                    "Polygon": this.$t("common:modules.tools.filter.geometryFilter.geometries.polygon"),
                    "Rectangle": this.$t("common:modules.tools.filter.geometryFilter.geometries.rectangle"),
                    "Circle": this.$t("common:modules.tools.filter.geometryFilter.geometries.circle"),
                    "LineString": this.$t("common:modules.tools.filter.geometryFilter.geometries.lineString")
                };

            this.geometries.forEach(type => {
                if (Object.prototype.hasOwnProperty.call(possibleGeometries, type)) {
                    result.push({
                        type,
                        name: possibleGeometries[type]
                    });
                }
            });

            return result;
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
                geometryFunction: this.getGeometryFunction(selectedGeometry.type, this.circleSides)
            });
            this.draw.setActive(this.isActive);
            this.draw.on("drawend", (evt) => {
                const geometry = this.getGeometryOnDrawEnd(evt.feature, selectedGeometry.type, this.buffer);

                this.feature = evt.feature;
                this.initFeatureGeometry = evt.feature.getGeometry();
                this.isGeometryVisible = true;
                this.isBufferInputVisible = selectedGeometry.type === "LineString";
                this.setGeometryAtFeature(this.feature, geometry, this.invertGeometry);
                this.$emit("updateFilterGeometry", geometry);
            });

            this.draw.on("drawstart", () => {
                this.isGeometryVisible = false;
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
                style: new Style({
                    fill: new Fill({
                        color: this.fillColor
                    }),
                    stroke: new Stroke({
                        color: this.strokeColor,
                        width: this.strokeWidth
                    })
                }),
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
            this.isBufferInputVisible = false;
            this.layer.getSource().clear();
            this.$emit("updateFilterGeometry", false);
        },

        /**
         * Emits updateFilterGeometry with a new polygon, using the given coordinates.
         * @param {ol/coordinate[]} coordinates The coordinates of the polygon.
         * @returns {void}
         */
        emitGeometryOfLineBuffer (coordinates) {
            if (!Array.isArray(coordinates)) {
                this.$emit("updateFilterGeometry", false);
                return;
            }
            const geomCoordinate = coordinates.length === 2 ? coordinates[1] : coordinates[0];

            this.$emit("updateFilterGeometry", new Polygon([geomCoordinate]));
        },

        /**
         * Returns the geometryFunction for the given geometry type.
         * @param {String} selectedGeometryType The geometry type.
         * @param {Number} circleSides The number of points to use in case of a circle to polygon transformation.
         * @returns {Function} The function to use or undefined.
         */
        getGeometryFunction (selectedGeometryType, circleSides) {
            if (selectedGeometryType === "Rectangle") {
                return createBox();
            }
            else if (selectedGeometryType === "Circle") {
                return createRegularPolygon(circleSides < 3 ? 3 : circleSides);
            }
            return undefined;
        },

        /**
         * Sets the given geometry at the feature of the instance.
         * @param {ol/Feature} feature The feature to set the geometry at.
         * @param {ol/geom/Geometry} geometry The geometry to set.
         * @param {Boolean} invertGeometry If the geometry should be inverted.
         * @returns {void}
         */
        setGeometryAtFeature (feature, geometry, invertGeometry) {
            if (invertGeometry) {
                feature.setGeometry(new Polygon([
                    [
                        [-1877994.66, 3932281.56],
                        [-1877994.66, 9494203.2],
                        [804418.76, 9494203.2],
                        [804418.76, 3932281.56],
                        [-1877994.66, 3932281.56]
                    ],
                    geometry.getCoordinates()[0]
                ]));
            }
            else {
                feature.setGeometry(geometry);
            }
        },

        /**
         * Returns the geometry of the given feature.
         * @param {ol/Feature} feature The feature to get the geometry from.
         * @param {String} selectedGeometryType The geometry type.
         * @param {Number} buffer The buffer to use for buffered line.
         * @returns {ol/geom/Geometry} The geometry of the feature.
         */
        getGeometryOnDrawEnd (feature, selectedGeometryType, buffer) {
            if (selectedGeometryType === "LineString") {
                const jstsGeom = this.ol3Parser.read(feature.getGeometry()),
                    buffered = jstsGeom.buffer(buffer);

                // convert back from JSTS and replace the geometry on the feature
                return this.ol3Parser.write(buffered);
            }
            return feature.getGeometry();
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
                v-if="isActive && isBufferInputVisible"
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
                    min="1"
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
