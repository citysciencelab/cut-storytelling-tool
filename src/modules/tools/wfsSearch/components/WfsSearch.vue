<script>
import Literal from "./Literal.vue";
import Tool from "../../Tool.vue";
import getComponent from "../../../../utils/getComponent";
import {mapActions, mapGetters, mapMutations} from "vuex";
import actions from "../store/actionsWfsSearch";
import getters from "../store/gettersWfsSearch";
import mutations from "../store/mutationsWfsSearch";

export default {
    name: "WfsSearch",
    components: {
        Literal,
        Tool
    },
    data () {
        return {
            storePath: this.$store.state.Tools.WfsSearch // TODO: Needed?
        };
    },
    computed: {
        ...mapGetters("Tools/WfsSearch", Object.keys(getters))
    },
    watch: {
        active () {
            if (this.selectSource) {
                this.retrieveData();
            }
        }
    },
    created () {
        // TODO: For each entry in 'instances', a WfsSearch Tool should be created
        this.$on("close", this.close);

        /*
        * TODO
        * Logic:
        * - Create a separate Tool for each SearchInstance
        * - Connection between UI and store
        * - Query of the service
        *   + Difference between WFS@2.0.0 (Stored Query) and WFS@1.1.0 (query has to be built)
        *
        * Components:
        * - Result Table / List --> reusable?
        * - Add Search and Reset Buttons to the Search Component
        */
    },
    methods: {
        ...mapMutations("Tools/WfsSearch", Object.keys(mutations)),
        ...mapActions("Tools/WfsSearch", Object.keys(actions)),
        close () {
            this.setActive(false);
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template>
    <!-- TODO: Add appropriate initialWidth to state -->
    <Tool
        :title="$t(name)"
        :icon="glyphicon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivateGFI="deactivateGFI"
    >
        <template v-slot:toolBody>
            <template v-if="userHelp">
                <span>{{ userHelp }}</span>
                <hr>
            </template>
            <form class="form-horizontal">
                <!-- TODO: Add proper keys -->
                <template v-for="clause of clauses">
                    <Literal
                        :key="'Klaus' + clause"
                        :literal="clause"
                    />
                </template>
            </form>
        </template>
    </Tool>
</template>

<style lang="less" scoped>
@import "~variables";
</style>
