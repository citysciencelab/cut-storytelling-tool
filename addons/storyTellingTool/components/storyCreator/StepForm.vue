<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import {VueEditor} from "vue2-editor";
import actions from "../../store/actionsStoryTellingTool";
import getters from "../../store/gettersStoryTellingTool";
import mutations from "../../store/mutationsStoryTellingTool";
import * as constants from "../../store/constantsStoryTellingTool";
import getDataUrlFromFile from "../../utils/getDataUrlFromFile";
import getFileExtension from "../../utils/getFileExtension";
import {
    getStepReference,
    getHTMLContentReference
} from "../../utils/getReference";

export default {
    name: "StepForm",
    components: {
        VueEditor
    },
    props: {
        // Whether to edit a step or creating a new one
        isEditing: {
            type: Boolean,
            default: false
        },
        // The initial values for a step to edit
        initialStep: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            constants,
            getDataUrlFromFile,
            getFileExtension,
            getStepReference,
            getHTMLContentReference,
            minStepWidth: 280,
            maxStepWidth: 1000,
            step: this.initialStep || {
                stepNumber: 1,
                stepWidth: this.$store.state.Tools.StoryTellingTool
                    .initialWidth,
                visible: true,
                associatedChapter: null,
                title: "",
                htmlFile: null,
                centerCoordinate: null,
                zoomLevel: null,
                layers: [],
                interactionAddons: [],
                is3D: false,
                navigation3D: {
                    cameraPosition: [
                        null,
                        null,
                        null
                    ],
                    heading: null,
                    pitch: null
                }
            },
            newChapter: {
                chapterNumber:
                    this.$store.state.Tools.StoryTellingTool.storyConf.chapters
                        .length + 1,
                chapterTitle: ""
            },
            htmlContent:
                (this.initialStep &&
                    this.$store.state.Tools.StoryTellingTool.htmlContents[
                        getHTMLContentReference(
                            this.initialStep.associatedChapter,
                            this.initialStep.stepNumber
                        )
                    ]) ||
                null,
            htmlContentImages:
                (this.initialStep &&
                    this.$store.state.Tools.StoryTellingTool.htmlContentsImages[
                        getHTMLContentReference(
                            this.initialStep.associatedChapter,
                            this.initialStep.stepNumber
                        )
                    ]) ||
                [],
            is3DLayerActive: false,
            layerTypes3DSpecific: ["Entities3D", "TileSet3D", "Terrain3D"],
            mapMovedPosition: {
                cameraPosition: [
                    null,
                    null,
                    null
                ],
                heading: null,
                pitch: null
            }
        };
    },
    computed: {
        ...mapGetters("Tools/StoryTellingTool", Object.keys(getters)),

        /**
         * All chapter numbers
         * @returns {Object[]} all chapter numbers
         */
        allChapterNumbers () {
            const chapters = this.storyConf.chapters || [];

            return chapters.map(({chapterNumber}) => chapterNumber);
        },

        /**
         * All step numbers of the selected chapter
         * @returns {Object[]} all step numbers
         */
        allStepNumbers () {
            const steps = this.storyConf.steps || [];

            return steps
                .filter(
                    ({associatedChapter}) => associatedChapter === this.step.associatedChapter
                )
                .map(({stepNumber}) => stepNumber);
        },

        /**
         * The chapter options
         * @returns {Object[]} chapter options (value and text)
         */
        chapterOptions () {
            const chapters = this.storyConf.chapters || [],
                chapterOptions = chapters.map(chapter => ({
                    value: chapter.chapterNumber,
                    text: chapter.chapterNumber + " – " + chapter.chapterTitle
                })),
                newChapterOption = {
                    value: null,
                    text: this.$t(
                        "additional:modules.tools.storyTellingTool.newChapter"
                    )
                };

            return [...chapterOptions, newChapterOption];
        },

        /**
         * The layer options
         * @returns {Object[]} layers including id and name
         */
        layerOptions () {
            const layerList = Radio.request(
                "ModelList",
                "getModelsByAttributes",
                {isVisibleInTree: true}
            );

            return layerList.map(layer => ({
                value: layer.id,
                text: layer.attributes.name
            }));
        },

        /**
         * The addon options
         * @returns {Object[]} available addons to activate
         */
        addonOptions () {
            const configuredAddons = this.$store.state.Tools.configuredTools;

            return configuredAddons
                .filter(addon => addon.key !== this.id)
                .map(addon => ({
                    value: addon.key,
                    text:
                        addon.component.name ||
                        addon.key
                }));
        }
    },
    watch: {
        /**
         * Applies the step width to the tool window
         * @param {Number} newStepWidth the new step width
         * @returns {void}
         */
        "step.stepWidth" (newStepWidth) {
            this.setInitialWidth(newStepWidth);
        },

        /**
         * Toggles map layers according to the selection for the step
         * @param {Array} newSelectedLayerIds the selected layers
         * @returns {void}
         */
        "step.layers" (newSelectedLayerIds) {
            const selectedLayerIds = newSelectedLayerIds.map(Number),
                layerList = Radio.request(
                    "ModelList",
                    "getModelsByAttributes",
                    {isVisibleInTree: true}
                );

            for (const layer of layerList) {
                if (
                    selectedLayerIds.includes(Number(layer.attributes.id)) &&
                    !layer.attributes.isVisibleInMap
                ) {
                    layer.setIsVisibleInMap(true);
                    layer.set("isSelected", true);
                }
                else if (
                    !selectedLayerIds.includes(Number(layer.attributes.id)) &&
                    layer.attributes.isVisibleInMap
                ) {
                    layer.setIsVisibleInMap(false);
                    layer.set("isSelected", false);
                }
            }

            this.is3DLayerActive = Radio.request(
                "ModelList",
                "getModelsByAttributes",
                {isVisibleInMap: true}
            ).filter(layer => {
                return this.layerTypes3DSpecific.includes(layer.attributes.typ);
            }).length > 0;

            Radio.trigger("TableMenu", "rerenderLayers");
        },

        /**
         * Toggles the addons according to the selection for the step
         * @param {Array} newSelectedAddonIds the new selected addons
         * @param {Array} oldSelectedAddonIds the previous selected addons
         * @returns {void}
         */
        "step.interactionAddons" (newSelectedAddonIds, oldSelectedAddonIds) {
            const configuredAddons = this.$store.state.Tools.configuredTools,

                // Hide unselected addons again
                unselectedAddons = oldSelectedAddonIds.filter(
                    addon => !newSelectedAddonIds.includes(addon)
                );

            unselectedAddons.forEach(addonId => {
                const addon = configuredAddons.find(
                    ({key}) => key === addonId
                );

                if (addon) {
                    const toolKey = addon.key.charAt(0).toUpperCase() + addon.key.slice(1);

                    this.$store.commit(
                        `Tools/${toolKey}/setActive`,
                        false
                    );
                }
            });

            // Show selected addons
            newSelectedAddonIds.forEach(addonId => {
                const addon = configuredAddons.find(
                    ({key}) => key === addonId
                );

                if (addon) {
                    const toolKey = addon.key.charAt(0).toUpperCase() + addon.key.slice(1);

                    this.$store.commit(
                        `Tools/${toolKey}/setActive`,
                        true
                    );
                }
            });
        }
    },
    methods: {
        ...mapMutations("Tools/StoryTellingTool", Object.keys(mutations)),
        ...mapActions("Tools/StoryTellingTool", Object.keys(actions)),
        // These application wide getters and setters can be found in 'src/modules/map/store'
        ...mapGetters("Maps", ["center", "zoom", "getMap3d"]),

        /**
         * Handles new chapter number changes
         * Validates the chapter number input
         * @param {Event} event event fired by changing the input for newChapter.chapterNumber
         * @returns {void}
         */
        onChangeChapterNumber (event) {
            this.newChapter.chapterNumber = Number(event.target.value);

            // Validates the new chapter number
            if (
                this.allChapterNumbers.includes(this.newChapter.chapterNumber)
            ) {
                event.target.setCustomValidity(
                    this.$t(
                        "additional:modules.tools.storyTellingTool.error.chapterNumberAlreadyExists"
                    )
                );
            }
            else {
                event.target.setCustomValidity("");
            }
        },

        /**
         * Handles step number changes
         * Validates the step number input
         * @param {Event} event event fired by changing the input for stepNumber
         * @returns {void}
         */
        onChangeStepNumber (event) {
            this.step.stepNumber = Number(event.target.value);

            // Validates the step number
            if (
                this.allStepNumbers.includes(this.step.stepNumber) &&
                (!this.initialStep ||
                    this.step.stepNumber !== this.initialStep.stepNumber)
            ) {
                event.target.setCustomValidity(
                    this.$t(
                        "additional:modules.tools.storyTellingTool.error.stepNumberAlreadyExists"
                    )
                );
            }
            else {
                event.target.setCustomValidity("");
            }
        },

        /**
         * Handles step width changes
         * @param {Event} event event fired by changing the input for stepWidth
         * @returns {void}
         */
        onChangeStepWidth (event) {
            this.step.stepWidth = Math.max(
                this.minStepWidth,
                Math.min(this.maxStepWidth, Number(event.target.value))
            );
        },

        /**
         * Handles adding an image to the HTML content images
         * @param {File} imageFile the image file to add
         * @param {Object} Editor the HTML editor instance
         * @param {number} cursorLocation the current cursor location in the HTML editor
         * @param {Function} resetUploader function to reset the uploader
         * @returns {void}
         */
        async onAddImage (imageFile, Editor, cursorLocation, resetUploader) {
            try {
                const dataUrl = await getDataUrlFromFile(imageFile),
                    fileExtension = getFileExtension(imageFile);

                this.htmlContentImages.push({dataUrl, fileExtension});

                // Add image to HTML content
                Editor.insertEmbed(cursorLocation, "image", dataUrl);
                resetUploader();
            }
            catch (error) {
                console.error(error);
                Radio.trigger("Alert", "alert", {
                    text: i18next.t(
                        "additional:modules.tools.storyTellingTool.error.errorAddingImage"
                    ),
                    category: "Error",
                    kategorie: "alert-danger"
                });
            }
        },

        /**
         * Handles removing and image from the HTML content
         * @param {String} imageDataUrl the image data url to remove
         * @returns {void}
         */
        onRemoveImage (imageDataUrl) {
            this.htmlContentImages = this.htmlContentImages.filter(
                image => image.dataUrl !== imageDataUrl
            );
        },

        /**
         * Shows confirmation dialog
         * Deletes the step from the story if confirmed
         * @returns {void}
         */
        onDeleteStep () {
            /**
             * Constant that saves all the actions on confirm
             * @returns {void}
             */
            const deleteStep = () => {
                    const {associatedChapter, stepNumber} =
                    this.initialStep || this.step;

                    this.deleteStoryStep({associatedChapter, stepNumber});
                    this.$emit("return");
                },

                confirmActionSettings = {
                    actionConfirmedCallback: deleteStep,
                    confirmCaption: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.deleteStep.confirmButton"
                    ),
                    denyCaption: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.deleteStep.denyButton"
                    ),
                    textContent: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.deleteStep.description"
                    ),
                    headline: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.deleteStep.title"
                    ),
                    forceClickToClose: true
                };

            this.$store.dispatch(
                "ConfirmAction/addSingleAction",
                confirmActionSettings
            );
        },

        /**
         * Adds the created step to the story
         * or saves the step changes when in editing mode
         * @returns {void}
         */
        async onSubmit () {
            if (this.step.associatedChapter === null) {
                // Add a new chapter to the story
                this.addStoryChapter(this.newChapter);
                this.step.associatedChapter = this.newChapter.chapterNumber;
            }

            if (this.htmlContent) {
                // Add HTML content including images to temporary state
                // Update step's htmlFile reference
                const previousHtmlReference =
                    this.initialStep &&
                    this.getHTMLContentReference(
                        this.initialStep.associatedChapter,
                        this.initialStep.stepNumber
                    );

                this.step.htmlFile = await this.saveHtmlContent({
                    chapterNumber: this.step.associatedChapter,
                    stepNumber: this.step.stepNumber,
                    htmlContent: this.htmlContent,
                    htmlContentImages: this.htmlContentImages,
                    ...previousHtmlReference && {previousHtmlReference}
                });
            }

            // Save the step in the story
            const previousStepReference =
                this.initialStep &&
                this.getStepReference(
                    this.initialStep.associatedChapter,
                    this.initialStep.stepNumber
                );

            this.saveStoryStep({
                step: this.step,
                ...previousStepReference && {previousStepReference}
            });

            // Trigger submit action to return to story overview
            this.$emit("return");
        },

        /**
         * Transform a lon lat position to radians
         * @param {Object} cartesian3Pos a position defined by longitude, latitude, and height.
         * @returns {number} value in the resulting object will be in radians
         */
        toDegrees (cartesian3Pos) {
            const pos = Cesium.Cartographic.fromCartesian(cartesian3Pos);

            return [pos.longitude / Math.PI * 180, pos.latitude / Math.PI * 180, pos.height];
        },

        /**
         * 3D map center (should be implement in 3DMapRadioBridge)
         * @returns {Object} returns object in the format of the story attribute 'navigation3D'
         */
        get3DMapCenter () {
            const camera = Radio.request("Map", "getMap3d").getCesiumScene().camera;

            return {
                "cameraPosition": this.toDegrees(camera.position),
                "heading": camera.heading,
                "pitch": camera.pitch
            };
        },

        /**
         * Toggles 3D map mode via checkbox
         * @param {boolean} checkboxValue the flag indicating if 3D map should be activated
         * @returns {void}
         */
        async activate3DMap (checkboxValue) {
            this.step.is3D = checkboxValue;
            if (this.step.is3D && !Radio.request("Map", "isMap3d")) {
                await this.$store.dispatch("Maps/activateMap3D");

                Radio.request("Map", "getMap3d").getCesiumScene().camera.moveEnd.addEventListener(this.mapMovedHandler);
            }
            else if (!this.step.is3D && Radio.request("Map", "isMap3d")) {
                await this.$store.dispatch("Maps/deactivateMap3D");
            }
        },

        /**
         * Set new position of the camera after it stopped moving
         * @returns {void}
         */
        mapMovedHandler () {
            this.mapMovedPosition = this.get3DMapCenter();
        },

        /**
         * Complex check for the form warning of new camera position
         * @returns {void}
         */
        isCameraPositionDifferent () {
            return this.step.navigation3D.cameraPosition[0] && this.mapMovedPosition.cameraPosition[0]
            && (this.step.navigation3D.cameraPosition[0] !== this.mapMovedPosition.cameraPosition[0]
            || this.step.navigation3D.cameraPosition[0] !== this.mapMovedPosition.cameraPosition[0]
            || this.step.navigation3D.cameraPosition[0] !== this.mapMovedPosition.cameraPosition[0]);
        }
    }
};
</script>

