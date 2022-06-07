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
                        :disabled="currentLayerIndex === -1"
                        @change="layerChanged($event.target.options.selectedIndex)"
                    >
                        <option
                            v-for="(layer, index) of layerInformation"
                            :key="layer.id"
                            :selected="index === currentLayerIndex"
                        >
                            {{ $t(layer.name) }}
                        </option>
                    </select>
                </div>
                <template v-if="typeof featureProperties === 'string'">
                    <div id="tool-wfsTransaction-layerFailure">
                        {{ $t(featureProperties) }}
                    </div>
                </template>
                <div
                    v-else-if="showInteractionsButtons"
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
                        <template v-for="property of featureProperties">
                            <template v-if="property.type !== 'geometry'">
                                <label
                                    :key="`${property.key}-label`"
                                    :for="`tool-wfsTransaction-form-input-${property.key}`"
                                    class="form-label"
                                >
                                    {{ $t(property.label) }}
                                </label>
                                <input
                                    :id="`tool-wfsTransaction-form-input-${property.key}`"
                                    :key="`${property.key}-input`"
                                    class="form-control"
                                    :type="getInputType(property.type)"
                                    :required="property.required"
                                >
                            </template>
                        </template>
                        <div id="tool-wfsTransaction-form-buttons">
                            <SimpleButton
                                :interaction="discard"
                                caption="common:modules.tools.wfsTransaction.form.buttons.discard"
                            />
                            <SimpleButton
                                :interaction="save"
                                caption="common:modules.tools.wfsTransaction.form.buttons.save"
                                type="submit"
                            />
                        </div>
                    </form>
                </template>
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
        ...mapGetters("Tools/WfsTransaction", ["currentInteractionConfig", "currentLayerIndex", "featureProperties", "layerInformation", "selectedInteraction", "showInteractionsButtons", "active", "icon", "name"]),
        ...mapGetters("Maps", ["getLayerById"])
    },
    watch: {
        active (val) {
            this.setActive(val);
        }
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapMutations("Tools/WfsTransaction", ["setCurrentLayerIndex", "setSelectedInteraction"]),
        ...mapActions("Tools/WfsTransaction", ["setActive", "setFeatureProperties"]),
        close () {
            this.setActive(false);
            const model = Radio.request("ModelList", "getModelByAttributes", {id: "wfsTransaction"});

            if (model) {
                model.set("isActive", false);
            }
        },
        layerChanged (index) {
            this.setCurrentLayerIndex(index);
            this.setFeatureProperties();
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
            // TODO(roehlipa): Form validation
            console.warn("You saved!");
            this.setSelectedInteraction(null);
        },
        getInputType (type) {
            if (type === "string") {
                return "text";
            }
            if (type === "integer" || type === "int" || type === "decimal") {
                return "number";
            }
            if (type === "boolean") {
                return "checkbox";
            }
            if (type === "date") {
                return "date";
            }
            return "";
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

    #tool-wfsTransaction-layerFailure {
        display: flex;
        justify-content: center;
        align-content: center;
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

        label {
            align-self: center;
            margin: 0;
        }
    }

    #tool-wfsTransaction-form-buttons {
        display: grid;
        grid-template-columns: repeat(2, 20em);
        margin-top: calc(#{$grid-gap} / 2);

        button:first-child {
            margin-right: calc(#{$grid-gap} / 2);
        }
        button:last-child {
            margin-left: calc(#{$grid-gap} / 2);
        }
    }
}
</style>
