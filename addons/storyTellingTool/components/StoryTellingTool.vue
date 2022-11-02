<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import ToolTemplate from "../../../src/modules/tools/ToolTemplate.vue";
import StoryCreator from "./storyCreator/StoryCreator.vue";
import StoryPlayer from "./storyPlayer/StoryPlayer.vue";
import actions from "../store/actionsStoryTellingTool";
import getters from "../store/gettersStoryTellingTool";
import mutations from "../store/mutationsStoryTellingTool";
import fetchDataFromUrl from "../utils/getStoryFromUrl";
import * as constants from "../store/constantsStoryTellingTool";

export default {
    name: "StoryTellingTool",
    components: {
        ToolTemplate,
        StoryCreator,
        StoryPlayer
    },
    data () {
        return {
            constants,
            fetchDataFromUrl,
            mode: null,
            storyConfPath: Config.storyConf
        };
    },
    computed: {
        ...mapGetters("Tools/StoryTellingTool", Object.keys(getters)),

        /**
         * The story telling tool options
         * @returns {Object[]} mode options (icon, title and disabled)
         */
        modeOptions () {
            return Object.values(this.constants.storyTellingModes).map(
                mode => ({
                    mode,
                    icon: this.constants.storyTellingModeIcons[mode],
                    title: this.$t(
                        "additional:modules.tools.storyTellingTool." + mode
                    ),
                    disabled:
                        mode === this.constants.storyTellingModes.PLAY &&
                        !this.storyConfPath
                })
            );
        }
    },
    watch: {
        /**
         * Listens to the active property change.
         * @param {Boolean} isActive Value deciding whether the tool gets activated or deactivated.
         * @returns {void}
         */
        active (isActive) {
            if (isActive) {
                // this.setFocusToFirstControl();
            }
        }
    },
    created () {
        this.$on("close", this.close);
    },
    /**
     * Put initialize here if mounting occurs after config parsing
     * @returns {void}
     */
    mounted () {
        this.applyTranslationKey(this.name);
        this.loadStoryFromFile();
    },
    methods: {
        ...mapMutations("Tools/StoryTellingTool", Object.keys(mutations)),
        ...mapActions("Tools/StoryTellingTool", Object.keys(actions)),

        /**
         * Handles the URL loading of the story from ath
         * @returns {void}
         */
        loadStoryFromFile () {
            if (this.storyConfPath) {
                fetchDataFromUrl(this.storyConfPath).then(loadedStoryConf => {
                    this.setStoryConf(loadedStoryConf);
                });
            }
        },
        /**
         * Handles story telling mode changes.
         * @param {Number} index the index of the new story telling mode
         * @returns {void}
         */
        onChangeStoryTellingMode (index) {
            this.mode = Object.values(this.constants.storyTellingModes)[index];
        },

        /**
         * Resets the tool to its initial state
         * @returns {void}
         */
        reset () {

            /**
             * Constant that saves all the actions on confirm
             * @returns {void}
             */
            const resetStoryTellingTool = () => {
                this.resetCreatorContent();
                this.loadStoryFromFile();
                this.mode = null;
            };

            if (this.isCreatingStory()) {
                const confirmActionSettings = {
                    actionConfirmedCallback: resetStoryTellingTool,
                    confirmCaption: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.closeStoryCreation.confirmButton"
                    ),
                    denyCaption: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.closeStoryCreation.denyButton"
                    ),
                    textContent: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.closeStoryCreation.description"
                    ),
                    headline: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.closeStoryCreation.title"
                    ),
                    forceClickToClose: true
                };

                this.$store.dispatch(
                    "ConfirmAction/addSingleAction",
                    confirmActionSettings
                );
            }
            else {
                resetStoryTellingTool();
            }
        },

        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            const closeStoryTellingTool = () => {
                this.setActive(false);
                this.resetModule();

                const model = Radio.request(
                    "ModelList",
                    "getModelByAttributes",
                    {
                        id: this.$store.state.Tools.StoryTellingTool.id
                    }
                );

                if (model) {
                    model.set("isActive", false);
                }
            };

            if (this.isCreatingStory()) {
                const confirmActionSettings = {
                    actionConfirmedCallback: closeStoryTellingTool,
                    confirmCaption: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.closeStoryCreation.confirmButton"
                    ),
                    denyCaption: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.closeStoryCreation.denyButton"
                    ),
                    textContent: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.closeStoryCreation.description"
                    ),
                    headline: this.$t(
                        "additional:modules.tools.storyTellingTool.confirm.closeStoryCreation.title"
                    ),
                    forceClickToClose: true
                };

                this.$store.dispatch(
                    "ConfirmAction/addSingleAction",
                    confirmActionSettings
                );
            }
            else {
                closeStoryTellingTool();
            }
        },
        /*
         * Checks if there is a story currently being created
         * @returns {boolean}
         */
        isCreatingStory () {
            // Confirm tool closing if user is creating a story
            return this.mode === this.constants.storyTellingModes.CREATE &&
                JSON.stringify(
                    this.$store.state.Tools.StoryTellingTool.storyConf
                ) !== JSON.stringify(this.constants.emptyStoryConf);
        }
    }
};
</script>

