<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getComponent from "../../../../utils/getComponent";
import ToolTemplate from "../../ToolTemplate.vue";
import getters from "../store/gettersShadowTool";
import mutations from "../store/mutationsShadowTool";
import actions from "../store/actionsShadowTool";
import SliderInput from "./SliderInput.vue";
import ToggleCheckbox from "../../../../share-components/toggleCheckbox/components/ToggleCheckbox.vue";

export default {
    name: "ShadowTool",
    components: {
        ToolTemplate,
        SliderInput,
        ToggleCheckbox
    },
    computed: {
        ...mapGetters("Tools/ShadowTool", Object.keys(getters))
    },
    created () {
        console.log('llllllllllllllllllll');
        this.$on("close", this.close);
    },
    methods: {
        ...mapMutations("Tools/ShadowTool", Object.keys(mutations)),
        ...mapActions("Tools/ShadowTool", Object.keys(actions)),

        close () {
            this.setActive(false);
            // The value "isActive" of the Backbone model is also set to false to change the CSS class in the menu (menu/desktop/tool/view.toggleIsActiveClass)
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
             <template >
             <div class="checkbox">
                    <div class="checkbox-container">
                        <div class="form-inline">
                            <div class="title-checkbox pull-left">
                                <label
                                    <!-- for="rasterCheckBoxPopRE" -->
                                 <!-- @click="triggerRaster(!rasterActive)" -->
                                    <!-- @keydown.enter="triggerRaster(!rasterActive)" -->
                                >{{ $t("additional:modules.tools.populationRequest.select.showRasterLayer") }}</label>
                                <ToggleCheckbox
                                    id="rasterCheckBoxPopRE"
                                  <!--   ref="rasterCheckBox" -->
                                    :defaultState="true"
                                    :title="$t('additional:modules.tools.populationRequest.switchOffFilter')"
                                    :text-on="$t('common:snippets.checkbox.on')"
                                    :text-off="$t('common:snippets.checkbox.off')"
                                  <!--   @change="triggerRaster" -->
                                />
                            </div>
                        </div>
                    </div>
                    </div>
            <SliderInput
                :label="$t('common:modules.tools.routing.isochrones.maxTraveltime')"
                :value="1"
                :min="0"
                :disabled="false"
                :max="24"
                unit="hours"
            />
        </template>
             <template >
            <SliderInput
                :label="$t('common:modules.tools.routing.isochrones.maxTraveltime')"
                :value="1"
                :min="0"
                :disabled="false"
                :max="24"
                unit="hours"
            />
        </template>

        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
    @import "~variables";

   .checkbox-container {
        .form-inline {
            font-size: 15px;

            @media (max-width: 767px) {
                font-size: 12px;
            }

            .title-checkbox {
                width: 100%;

                label {
                    white-space: normal;
                    padding-left:5px;
                }
            }
        }
    }
</style>
