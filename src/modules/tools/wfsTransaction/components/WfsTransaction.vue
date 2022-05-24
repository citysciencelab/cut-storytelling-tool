<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
    >
        <template #toolBody>
            <div id="tool-wfsTransaction-container">
                <div id="tool-wfsTransaction-layerSelect-container">
                    <label
                        id="tool-wfsTransaction-layerSelect-label"
                        for="tool-wfsTransaction-layerSelect"
                    >
                        {{ $t("common:modules.tools.wfsTransaction.layerSelectLabel") }}
                    </label>
                    <select
                        id="tool-wfsTransaction-layerSelect"
                        class="form-select"
                        @change="layerChanged($event.target.options.selectedIndex)"
                    >
                        <option
                            v-for="id of layerIds"
                            :key="id"
                        >
                            {{ id }} <!-- TODO(roehlipa): Get the name from the config -->
                        </option>
                    </select>
                </div>
                <div
                    v-if="showInteractionsButtons"
                    id="tool-wfsTransaction-interactionSelect-container"
                >
                    <template v-for="(config, key) in currentInteractionConfig">
                        <SimpleButton
                            v-if="config.available"
                            :key="key"
                            :caption="config.caption"
                            :icon="config.icon"
                            :interaction="() => interactionChanged(key)"
                        />
                    </template>
                </div>
                <div
                    v-else
                    id="tool-wfsTransaction-formular-container"
                >
                    {{ selectedInteraction }}
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import prepareInteractions from "../utils/prepareInteractions";
import ToolTemplate from "../../ToolTemplate.vue";
import SimpleButton from "../../../../share-components/SimpleButton.vue";

export default {
    name: "WfsTransaction",
    components: {SimpleButton, ToolTemplate},
    computed: {
        ...mapGetters("Tools/WfsTransaction", ["currentInteractionConfig", "layerIds", "selectedInteraction", "showInteractionsButtons", "active", "icon", "name"])
    },
    methods: {
        ...mapMutations("Tools/WfsTransaction", ["setCurrentLayerIndex", "setSelectedInteraction"]),
        ...mapActions("Tools/WfsTransaction", ["setActive"]),
        layerChanged (index) {
            this.setCurrentLayerIndex(index);
            this.setSelectedInteraction(null);
            // TODO(roehlipa): If formular open, deactivate and remove all stuff from map (should also happen on close)
        },
        interactionChanged (key) {
            this.setSelectedInteraction(key);
            prepareInteractions(key);
        }
    }
};
</script>

<style lang="scss" scoped>
#tool-wfsTransaction-container {
    display: grid;
    grid-template-columns: repeat(1, 40em);
    gap: 10px;
    grid-auto-rows: auto;

    > * {
        display: flex;
        justify-content: space-around;
    }

    #tool-wfsTransaction-layerSelect-container {
        #tool-wfsTransaction-layerSelect-label {
            width: 10em;
            align-self: center;
        }
    }

    #tool-wfsTransaction-interactionSelect-container {
        button:first-child {
            margin-left: 0;
        }
        button:last-child {
            margin-right: 0;
        }
    }

    #tool-wfsTransaction-formular-container {
    }
}
</style>
