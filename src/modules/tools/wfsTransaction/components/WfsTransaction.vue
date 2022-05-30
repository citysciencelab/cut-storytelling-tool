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
                            v-for="name of layerNames"
                            :key="name"
                        >
                            {{ $t(name) }}
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
                <template v-else>
                    <hr>
                    <form id="tool-wfsTransaction-form">
                        <template v-for="property of featuresProperties">
                            <label
                                :key="`label-${property.key}`"
                                :for="`tool-wfsTransaction-form-input-${property.key}`"
                                class="form-label"
                            >
                                {{ $t(property.label) }}
                            </label>
                            <input
                                :id="`tool-wfsTransaction-form-input-${property.key}`"
                                :key="`input-${property.key}`"
                                class="form-control"
                            >
                        </template>
                    </form>
                    <div id="tool-wfsTransaction-form-buttons">
                        <SimpleButton
                            :interaction="discard"
                            caption="common:modules.tools.wfsTransaction.form.buttons.discard"
                        />
                        <SimpleButton
                            :interaction="save"
                            caption="common:modules.tools.wfsTransaction.form.buttons.save"
                        />
                    </div>
                </template>
            </div>
        </template>
    </ToolTemplate>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import prepareInteractions from "../utils/prepareInteractions";
import ToolTemplate from "../../ToolTemplate.vue";
import SimpleButton from "../../../../share-components/SimpleButton.vue";

export default {
    name: "WfsTransaction",
    components: {SimpleButton, ToolTemplate},
    data: () => ({layerNames: []}),
    computed: {
        ...mapGetters("Tools/WfsTransaction", ["currentInteractionConfig", "featuresProperties", "layerIds", "selectedInteraction", "showInteractionsButtons", "active", "icon", "name"]),
        ...mapGetters("Maps", ["getLayerById"])
    },
    created () {
        this.layerNames = this.layerIds.map(layerId => this.getLayerById({layerId}).values_.name);
    },
    methods: {
        ...mapMutations("Tools/WfsTransaction", ["setCurrentLayerIndex", "setSelectedInteraction"]),
        layerChanged (index) {
            this.setCurrentLayerIndex(index);
            this.setSelectedInteraction(null);
            // TODO(roehlipa): If formular open, deactivate and remove all stuff from map (should also happen on close, save and discard)
        },
        interactionChanged (key) {
            this.setSelectedInteraction(key);
            prepareInteractions(key);
        },
        discard () {
            console.warn("You discarded!");
            this.setSelectedInteraction(null);
        },
        save () {
            console.warn("You saved!");
            this.setSelectedInteraction(null);
        }
    }
};
</script>

<style lang="scss" scoped>
$grid-gap: 15px;

#tool-wfsTransaction-container {
    display: grid;
    grid-template-columns: repeat(1, 40em);
    gap: $grid-gap;
    grid-auto-rows: auto;

    hr {
        margin: 0;
    }

    #tool-wfsTransaction-layerSelect-container {
        display: flex;
        justify-content: space-between;

        #tool-wfsTransaction-layerSelect-label {
            width: 10em;
            align-self: center;
        }
    }

    #tool-wfsTransaction-interactionSelect-container {
        display: flex;
        justify-content: space-between;

        button {
            margin: 5px;
        }
        button:first-child {
            margin-left: 0;
        }
        button:last-child {
            margin-right: 0;
        }
    }

    #tool-wfsTransaction-form {
        display: grid;
        grid-template-columns: 10em 30em;
        grid-row-gap: calc(#{$grid-gap} / 2);
    }

    #tool-wfsTransaction-form-buttons {
        display: grid;
        grid-template-columns: repeat(2, 20em);

        button:first-child {
            margin-right: calc(#{$grid-gap} / 2);
        }
        button:last-child {
            margin-left: calc(#{$grid-gap} / 2);
        }
    }
}
</style>