<template>
    <ToolTemplate
        :title="$t(name)"
        :icon="glyphicon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
        :initial-width="initialWidth"
        :initial-width-mobile="initialWidthMobile"
    >
        <template #toolBody>
            <v-app
                v-if="active"
                id="tool-storyTellingTool"
                :class="mode"
            >
                <span
                    v-if="mode"
                    id="tool-storyTellingTool-reset"
                >
                    <span
                        @click="reset"
                        @keydown="reset"
                    >
                        <v-tooltip left>
                            <template #activator="{ on, attrs }">
                                <v-icon
                                    v-bind="attrs"
                                    v-on="on"
                                >keyboard_backspace
                                </v-icon>
                            </template>
                            <span>reset</span>
                        </v-tooltip>
                    </span>
                </span>
                <v-item-group
                    v-if="!mode"
                    id="tool-storyTellingTool-modeSelection"
                    :value="mode"
                    @change="onChangeStoryTellingMode"
                >
                    <v-flex
                        v-for="option in modeOptions"
                        :key="option.title"
                    >
                        <v-item v-slot="{ active, toggle }">
                            <v-card
                                :disabled="option.disabled"
                                class="my-4"
                            >
                                <v-img
                                    v-if="option.title === 'Story starten'"
                                    :src="storyConf.coverImagePath"
                                    height="200px"
                                />
                                <v-card-title v-if="option.title === 'Story starten'">
                                    {{ storyConf.title }}
                                </v-card-title>
                                <v-card-subtitle v-if="option.title === 'Story starten'">
                                    {{ storyConf.description }}
                                </v-card-subtitle>
                                <v-card-actions>
                                    <v-btn
                                        v-if="option.title === 'Story starten'"
                                        text
                                        @click="toggle"
                                    >
                                        {{ option.title }}
                                    </v-btn>
                                    <v-col
                                        v-if="option.title === 'Story erstellen'"
                                        class="text-center"
                                    >
                                        <p><i>- Experimentell -</i></p>
                                        <v-btn
                                            outlined
                                            small
                                            color=""
                                            @click="toggle"
                                        >
                                            <v-icon>add</v-icon>
                                            Eigene {{ option.title }}
                                        </v-btn>
                                    </v-col>
                                </v-card-actions>
                            </v-card>
                        </v-item>
                        <v-spacer />
                    </v-flex>
                </v-item-group>

                <StoryCreator
                    v-if="mode === constants.storyTellingModes.CREATE"
                />
                <StoryPlayer
                    v-if="
                        mode === constants.storyTellingModes.PLAY &&
                            storyConfPath
                    "
                    :story-conf-path="storyConfPath"
                />
            </v-app>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>

#tool-storyTellingTool {
    background: none;

    &.play {
        max-height: calc(72vh - 40px);
    }

    &::v-deep {
        .v-application--wrap {
            min-height: 0;

            > div {
                height: 100%;
            }
        }
    }

    #tool-storyTellingTool-reset {
        text-align: right;
        cursor: pointer;
    }
}

#tool-storyTellingTool-modeSelection {
    .v-icon {
        color: currentColor;
    }
}
</style>

<style lang="scss">

//Colors
$main-pink: #f2b1b7;
$main-mint: #73c1a9;
$scnd-mint: rgba(115, 193, 169, 0.2);
$main-blue: #8ea0d2;
$white: #FFFFFF;

@import "../scss/fixes.scss";

.table-tools {
    width: 40px !important;
}

#table-nav-main {
    flex: 0 0 auto;
    max-width: unset;
    padding: 5px;

    background-color: rgba(0, 0, 0, 0);
    background-color: white;
}

#table-tools, #table-category-list{
    background-color: white;
}

#table-tools-menu, #table-nav-cat-panel {
    background-color: white;
}

.icon-burgermenu_alt.collapsed::before {
    color: #73c1a9;
}

.table-nav-layers-panel {
    z-index: 10;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(115, 193, 169, 0.0);
}

#table-nav-layers-panel-toggler {
    background-color: #f5f5f5 !important;
    .icon-cross1:before {
        color: rgba(0, 0, 0, .87) !important;
    }
}

// New style for the Storytelling tool

.win-heading, .table-tool-win-all-vue {
    background-color: $main-blue !important;
}

#tool-window-vue {
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 50%)
}

// Working layout for the legend should be provided by masterportal.css (currently not - recheck)

.legend-window-table[data-v-3b5a1b75] {
    box-shadow: 0 4px 8px 0 rgb(0 0 0 / 50%)
}

.legend-title-table {
    background-color: $main-mint !important;
    padding-bottom: 3px !important;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

#legend .legend-title-table div {
    position: absolute;
    top: 20px;
    right: 10px;
}

.d-lg-inline-block {
    @media (min-width: 992px) {
        display: none !important;
    }
}

.legend-window-table .legend-content,
.panel, .panel-default,
.legend-window-table .legend-content .card {
    background-color: $white !important;
}

#legend .legend-content .layer-title {
    background-color: $scnd-mint !important;
}

#legend .legend-content .layer {
    margin: 0 !important;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

#legend .legend-content {
    overflow: unset !important;
    margin-top: 0 !important;
}

.panel-heading, .layer-title {
    border-radius: 4px !important;
    background-color: fade($main-mint, 20%) !important;
    border-bottom: 0px !important;
}

.win-body-vue {
    background-color: $white !important;
}

</style>
