<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../../store/gettersStoryTellingTool";
import mutations from "../../store/mutationsStoryTellingTool";
import actions from "../../store/actionsStoryTellingTool";
import scrollama from "scrollama";
import "intersection-observer";
import fetchDataFromUrl from "../../utils/getStoryFromUrl";


export default {
    name: "ScrollyTeller",
    model: {
        prop: "currentStepIndex",
        event: "change"
    },
    props: {
        // All steps of the current story
        steps: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            currentIndex: [],
            loadedContent: null
        };
    },
    computed: {
        ...mapGetters("Tools/StoryTellingTool", Object.keys(getters))
    },
    mounted () {
        this.loadStoryContents(0);

        const toolWindow = document.getElementsByClassName("table-tool-win-all-vue")[0];

        toolWindow.style = "background-color: transparent !important; box-shadow: none; height: 100%;";

        const heading = toolWindow.getElementsByClassName("win-heading")[0];

        heading.style = "display: none;";

        const toolBody = document.getElementById("vue-tool-content-body");

        toolBody.style = "height: 100%; background-color: transparent !important; -ms-overflow-style: none; overflow: overlay; max-height: 100%;";

        // instantiate the scrollama
        const scroller = scrollama();

        // setup the instance, pass callback functions
        scroller
            .setup({
                step: ".stepper"
            })
            .onStepEnter((response) => {
                console.log("{element, index, direction}");
                this.currentIndex = response.index;
                this.$emit("change", response.index);
                // Check if the next step in line does have the loaded content already
                if (!Object.prototype.hasOwnProperty.call(this.steps[this.currentIndex + 1], "loadedContent")) {
                    this.loadStoryContents(this.currentIndex + 1);
                }
                // { element, index, direction }
            })
            .onStepExit((response) => {
                this.currentIndex = null;
                console.log("exit");
                // Wenn down den content laden ... also exit und down nächstes laden
                // { element, index, direction }
            });
    },
    methods: {
        ...mapMutations("Tools/StoryTellingTool", Object.keys(mutations)),
        ...mapActions("Tools/StoryTellingTool", Object.keys(actions)),
        /**
         * Updates the step html content
         * @param {Object} index pointer to the content to load
         * @returns {void}
         */
        loadStoryContents (index) {
            const stepToLoad = this.steps[index];

            if (this.storyConf.htmlFolder && stepToLoad.htmlFile) {
                // Load HTML file for the story step
                fetchDataFromUrl(
                    "./assets/" +
                    this.storyConf.htmlFolder +
                    "/" +
                    stepToLoad.htmlFile
                ).then(data => stepToLoad.loadedContent = data);
            }
            else {
                stepToLoad.loadedContent = null;
            }
        }
    }
};
</script>

<template lang="html">
    <div id="scrollyteller">
        <div
            v-for="(step, index) in steps"
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
#scrollyteller {
    .stepper {
        //width: 700px;
        height: 650px;
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
