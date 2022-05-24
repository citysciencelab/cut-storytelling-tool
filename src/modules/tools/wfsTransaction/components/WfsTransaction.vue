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
                        @change="setCurrentLayerIndex($event.target.options.selectedIndex)"
                    >
                        <!--
                            TODO(roehlipa): Add to @change
                                ==> If formular open, deactivate and remove all stuff from map (should also happen on close)
                        -->
                        <option
                            v-for="id of layerIds"
                            :key="id"
                        >
                            {{ id }} <!-- TODO(roehlipa): Get the name from the config -->
                        </option>
                    </select>
                </div>
                <div
                    v-if="selectedInteraction === null"
                    id="tool-wfsTransaction-interactionSelect-container"
                >
                    <template v-for="config in currentInteractionConfig">
                        <SimpleButton
                            v-if="config.available"
                            :key="config.caption"
                            :caption="config.caption"
                            :icon="config.icon"
                            :interaction="() => console.warn('I\'ll be a real function when I grow up :)')"
                        />
                        <!--
                            TODO(roehlipa): Add interaction
                                ==> Adds interactions with the map
                                ==> Adds formular for saving features OR
                                ==> Updates / Deletes features of service on selection
                         -->
                    </template>
                </div>
                <div
                    v-if="selectedInteraction !== null"
                    id="tool-wfsTransaction-formular-container"
                />
            </div>
        </template>
    </ToolTemplate>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import ToolTemplate from "../../ToolTemplate.vue";
import SimpleButton from "../../../../share-components/SimpleButton.vue";

export default {
    name: "WfsTransaction",
    components: {SimpleButton, ToolTemplate},
    computed: {
        ...mapGetters("Tools/WfsTransaction", ["currentInteractionConfig", "layerIds", "active", "icon", "name"]),
        selectedInteraction () {
            return null;
        }
    },
    watch: {
        active (val) {
            this.setActive(val);
        }
    },
    methods: {
        ...mapMutations("Tools/WfsTransaction", ["setCurrentLayerIndex"]),
        ...mapActions("Tools/WfsTransaction", ["setActive"])
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