<template lang="html">
    <div id="tool-storyTellingTool-creator-stepForm">
        <h4>
            {{
                $t("additional:modules.tools.storyTellingTool.createStoryStep")
            }}
        </h4>

        <form @submit.prevent="onSubmit">
            <div class="form-group">
                <label
                    class="form-label"
                    for="step-associate"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.chapter"
                        )
                    }}
                </label>

                <v-select
                    id="step-associate"
                    v-model="step.associatedChapter"
                    :items="chapterOptions"
                    required
                    dense
                    solo
                    hide-details
                />
            </div>

            <div
                v-if="step.associatedChapter === null"
                class="form-group"
            >
                <label
                    class="form-label"
                    for="step-number"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.newChapterNumber"
                        )
                    }}
                </label>

                <input
                    id="step-number"
                    class="form-control"
                    type="number"
                    :value="newChapter.chapterNumber"
                    min="1"
                    required
                    @change="onChangeChapterNumber"
                >
                <p
                    v-if="allChapterNumbers.includes(newChapter.chapterNumber)"
                    class="text-danger"
                >
                    <small>
                        {{
                            $t(
                                "additional:modules.tools.storyTellingTool.error.chapterNumberAlreadyExists"
                            )
                        }}
                    </small>
                </p>
            </div>

            <div
                v-if="step.associatedChapter === null"
                class="form-group"
            >
                <label
                    class="form-label"
                    for="step-chapter-title"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.newChapterTitle"
                        )
                    }}
                </label>

                <input
                    id="step-chapter-title"
                    v-model="newChapter.chapterTitle"
                    class="form-control"
                    required
                >
            </div>

            <div class="form-group">
                <label
                    class="form-label"
                    for="step-number"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.stepNumber"
                        )
                    }}
                </label>

                <input
                    id="step-number"
                    class="form-control"
                    type="number"
                    :value="step.stepNumber"
                    min="1"
                    required
                    @change="onChangeStepNumber"
                >
                <p
                    v-if="
                        allStepNumbers.includes(step.stepNumber) &&
                            (!initialStep ||
                                step.stepNumber !== initialStep.stepNumber)
                    "
                    class="text-danger"
                >
                    <small>
                        {{
                            $t(
                                "additional:modules.tools.storyTellingTool.error.stepNumberAlreadyExists"
                            )
                        }}
                    </small>
                </p>
            </div>

            <div class="form-group">
                <label
                    class="form-label"
                    for="step-title"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.stepTitle"
                        )
                    }}
                </label>

                <input
                    id="step-title"
                    v-model="step.title"
                    class="form-control"
                    required
                >
            </div>

            <div class="form-group">
                <label
                    class="form-label"
                    for="step-width"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.stepWidth"
                        )
                    }}
                </label>

                <input
                    id="step-width"
                    class="form-control"
                    type="number"
                    :value="step.stepWidth"
                    :min="minStepWidth"
                    :max="maxStepWidth"
                    step="10"
                    @change="onChangeStepWidth"
                >
            </div>

            <div class="form-group">
                <label
                    class="form-label"
                    for="step-visible"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.visible"
                        )
                    }}
                </label>

                <input
                    id="step-visible"
                    class="checkbox"
                    type="checkbox"
                    :checked="step.visible"
                    @change="step.visible = $event.target.checked"
                >
            </div>

            <div
                v-if="is3DLayerActive"
                class="form-group"
            >
                <label
                    class="form-label"
                    for="step-is3d"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.is3D"
                        )
                    }}
                </label>
                <input
                    id="step-is3d"
                    class="checkbox"
                    type="checkbox"
                    :checked="step.is3D"
                    @change="activate3DMap($event.target.checked)"
                >
            </div>

            <div
                v-if="step.is3D"
                class="form-group"
            >
                <label
                    class="form-label"
                    for="step-3d-center"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.centerCoordinate3D"
                        )
                    }}
                </label>
                <div
                    class="stepForm-inputs-centerCoordinate"
                    style="grid-template-columns: 1fr 1fr 1fr 1fr;"
                >
                    <input
                        id="step-3d-center"
                        class="form-control"
                        :value="
                            step.navigation3D.cameraPosition[0]
                        "
                        readonly
                    >
                    <input
                        class="form-control"
                        :value="
                            step.navigation3D.cameraPosition[1]
                        "
                        readonly
                    >
                    <input
                        class="form-control"
                        :value="
                            step.navigation3D.cameraPosition[2]
                        "
                        readonly
                    >

                    <div class="input-group">
                        <button
                            type="button"
                            class="btn"
                            @click="step.navigation3D.cameraPosition = get3DMapCenter()['cameraPosition']"
                        >
                            <v-icon>add_circle</v-icon>
                        </button>
                        <button
                            type="button"
                            class="btn"
                            @click="step.navigation3D.cameraPosition = null"
                        >
                            <v-icon>backspace</v-icon>
                        </button>
                    </div>
                </div>
                <p
                    v-if="isCameraPositionDifferent()"
                    class="text-warning"
                >
                    <small>
                        {{
                            $t(
                                "additional:modules.tools.storyTellingTool.warning.mapMoved"
                            )
                        }}
                    </small>
                </p>
            </div>
            <div
                v-if="step.is3D"
                class="form-group"
            >
                <label
                    class="form-label"
                    for="step-3d-heading"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.heading"
                        )
                    }}
                </label>

                <div
                    class="stepForm-inputs-centerCoordinate"
                    style="grid-template-columns: 1fr 1fr;"
                >
                    <input
                        id="step-3d-heading"
                        class="form-control"
                        :value="
                            step.navigation3D.heading
                        "
                        readonly
                    >
                    <div class="input-group">
                        <button
                            type="button"
                            class="btn"
                            @click="step.navigation3D.heading = get3DMapCenter()['heading']"
                        >
                            <v-icon>add_circle</v-icon>
                        </button>
                        <button
                            type="button"
                            class="btn"
                            @click="step.navigation3D.heading = null"
                        >
                            <v-icon>backspace</v-icon>
                        </button>
                    </div>
                </div>
                <p
                    v-if="
                        mapMovedPosition.heading && step.navigation3D.heading &&
                            step.navigation3D.heading !== mapMovedPosition.heading "
                    class="text-warning"
                >
                    <small>
                        {{
                            $t(
                                "additional:modules.tools.storyTellingTool.warning.mapMoved"
                            )
                        }}
                    </small>
                </p>
            </div>
            <div
                v-if="step.is3D"
                class="form-group"
            >
                <label
                    class="form-label"
                    for="step-3d-pitch"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.pitch"
                        )
                    }}
                </label>
                <div
                    class="stepForm-inputs-centerCoordinate"
                    style="grid-template-columns: 1fr 1fr;"
                >
                    <input
                        id="step-3d-pitch"
                        class="form-control"
                        :value="
                            step.navigation3D.pitch
                        "
                        readonly
                    >

                    <div class="input-group">
                        <button
                            type="button"
                            class="btn"
                            @click="step.navigation3D.pitch = get3DMapCenter()['pitch']"
                        >
                            <v-icon>add_circle</v-icon>
                        </button>
                        <button
                            type="button"
                            class="btn"
                            @click="step.navigation3D.pitch = null"
                        >
                            <v-icon>backspace</v-icon>
                        </button>
                    </div>
                </div>
                <p
                    v-if="
                        mapMovedPosition.pitch && step.navigation3D.pitch &&
                            step.navigation3D.pitch !== mapMovedPosition.pitch"
                    class="text-warning"
                >
                    <small>
                        {{
                            $t(
                                "additional:modules.tools.storyTellingTool.warning.mapMoved"
                            )
                        }}
                    </small>
                </p>
            </div>

            <div
                v-if="!step.is3D"
                class="form-group"
            >
                <label
                    class="form-label"
                    for="step-center"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.centerCoordinate"
                        )
                    }}
                </label>

                <div class="stepForm-inputs-centerCoordinate">
                    <input
                        id="step-center"
                        class="form-control"
                        :value="
                            step.centerCoordinate && step.centerCoordinate[0]
                        "
                        readonly
                    >
                    <input
                        class="form-control"
                        :value="
                            step.centerCoordinate && step.centerCoordinate[1]
                        "
                        readonly
                    >

                    <div class="input-group">
                        <button
                            type="button"
                            class="btn"
                            @click="step.centerCoordinate = center()"
                        >
                            <v-icon>add_circle</v-icon>
                        </button>
                        <button
                            type="button"
                            class="btn"
                            @click="step.centerCoordinate = null"
                        >
                            <v-icon>backspace</v-icon>
                        </button>
                    </div>
                </div>
                <p
                    v-if="
                        step.centerCoordinate &&
                            step.centerCoordinate !== center()
                    "
                    class="text-warning"
                >
                    <small>
                        {{
                            $t(
                                "additional:modules.tools.storyTellingTool.warning.mapMoved"
                            )
                        }}
                    </small>
                </p>
            </div>

            <div
                v-if="!step.is3D"
                class="form-group"
            >
                <label
                    class="form-label"
                    for="step-zoom"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.zoomLevel"
                        )
                    }}
                </label>

                <div class="stepForm-inputs-zoomLevel">
                    <input
                        id="step-zoom"
                        class="form-control"
                        :value="step.zoomLevel"
                        readonly
                    >

                    <div class="input-group">
                        <button
                            type="button"
                            class="btn"
                            @click="step.zoomLevel = zoom()"
                        >
                            <v-icon>add_circle</v-icon>
                        </button>
                        <button
                            type="button"
                            class="btn"
                            @click="step.zoomLevel = null"
                        >
                            <v-icon>backspace</v-icon>
                        </button>
                    </div>
                </div>
                <p
                    v-if="
                        step.zoomLevel !== null &&
                            step.zoomLevel !== zoom()
                    "
                    class="text-warning"
                >
                    <small>
                        {{
                            $t(
                                "additional:modules.tools.storyTellingTool.warning.mapZoomed"
                            )
                        }}
                    </small>
                </p>
            </div>

            <div class="form-group">
                <label
                    class="form-label"
                    for="step-layer"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.layers"
                        )
                    }}
                </label>

                <v-select
                    id="step-layer"
                    v-model="step.layers"
                    :items="layerOptions"
                    multiple
                    dense
                    solo
                    hide-details
                />
            </div>

            <div class="form-group">
                <label
                    class="form-label"
                    for="step-addons"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.interactionAddons"
                        )
                    }}
                </label>

                <v-select
                    id="step-addons"
                    v-model="step.interactionAddons"
                    :items="addonOptions"
                    multiple
                    dense
                    solo
                    hide-details
                />
            </div>

            <div class="form-group">
                <label
                    class="form-label"
                    for="step-vue-editor"
                >
                    {{
                        $t(
                            "additional:modules.tools.storyTellingTool.label.htmlContent"
                        )
                    }}
                </label>

                <div class="stepForm-inputs-htmlEditor">
                    <VueEditor
                        id="step-vue-editor"
                        v-model="htmlContent"
                        :editor-toolbar="constants.htmlEditorToolbar"
                        use-custom-image-handler
                        @image-added="onAddImage"
                        @image-removed="onRemoveImage"
                    />
                </div>
            </div>

            <button
                type="button"
                class="btn btn-lgv-grey"
                @click="$emit('return')"
            >
                {{
                    $t(
                        "additional:modules.tools.storyTellingTool.button.cancel"
                    )
                }}
            </button>
            <button
                v-if="isEditing"
                type="button"
                class="btn btn-lgv-grey"
                @click="onDeleteStep"
            >
                {{
                    $t(
                        "additional:modules.tools.storyTellingTool.button.deleteStep"
                    )
                }}
            </button>
            <button
                type="submit"
                class="btn btn-lgv-grey"
            >
                {{
                    $t(
                        isEditing
                            ? "additional:modules.tools.storyTellingTool.button.submitEditStep"
                            : "additional:modules.tools.storyTellingTool.button.submitAddStep"
                    )
                }}
            </button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
#tool-storyTellingTool-creator-stepForm {
    max-width: 460px;

    &::v-deep {
        .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
        > .v-input__control
        > .v-input__slot {
            margin: 0;
            padding: 0 0 0 0.3125rem;
        }

        .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
        > .v-input__control
        > .v-input__slot {
            height: 34px;
            height: 34px;
            font-size: 14px;
            border: 1px solid #ccc;
            border-radius: 0;
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
        }

        .v-text-field.v-text-field--solo.v-input--is-focused:not(.v-text-field--solo-flat)
        > .v-input__control
        > .v-input__slot {
            border-color: #66afe9;
            outline: 0;
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08),
            0 0 8px rgba(102, 175, 233, 0.6);
        }
    }

    .stepForm-inputs-centerCoordinate {
        display: grid;
        grid-template-columns: 1fr 1fr 100px;
        grid-gap: 5px;
        align-items: end;
    }

    .stepForm-inputs-zoomLevel {
        display: grid;
        grid-template-columns: 1fr 100px;
        grid-gap: 5px;
        align-items: end;
    }

    .stepForm-inputs-htmlEditor {
        background: "#fff";
    }
}
</style>
