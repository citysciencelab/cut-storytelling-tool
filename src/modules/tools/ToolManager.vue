<script>
import {mapGetters, mapMutations, mapActions} from "vuex";

export default {
    name: "ToolManager",
    props: {
        showInSidebar: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    computed: {
        ...mapGetters(["menuConfig"]),
        ...mapGetters("Tools", ["configuredTools"]),
        toolsInSidebar: function () {
            const toolsInSidebar = {};

            this.configuredTools.forEach(tool => {
                if (typeof this.$store.state.Tools[tool.component.name] !== "undefined") {
                    toolsInSidebar[tool.component.name] = this.$store.state.Tools[tool.component.name].renderToWindow === false;
                }
                else if (typeof this.$store.state[tool.component.name] !== "undefined") {
                    toolsInSidebar[tool.component.name] = this.$store.state[tool.key].renderToWindow === false;
                }
                else {
                    toolsInSidebar[tool.component.name] = false;
                }
            });

            return toolsInSidebar;
        }
    },
    created () {
        this.setConfiguredTools(this.menuConfig);
        this.pushAttributes();
    },
    mounted () {
        this.setToolActiveByConfig();

        this.configuredTools.forEach(configuredTool => {
            const toolName = configuredTool?.component?.name;

            this.addToolNameAndGlyphiconToModelList(toolName);
        });
    },
    methods: {
        ...mapActions("Tools", [
            "pushAttributesToStoreElements",
            "setToolActiveByConfig",
            "addToolNameAndGlyphiconToModelList"
        ]),
        ...mapMutations("Tools", [
            "setConfiguredTools"
        ]),

        /**
         * Push the configured attributes to store from all configured tools.
         * The configurations are done in the created hook,
         * because the ToolManager is instantiated 2 x and otherwise changes in the mounted hook are overwritten again at the tools.
         * @returns {void}
         */
        pushAttributes: function () {
            this.configuredTools.forEach(configuredTool => this.pushAttributesToStoreElements(configuredTool));
        }
    }
};
</script>

<template lang="html">
    <div class="tool-manager">
        <template v-for="tool in configuredTools">
            <component
                :is="tool.component"
                v-if="toolsInSidebar[tool.component.name] === showInSidebar"
                :key="'tool-' + tool.key"
            />
        </template>
    </div>
</template>
