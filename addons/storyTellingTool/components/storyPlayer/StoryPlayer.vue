<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import StoryNavigation from "./StoryNavigation.vue";
import ScrollyTeller from "./ScrollyTeller.vue";
import actions from "../../store/actionsStoryTellingTool";
import getters from "../../store/gettersStoryTellingTool";
import mutations from "../../store/mutationsStoryTellingTool";
import fetchDataFromUrl from "../../utils/getStoryFromUrl";
import {
    getStepReference,
    getHTMLContentReference
} from "../../utils/getReference";
import store from "../../../../src/app-store";

export default {
    name: "StoryPlayer",
    components: {
        ScrollyTeller,
        StoryNavigation
    },
    props: {
        // The path to the story configuration to load
        storyConfPath: {
            type: String,
            default: null
        },
        // Whether the story player is in preview mode or not
        isPreview: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            getStepReference,
            fetchDataFromUrl,
            getHTMLContentReference,
            currentStepIndex: 0,
            loadedContent: null,
            isHovering: null,
            isChangeFrom3D: false,
            showMode: "classic",
            isScrolly: false
        };
    },
    computed: {
        ...mapGetters("Tools/StoryTellingTool", Object.keys(getters)),

        /**
         * The current selected step of the story.
         * @returns {number} current step index
         */
        currentStep () {
            return this.currentStepIndex !== null
                ? this.storyConf && this.storyConf.steps[this.currentStepIndex]
                : null;
        },

        /**
         * The current selected chapter of the story.
         * @returns {number} current chapter
         */
        currentChapter () {
            return (
                this.storyConf &&
                this.storyConf.chapters.find(
                    ({chapterNumber}) => this.currentStep &&
                        this.currentStep.associatedChapter === chapterNumber
                )
            );
        }
    },
    watch: {
        /**
         * Handles step changes.
         * @returns {void}
         */
        currentStepIndex () {
            this.loadStep();
        }
    },
    mounted () {
        if (this.storyConf) {
            this.loadStep();
        }
        else if (!this.storyConf && this.storyConfPath) {
            fetchDataFromUrl(this.storyConfPath).then(loadedStoryConf => {
                this.setStoryConf(loadedStoryConf);
                this.loadStep();
            });
        }

        if (this.isPreview && this.storyConf) {
            this.loadStep();
        }

        if (Object.prototype.hasOwnProperty.call(this.storyConf, "isScrollytelling") && this.storyConf.isScrollytelling) {
            this.showMode = "scrolly";
        }

    },
    beforeDestroy () {
        // Hides all story layers
        const layerList = Radio.request("ModelList", "getModelsByAttributes", {
            isVisibleInTree: true
        });

        for (const layer of layerList) {
            const isStepLayer = (
                (this.currentStep && this.currentStep.layers) ||
                []
            ).includes(Number(layer.attributes.id));

            if (isStepLayer && layer.attributes.isVisibleInMap) {
                this.disableLayer(layer);
            }
        }
        Radio.trigger("TableMenu", "rerenderLayers");
    },
    methods: {
        ...mapActions("Tools", ["setToolActive"]),
        ...mapMutations("Tools/StoryTellingTool", Object.keys(mutations)),
        ...mapActions("Tools/StoryTellingTool", Object.keys(actions)),
        // These application wide getters and setters can be found in 'src/modules/map/store'
        ...mapMutations("Map", ["setCenter", "setLayerVisibility"]),
        ...mapGetters("Map", ["layerList", "visibleLayerList", "map"]),

        /**
         * Activates a tool
         * @param {Object} toolId the id of the tool to activate
         * @returns {void}
         */
        activateTool (toolId) {
            const configuredTools = this.$store.state.Tools.configuredTools,
                tool = configuredTools.find(({key}) => key === toolId);

            if (tool) {
                const toolKey = tool.key.charAt(0).toUpperCase() + tool.key.slice(1);

                this.$store.commit(
                    `Tools/${toolKey}/setActive`,
                    true
                );
            }
        },

        /**
         * Toggles a layer on the map
         * @param {Object} layer the layer to enable
         * @param {Boolean} enabled enables the layer if `true`, disables the layer if `false`
         * @returns {void}
         */
        toggleLayer (layer, enabled) {
            layer.setIsVisibleInMap(enabled);
            layer.set("isSelected", enabled);
        },

        /**
         * Enables a layer on the map
         * @param {Object} layer the layer to enable
         * @returns {void}
         */
        enableLayer (layer) {
            this.toggleLayer(layer, true);
        },

        /**
         * Disables a layer on the map
         * @param {Object} layer the layer to disable
         * @returns {void}
         */
        disableLayer (layer) {
            this.toggleLayer(layer, false);
        },

        /**
         * Changing from click to scroll story mode
         * @returns  {void}
         */
        changeMode () {
            this.showMode = this.showMode === "classic" ? "scrolly" : "classic";
        },

        /**
         * Set the step index on click of a chapter
         * @param {Object} chapter the current chapter object of the iteration
         * @returns  {void}
         */
        onClickChapter (chapter) {
            this.currentStepIndex = this.storyConf.steps.findIndex(
                ({associatedChapter}) => associatedChapter === chapter.chapterNumber
            );
        },

        /**
         * Set the hover flag via stepreference
         * @param {Object} step the current step object of the iteration
         * @returns  {void}
         */
        onHoverStep (step) {
            this.isHovering = getStepReference(
                step.associatedChapter,
                step.stepNumber
            );
        },

        /**
         * Sets up the tool window and content for the selected step.
         * @returns {void}
         */
        async loadStep () {
            if (!this.currentStep) {
                return;
            }

            // Updates the tool width
            if (this.currentStep.stepWidth) {
                this.setInitialWidth(this.currentStep.stepWidth);
            }

            // Toggles 3D map mode
            if (this.currentStep.is3D && !Radio.request("Map", "isMap3d")) {
                await store.dispatch("Maps/activateMap3D");
            }
            else if (!this.currentStep.is3D && Radio.request("Map", "isMap3d")) {
                this.isChangeFrom3D = true;
                await store.dispatch("Maps/deactivateMap3D");
            }

            // Updates the map center
            if (this.currentStep.centerCoordinate && this.currentStep.centerCoordinate.length > 0) {
                if (this.currentStep.is3D) {
                    console.warn("Dont use centerCoordinate for 3D navigation.");
                }
                else {
                    const map = Radio.request("Map", "getMap"),
                        mapView = typeof map?.getView === "function" ? map.getView() : undefined;

                    setTimeout(() => {
                        mapView.animate({
                            center: this.currentStep.centerCoordinate,
                            duration: 2000,
                            zoom: this.currentStep.zoomLevel
                        });
                        this.isChangeFrom3D = false;
                    }, this.isChangeFrom3D ? 1500 : 0);
                }
            }
            // Updates the map center for 3D
            if (this.currentStep.navigation3D && Object.prototype.hasOwnProperty.call(this.currentStep.navigation3D, "cameraPosition")) {
                const position = this.currentStep.navigation3D.cameraPosition,
                    map3d = Radio.request("Map", "getMap3d"),
                    camera = map3d.getCesiumScene().camera,
                    destination = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);

                camera.flyTo({
                    destination: destination,
                    orientation: {
                        heading: this.currentStep.navigation3D.heading,
                        pitch: this.currentStep.navigation3D.pitch
                    },
                    easingFunction: Cesium.EasingFunction.QUADRATIC_OUT
                });
            }

            const layerList = Radio.request(
                    "ModelList",
                    "getModelsByAttributes",
                    {isVisibleInTree: true}
                ),
                htmlReference = getHTMLContentReference(
                    this.currentStep.associatedChapter,
                    this.currentStep.stepNumber
                );

            // Updates the map layers
            for (const layer of layerList) {
                const isStepLayer = (this.currentStep.layers || []).includes(
                    layer.id
                );

                // if (isStepLayer && !layer.attributes.isVisibleInMap) {
                if (isStepLayer) {
                    this.enableLayer(layer);
                }
                // else if (!isStepLayer && layer.attributes.isVisibleInMap) {
                else if (!isStepLayer) {
                    this.disableLayer(layer);
                }
            }

            Radio.trigger("TableMenu", "rerenderLayers");

            // Updates the step html content
            if (this.storyConf.htmlFolder && this.currentStep.htmlFile) {
                // Load HTML file for the story step
                fetchDataFromUrl(
                    "./assets/" +
                    this.storyConf.htmlFolder +
                    "/" +
                    this.currentStep.htmlFile
                ).then(data => {
                    this.loadedContent = data;
                });
            }
            else if (this.isPreview && this.htmlContents[htmlReference]) {
                // Get temporary HTML for the story step preview
                this.loadedContent = this.htmlContents[htmlReference];
            }
            else {
                this.loadedContent = null;
            }

            setTimeout(() => {
                Radio.trigger("Menu", "rerender");
            }, 500);

            if (!this.currentStep.is3D) {
                // Activates or deactivates tools
                const interactionAddons = this.currentStep.interactionAddons || [];

                // configuredTools = this.$store.state.Tools.configuredTools;

                // Activate all tools of the current step
                interactionAddons.forEach(this.activateTool);
            }
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="storyConf !== undefined && storyConf.steps && currentStep"
        id="tool-storyTellingTool-player"
    >
        <span
            v-if="isScrolly"
            class="scrolly-button"
            @click="changeMode"
            @keydown="changeMode"
        >
            <v-icon>style</v-icon>
        </span>

        <ScrollyTeller
            v-if="showMode === 'scrolly'"
        />
        <div
            v-if="showMode === 'classic'"
            id="tool-storyTellingTool-currentStep"
        >
            <h2 v-if="currentChapter">
                {{ currentChapter.chapterTitle }}
            </h2>
            <h1>{{ currentStep.title }}</h1>

            <div
                v-if="currentStep"
                class="tool-storyTellingTool-content"
            >
                <div
                    v-if="loadedContent"
                    v-html="loadedContent"
                />
            </div>
        </div>

        <StoryNavigation
            v-if="showMode === 'classic'"
            v-model="currentStepIndex"
            :current-chapter="currentStep && currentStep.associatedChapter"
            :steps="storyConf.steps"
        />
    </div>

    <div
        v-else
        id="tool-storyTellingTool-tableOfContents"
    >
        <h1>{{ storyConf.title }}</h1>

        <h2>
            {{
                $t("additional:modules.tools.storyTellingTool.tableOfContents")
            }}
        </h2>

        <ol class="tableOfContents">
            <li
                v-for="chapter in storyConf.chapters"
                :key="chapter.chapterNumber"
            >
                <span
                    :class="{
                        'primary--text': isHovering === chapter.chapterNumber
                    }"
                    @mouseover="isHovering = chapter.chapterNumber"
                    @focus="isHovering = chapter.chapterNumber"
                    @mouseout="isHovering = null"
                    @blur="isHovering = null"
                    @click="onClickChapter(chapter)"
                    @keydown="onClickChapter(chapter)"
                >
                    {{ chapter.chapterNumber }}
                    {{ chapter.chapterTitle }}
                </span>
                <ol>
                    <li
                        v-for="(step, stepIndex) in storyConf.steps"
                        :key="step.stepNumber + step.title"
                        :class="{
                            'primary--text':
                                isHovering ===
                                getStepReference(
                                    step.associatedChapter,
                                    step.stepNumber
                                )
                        }"
                        @mouseover.stop="onHoverStep(step)"
                        @focus="onHoverStep(step)"
                        @mouseout.stop="isHovering = null"
                        @blur="isHovering = null"
                        @click.stop="currentStepIndex = stepIndex"
                        @keydown="currentStepIndex = stepIndex"
                    >
                        <span v-if="step.associatedChapter === chapter.chapterNumber">
                            {{
                                getStepReference(
                                    step.associatedChapter,
                                    step.stepNumber
                                )
                            }}
                            {{ step.title }}
                        </span>
                    </li>
                </ol>
            </li>
        </ol>
    </div>
</template>

<style lang="scss" scoped>
#tool-storyTellingTool-player {
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 100%;
    grid-gap: 20px;
    min-height: 0;
    height: 100%;
}

#tool-storyTellingTool-currentStep,
#tool-storyTellingTool-tableOfContents {
    display: grid;
    grid-gap: 10px;
    overflow: hidden;
}

.tool-storyTellingTool-content {
    overflow: auto;

    &::v-deep {
        img {
            max-width: 100%;
        }
    }
}

.tableOfContents {
    padding-left: 0;
    overflow: auto;
    font-size: 1rem;
    line-height: 1.75;

    &,
    ol {
        list-style: none;
    }

    > li {
        &:not(last-child) {
            margin-bottom: 10px;
        }

        > ol li,
        > span {
            display: block;
            cursor: pointer;
        }
    }
}

.scrolly-button {
    position: absolute;
    top: 0;
    right: 35px;
}
</style>
