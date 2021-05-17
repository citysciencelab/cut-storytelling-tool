<script>
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import {Pointer} from "ol/interaction.js";
import {getProjections} from "masterportalAPI/src/crs";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersCoordToolkit";
import mutations from "../store/mutationsCoordToolkit";
import {mode} from "../store/stateCoordToolkit";

export default {
    name: "CoordToolkit",
    components: {
        Tool
    },
    computed: {
        ...mapGetters("Tools/CoordToolkit", Object.keys(getters)),
        ...mapGetters("Map", ["projection", "mouseCoord"]),
        eastingNoCoordMessage: function () {
            if (this.currentProjection.proj !== "longlat") {
                return this.$t("common:modules.tools.searchByCoord.errorMsg.noCoord", {valueKey: this.$t(this.getLabel("eastingLabel"))});
            }
            return this.$t("common:modules.tools.searchByCoord.errorMsg.hdmsNoCoord", {valueKey: this.$t(this.getLabel("eastingLabel"))});
        },
        northingNoCoordMessage: function () {
            if (this.currentProjection.proj !== "longlat") {
                return this.$t("common:modules.tools.searchByCoord.errorMsg.noCoord", {valueKey: this.$t(this.getLabel("northingLabel"))});
            }
            return this.$t("common:modules.tools.searchByCoord.errorMsg.hdmsNoCoord", {valueKey: this.$t(this.getLabel("northingLabel"))});
        },
        northingNoMatchMessage: function () {
            if (this.currentProjection.proj !== "longlat") {
                return this.$t("common:modules.tools.searchByCoord.errorMsg.noMatch", {valueKey: this.$t(this.getLabel("northingLabel"))});
            }
            return this.$t("common:modules.tools.searchByCoord.errorMsg.hdmsNoMatch", {valueKey: this.$t(this.getLabel("northingLabel"))});
        },
        eastingNoMatchMessage: function () {
            if (this.currentProjection.proj !== "longlat") {
                return this.$t("common:modules.tools.searchByCoord.errorMsg.noMatch", {valueKey: this.$t(this.getLabel("eastingLabel"))});
            }
            return this.$t("common:modules.tools.searchByCoord.errorMsg.hdmsNoMatch", {valueKey: this.$t(this.getLabel("eastingLabel"))});
        },
        /**
         * Must be a two-way computed property, because it is used as v-model for select-Element, see https://vuex.vuejs.org/guide/forms.html.
         */
        currentSelection: {
            get () {
                return this.$store.state.Tools.CoordToolkit.currentSelection;
            },
            set (newValue) {
                this.setCurrentSelection(newValue);
            }
        }
    },
    watch: {
        /**
         * If true, mode is set to "supply", projections are initialized.
         * If false, error messages and values are resetted.
         * @param {Boolean} value Value deciding whether the tool gets activated or deactivated.
         * @returns {void}
         */
        active (value) {
            this.removeMarker();

            if (value) {
                this.setMode(mode.SUPPLY);
                this.initProjections();
                this.setExample();
                if (this.mode === mode.SUPPLY) {
                    this.setSupplyCoordActive();
                }
            }
            else {
                this.resetErrorMessages();
                this.resetValues();
                this.setSupplyCoordInactive();
            }
        }
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapMutations("Tools/CoordToolkit", Object.keys(mutations)),
        ...mapActions("Tools/CoordToolkit", [
            "checkPosition",
            "changedPosition",
            "copyToClipboard",
            "positionClicked",
            "setCoordinates",
            "removeMarker",
            "searchCoordinate",
            "validateInput",
            "newProjectionSelected"
        ]),
        ...mapActions("Alerting", ["addSingleAlert"]),
        ...mapActions("Map", {
            addPointerMoveHandlerToMap: "addPointerMoveHandler",
            removePointerMoveHandlerFromMap: "removePointerMoveHandler",
            addInteractionToMap: "addInteraction",
            removeInteractionFromMap: "removeInteraction"
        }),
        /**
         * Initializes the projections to select. If projection EPSG:4326 is available same is added in decimal-degree.
         * @returns {void}
         */
        initProjections () {
            const pr = getProjections(),
                wgs84Proj = pr.filter(proj => proj.name === "EPSG:4326");

            // id is set to the name and in case of decimal "-DG" is appended to name later on
            // for use in select-box
            pr.forEach(proj => {
                proj.id = proj.name;
            });

            if (wgs84Proj && wgs84Proj.length === 1) {
                this.addWGS84Decimal(pr, wgs84Proj);
            }
            this.setProjections(pr);
        },
        /**
         * Adds EPSG:4326 in decimal-degree to list of projections.
         * @param {Array} projections list of all available projections
         * @param {Object} wgs84Proj the WGS84 projection contained in list of projections
         * @returns {void}
         */
        addWGS84Decimal (projections, wgs84Proj) {
            const index = projections.findIndex(proj => proj.name === "EPSG:4326"),
                wgs84ProjDez = {};

            for (const key in wgs84Proj[0]) {
                wgs84ProjDez[key] = wgs84Proj[0][key];
            }

            wgs84ProjDez.name = "EPSG:4326";
            wgs84ProjDez.id = "EPSG:4326-DG";
            wgs84ProjDez.title = "WGS 84(Dezimalgrad)";
            projections.splice(index + 1, 0, wgs84ProjDez);
        },
        /**
         * Removes pointer-move-handler and interaction from map.
         * @returns {void}
         */
        setSupplyCoordInactive () {
            this.removePointerMoveHandlerFromMap(this.setCoordinates);
            this.setUpdatePosition(true);
            this.removeInteraction();
        },
        /**
         * Adds pointer-move-handler and interaction to map.
         * @returns {void}
         */
        setSupplyCoordActive () {
            this.addPointerMoveHandlerToMap(this.setCoordinates);
            this.setMapProjection(this.projection);
            this.createInteraction();
            this.setPositionMapProjection(this.mouseCoord);
            this.changedPosition();
        },
        /**
         * Called if selection of projection changed. Sets the current scprojectionale to state and changes the position.
         * @param {Event} event changed selection event
         * @returns {void}
         */
        selectionChanged (event) {
            this.onInputEvent(this.coordinatesEasting);
            this.onInputEvent(this.coordinatesNorthing);
            this.setCurrentSelection(event.target.value);
            this.newProjectionSelected();
            this.changedPosition(event.target.value);
            this.setExample();
        },
        /**
         * Stores the projections and adds interaction pointermove to map.
         * @returns {void}
         */
        createInteraction () {
            const pointerMove = new Pointer(
                {
                    handleMoveEvent: function (evt) {
                        this.checkPosition(evt.coordinate);
                    }.bind(this),
                    handleDownEvent: function (evt) {
                        this.positionClicked(evt);
                    }.bind(this)
                },
                this
            );

            this.setSelectPointerMove(pointerMove);
            this.addInteractionToMap(pointerMove);
        },
        /**
         * Removes the interaction from map.
         * @returns {void}
         */
        removeInteraction () {
            this.removeInteractionFromMap(this.selectPointerMove);
            this.setSelectPointerMove(null);
        },
        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);

            // TODO replace trigger when Menu is migrated
            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getComponent(this.$store.state.Tools.CoordToolkit.id);

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * Returns true, if given checkboxId is equals curent mode in state.
         * @param {String} checkboxId "supply" or "search"
         * @returns {Boolean} true, if given checkboxId is equals curent mode in state
         */
        isEnabled (checkboxId) {
            return this.mode === checkboxId;
        },
        /**
         * Toggles the mode "supply" or "search".
         * @returns {void}
         */
        toggleMode () {
            this.removeMarker();
            if (this.mode === mode.SUPPLY) {
                this.setMode(mode.SEARCH);
                this.setSupplyCoordInactive();

            }
            else {
                this.setMode(mode.SUPPLY);
                this.resetErrorMessages();
                this.setSupplyCoordActive();
            }
        },
        /**
         * If curent mode is "supply" content of input is copied to clipboard.
         * @param {Event} event click-event
         * @returns {void}
         */
        onInputClicked (event) {
            if (this.mode === mode.SUPPLY) {
                this.copyToClipboard(event.currentTarget);
            }
        },
        /**
         * If curent mode is "search" input is validated.
         * @param {Object} coordinatesValue value of input
         * @returns {void}
         */
        onInputEvent (coordinatesValue) {
            if (this.mode === mode.SEARCH) {
                this.validateInput(coordinatesValue);
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
            <div
                v-if="active"
                id="coord-toolkit"
            >
                <form
                    class="form-horizontal"
                    role="form"
                >
                    <div class="radio-container form-group form-group-sm">
                        <div class="form-check">
                            <input
                                id="supplyCoordRadio"
                                type="radio"
                                name="mode"
                                checked="true"
                                @change="toggleMode"
                            />
                            <label
                                for="supplyCoordRadio"
                                :class="{ 'control-label': true, 'enabled': isEnabled('supply') }"
                                @click="toggleMode"
                            >{{ $t("modules.tools.coordToolkit.supply") }}</label>
                        </div>
                        <div class="form-check">
                            <input
                                id="searchByCoordRadio"
                                type="radio"
                                name="mode"
                                @change="toggleMode"
                            />
                            <label
                                for="searchByCoordRadio"
                                :class="{'control-label': true, 'enabled': isEnabled('search') }"
                                @click="toggleMode"
                            >{{ $t("modules.tools.coordToolkit.search") }}</label>
                        </div>
                    </div>
                    <div class="form-group form-group-sm">
                        <label
                            for="coordSystemField"
                            class="col-md-5 col-sm-5 control-label"
                        >{{ $t("modules.tools.coordToolkit.coordSystemField") }}</label>
                        <div class="col-md-7 col-sm-7">
                            <select
                                id="coordSystemField"
                                v-model="currentSelection"
                                class="font-arial form-control input-sm pull-left"
                                @change="selectionChanged($event)"
                            >
                                <option
                                    v-for="(projection, i) in projections"
                                    :key="i"
                                    :value="projection.id"
                                    :SELECTED="projection.id === currentSelection"
                                >
                                    {{ projection.title ? projection.title + " ("+projection.name+")" : projection.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group form-group-sm">
                        <label
                            id="coordinatesEastingLabel"
                            for="coordinatesEastingField"
                            class="col-md-5 col-sm-5 control-label"
                        >{{ $t(getLabel("eastingLabel")) }}</label>
                        <div class="col-md-7 col-sm-7">
                            <input
                                id="coordinatesEastingField"
                                v-model="coordinatesEasting.value"
                                type="text"
                                :readonly="isEnabled( mode.SEARCH)"
                                :contenteditable="isEnabled( mode.SEARCH)"
                                :class="{ inputError: getEastingError, 'form-control': true}"
                                :placeholder="isEnabled( mode.SEARCH) ? $t('modules.tools.searchByCoord.exampleAcronym') + coordinatesEastingExample : ''"
                                @click="onInputClicked($event)"
                                @input="onInputEvent(coordinatesEasting)"
                            ><p
                                v-if="eastingNoCoord"
                                class="error-text"
                            >
                                {{ eastingNoCoordMessage }}
                            </p>
                            <p
                                v-if="eastingNoMatch"
                                class="error-text"
                            >
                                {{ eastingNoMatchMessage + coordinatesEastingExample }}
                            </p>
                        </div>
                    </div>
                    <div class="form-group form-group-sm">
                        <label
                            id="coordinatesNorthingLabel"
                            for="coordinatesNorthingField"
                            class="col-md-5 col-sm-5 control-label"
                        >{{ $t(getLabel("northingLabel")) }}</label>
                        <div class="col-md-7 col-sm-7">
                            <input
                                id="coordinatesNorthingField"
                                v-model="coordinatesNorthing.value"
                                type="text"
                                :class="{ inputError: getNorthingError , 'form-control': true}"
                                :readonly="isEnabled( mode.SEARCH)"
                                :contenteditable="isEnabled( mode.SEARCH)"
                                :placeholder="isEnabled( mode.SEARCH) ? $t('modules.tools.searchByCoord.exampleAcronym') + coordinatesNorthingExample : ''"
                                @click="onInputClicked($event)"
                                @input="onInputEvent(coordinatesNorthing)"
                            ><p
                                v-if="northingNoCoord"
                                class="error-text"
                            >
                                {{ northingNoCoordMessage }}
                            </p>
                            <p
                                v-if="northingNoMatch"
                                class="error-text"
                            >
                                {{ northingNoMatchMessage + coordinatesNorthingExample }}
                            </p>
                        </div>
                    </div>
                    <div
                        v-if="isEnabled('search')"
                        class="form-group form-group-sm"
                    >
                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <button
                                class="btn btn-block"
                                :disabled="getEastingError || getNorthingError || !coordinatesEasting.value || !coordinatesNorthing.value"
                                type="button"
                                @click="searchCoordinate(coordinatesEasting, coordinatesNorthing)"
                            >
                                {{ $t("common:modules.tools.coordToolkit.searchBtn") }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </template>
    </Tool>
</template>

<style lang="less" scoped>
    @media (max-width: 767px) {
        .checkbox-container .form-inline {
            font-size: 12px;
        }
    }
    .radio-container{
        padding-bottom: 25px;
        display: flex;
        justify-content: space-around;
        label{
            margin-left: 5px;
        }
        input{
            margin-left: 10px;
        }
    }
    .enabled {
        font-weight: bold;
    }
    .error-text {
        font-size: 85%;
        color: #a94442;
    }
</style>

