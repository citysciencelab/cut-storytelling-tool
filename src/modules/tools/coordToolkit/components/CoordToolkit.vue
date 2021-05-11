<script>
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import {Pointer} from "ol/interaction.js";
import {getProjections} from "masterportalAPI/src/crs";
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersCoordToolkit";
import mutations from "../store/mutationsCoordToolkit";
import {mode} from "../store/stateCoordToolkit";
import ToggleCheckbox from "../../../../share-components/ToggleCheckbox.vue";

export default {
    name: "CoordToolkit",
    components: {
        Tool,
        ToggleCheckbox
    },
    computed: {
        ...mapGetters("Tools/CoordToolkit", Object.keys(getters)),
        ...mapGetters("Map", ["projection", "mouseCoord"]),
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
         * Sets the active property of the state to the given value.
         * @param {Boolean} value Value deciding whether the tool gets activated or deactivated.
         * @returns {void}
         */
        active (value) {
            this.removePointMarker();

            if (value) {
                this.addPointerMoveHandlerToMap(this.setCoordinates);
                this.createInteraction();
                this.setPositionMapProjection(this.mouseCoord);
                this.changedPosition();
            }
            else {
                this.removePointerMoveHandlerFromMap(this.setCoordinates);
                this.setUpdatePosition(true);
                this.removeInteraction();
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
            "newProjectionSelected"
        ]),
        ...mapActions("MapMarker", ["removePointMarker"]),
        ...mapActions("Alerting", ["addSingleAlert"]),
        ...mapActions("Map", {
            addPointerMoveHandlerToMap: "addPointerMoveHandler",
            removePointerMoveHandlerFromMap: "removePointerMoveHandler",
            addInteractionToMap: "addInteraction",
            removeInteractionFromMap: "removeInteraction"
        }),
        /**
         * Called if selection of projection changed. Sets the current scprojectionale to state and changes the position.
         * @param {Event} event changed selection event
         * @returns {void}
         */
        selectionChanged (event) {
            this.setCurrentSelection(event.target.value);
            this.newProjectionSelected();
            this.changedPosition(event.target.value);
        },
        /**
         * Stores the projections and adds interaction pointermove to map.
         * @returns {void}
         */
        createInteraction () {
            const pr = getProjections();
            let pointerMove = null;

            this.setProjections(pr);
            this.setMapProjection(this.projection);
            pointerMove = new Pointer(
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
         * Returns the label mame depending on the selected projection.
         * @param {String} key in the language files
         * @returns {String} the name of the label
         */
        label (key) {
            const type = this.currentProjectionName === "EPSG:4326" ? "hdms" : "cartesian";

            return "modules.tools.coordToolkit." + type + "." + key;
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
            if (this.mode === mode.SUPPLY) {
                this.setMode(mode.SEARCH);
                this.$refs.supplyCoordCheckBox.setActive(false);
                this.$refs.searchByCoordCheckBox.setActive(true);
            }
            else {
                this.setMode(mode.SUPPLY);
                this.$refs.searchByCoordCheckBox.setActive(false);
                this.$refs.supplyCoordCheckBox.setActive(true);
            }
        },
        onInputClicked (event) {
            if (this.mode === mode.SUPPLY) {
                this.copyToClipboard(event.currentTarget);
            }
        },
        onInputEvent (coordinatesEasting) {
            if (this.mode === mode.SEARCH) {
                this.validateInput(coordinatesEasting);
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
                    <div class="checkbox-container">
                        <div class="form-inline">
                            <div class="title-checkbox">
                                <label
                                    :class="{ enabled: isEnabled('supply') }"
                                    @click="toggleMode"
                                >{{ $t("modules.tools.coordToolkit.supply") }}</label>
                                <ToggleCheckbox
                                    ref="supplyCoordCheckBox"
                                    :defaultState="true"
                                    :title="$t('common:modules.tools.coordToolkit.supply')"
                                    :textOn="$t('common:snippets.checkbox.on')"
                                    :textOff="$t('common:snippets.checkbox.off')"
                                    @change="toggleMode"
                                />
                            </div>
                        </div>
                        <div class="form-inline">
                            <div class="title-checkbox">
                                <label
                                    :class="{ enabled: isEnabled('search') }"
                                    @click="toggleMode"
                                >{{ $t("modules.tools.coordToolkit.search") }}</label>
                                <ToggleCheckbox
                                    ref="searchByCoordCheckBox"
                                    :defaultState="false"
                                    :title="$t('additional:modules.tools.populationRequest.switchOffFilter')"
                                    :textOn="$t('common:snippets.checkbox.on')"
                                    :textOff="$t('common:snippets.checkbox.off')"
                                    @change="toggleMode"
                                />
                            </div>
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
                                    :value="projection.name"
                                    :SELECTED="projection.name === currentProjectionName"
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
                        >{{ $t(label("eastingLabel")) }}</label>
                        <div class="col-md-7 col-sm-7">
                            <input
                                id="coordinatesEastingField"
                                v-model="coordinatesEasting.value"
                                type="text"
                                class="form-control"
                                :readonly="isEnabled('search') ? true : false"
                                :contenteditable="isEnabled('search') ? true : false"
                                :class="{ inputError: getEastingError, 'form-control': true}"
                                :placeholder="isEnabled('search') ? $t('modules.tools.searchByCoord.exampleAcronym') + coordinatesEastingExample : ''"
                                @click="onInputClicked($event)"
                                @input="onInputEvent(coordinatesEasting)"
                            >
                        </div>
                    </div>
                    <div class="form-group form-group-sm">
                        <label
                            id="coordinatesNorthingLabel"
                            for="coordinatesNorthingField"
                            class="col-md-5 col-sm-5 control-label"
                        >{{ $t(label("northingLabel")) }}</label>
                        <div class="col-md-7 col-sm-7">
                            <input
                                id="coordinatesNorthingField"
                                v-model="coordinatesNorthing.value"
                                type="text"
                                :class="{ inputError: getNorthingError , 'form-control': true}"
                                :readonly="isEnabled('search') ? true : false"
                                :contenteditable="isEnabled('search') ? true : false"
                                :placeholder="isEnabled('search') ? $t('modules.tools.searchByCoord.exampleAcronym') + coordinatesNorthingExample : ''"
                                @click="onInputClicked($event)"
                                @input="onInputEvent(coordinatesEasting)"
                            >
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
    .checkbox-container .form-inline .title-checkbox label {
        font-size: 14px;
    }
    .enabled {
        font-weight: bold;
    }
    .checkbox-container .form-inline {
        padding: 0px 15px;
    }
    .checkbox-container{
        padding-bottom: 25px;
    }
</style>

