<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../../store/gettersStoryTellingTool";
import mutations from "../../store/mutationsStoryTellingTool";
import actions from "../../store/actionsStoryTellingTool";
import scrollama from "scrollama";
import "intersection-observer";
import axios from "axios";


export default {
    name: "ScrollyTeller",
    model: {
        prop: "currentStepIndex",
        event: "change"
    },
    data () {
        return {
            currentIndex: 0,
            loadedContent: null,
            steps: null
        };
    },
    computed: {
        ...mapGetters("Tools/StoryTellingTool", Object.keys(getters))
    },
    created () {
        this.steps = this.storyConf.steps;
        this.steps.forEach((step) => {
            this.loadStoryContents(step.htmlFile).then(data => {
                this.$set(step, "loadedContent", data);
            }).catch(err => {
                console.error(err);
            });
        });
    },
    mounted () {
        const toolWindow = document.getElementsByClassName("table-tool-win-all-vue")[0],
            heading = toolWindow.getElementsByClassName("win-heading")[0],
            scrollyButton = toolWindow.getElementsByClassName("scrolly-button")[0],
            storyTellingToolReset = document.getElementById("tool-storyTellingTool-reset"),
            toolBody = document.getElementById("vue-tool-content-body"),
            scroller = scrollama();

        toolWindow.style.setProperty("background-color", "transparent", "important");
        toolWindow.style.boxShadow = "none";
        toolWindow.style.height = "100%";
        heading.style = "display: none;";
        toolBody.style = "height: 100%; background-color: transparent !important; -ms-overflow-style: none; overflow: overlay; max-height: 100%; padding: 0;";
        if (scrollyButton) {
            scrollyButton.style = "display: none;";
        }
        if (storyTellingToolReset) {
            storyTellingToolReset.style = "display: none;";
        }

        // Setup the instance, pass callback functions
        scroller
            .setup({
                step: ".stepper"
            })
            .onStepEnter((response) => {
                this.currentIndex = response.index;
                this.$emit("change", response.index);
            })
            .onStepExit(() => {
                this.currentIndex = null;
            });

        document.getElementsByClassName("stepper")[0].scrollIntoView({block: "center"});
    },
    methods: {
        ...mapMutations("Tools/StoryTellingTool", Object.keys(mutations)),
        ...mapActions("Tools/StoryTellingTool", Object.keys(actions)),

        /**
         * Updates the step html content
         * @param {Object} htmlFile name of the html file to load
         * @returns {void}
         */
        async loadStoryContents (htmlFile) {
            if (this.storyConf.htmlFolder && htmlFile) {
                const response = await axios.get("./assets/" + this.storyConf.htmlFolder + "/" + htmlFile),
                    data = await response.data;

                return data;
            }
            return null;

        }
    }
};
</script>

<template lang="html">
    <div
        id="scrollyteller"
    >
        <div
            v-for="(step, index) in steps"
            :key="step.title"
            class="stepper"
            :class="{ active: index === currentIndex}"
        >
            <h1 v-if="step.title">
                {{ step.title }}
            </h1>

            <div
                class="tool-storyTellingTool-content"
            >
                <div
                    v-if="index === currentIndex"
                    v-html="step.loadedContent"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    #vue-tool-content-body::-webkit-scrollbar {
        width: 0 !important;
        background: transparent; /* make scrollbar transparent */
    }
</style>

<style lang="scss" scoped>

@import "../../../../css/mixins.scss";

#scrollyteller {

    width: var(--initialToolWidth);
    @media (max-width: 767px) {
        width: var(--initialToolWidthMobile);
    }

    .stepper {
        min-height: 450px;
        margin: 400px 0;
        background-color: transparent !important;
        padding: 20px;
        border-radius: 12px;

        .tool-storyTellingTool-content {
            overflow: auto;

            &::v-deep {
                img {
                    max-width: 100%;
                }
            }
        }
    }

    .stepper.active {
        background-color: white !important;
        box-shadow: 0 4px 8px 0 rgb(0 0 0 / 50%);
    }
}
</style>
