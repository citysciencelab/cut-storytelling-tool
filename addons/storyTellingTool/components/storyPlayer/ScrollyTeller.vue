<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../../store/gettersStoryTellingTool";
import mutations from "../../store/mutationsStoryTellingTool";
import actions from "../../store/actionsStoryTellingTool";
import scrollama from "scrollama";
import "intersection-observer";


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
            currentIndex: []
        };
    },
    computed: {
        ...mapGetters("Tools/StoryTellingTool", Object.keys(getters))
    },
    mounted () {
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
                // { element, index, direction }
            })
            .onStepExit((response) => {
                this.currentIndex = null;
                console.log("exit");
                // { element, index, direction }
            });
    },
    methods: {
        ...mapMutations("Tools/StoryTellingTool", Object.keys(mutations)),
        ...mapActions("Tools/StoryTellingTool", Object.keys(actions))
    }
};
</script>

<template lang="html">
    <div id="scrollyteller">
        <h1>
            ScrollyTeller
        </h1>
        <div
            v-for="(step, index) in steps"
            class="stepper"
            :class="{ active: index === currentIndex}"
        >
            <h1 v-if="step.title">
                {{ step.title }}
            </h1>
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
        height: 400px;
        margin: 400px 0;
        background-color: transparent !important;
        padding: 10px;
        border-radius: 12px;
    }

    .stepper.active {
        background-color: white !important;
        box-shadow: 0 4px 8px 0 rgb(0 0 0 / 50%);
    }
}
</style>
