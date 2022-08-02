<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getComponent from "../../../../utils/getComponent";
import ToolTemplate from "../../ToolTemplate.vue";
import getters from "../store/gettersShadowTool";
import mutations from "../store/mutationsShadowTool";
import actions from "../store/actionsShadowTool";
import SliderInput from "./SliderInput.vue";
import ToggleCheckbox from "../../../../share-components/toggleCheckbox/components/ToggleCheckbox.vue";
import moment from "moment";

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
    mounted () {
       this.createDate();
    },
    watch: {
        /**
         * watches the status of the tool
         * starts initial processes if the tool has been activated for the first time
         * @param {Boolean} value true if the tool has been activated
         * @returns {void}
         */
        active (value) {
            if (value) {
                this.setActive(value);
                this.createDate();
                console.log('--------------------------------------------------');
            }
        }
    },
    created () {
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
        },
        createDate () {
            console.log(document.getElementById("tool-shadow-checkbox"));
            if (document.getElementById("datePicker")){
            document.getElementById("datePicker").value = moment().format('MM-DD-YYYY');
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
               <div class="d-flex justify-content-between mb-3">
                    <label
                        class="form-label"
                        for="tool-shadow-checkbox"
                    >
                        {{ $t('common:modules.tools.shadow.shadowDisplay') }}
                    </label>
                    <ToggleCheckbox
                        id="tool-shadow-checkbox"
                        ref="shadowCheckBox"
                        :text-on="$t('common:snippets.checkbox.on')"
                        :text-off="$t('common:snippets.checkbox.off')"
                        @change="toggleLayer"
                    />
                </div>
             <div class="d-flex justify-content-between mb-3">
                    <label
                        class="form-label"
                        for="datePicker"
                    >
                        {{ $t('common:modules.tools.shadow.pickDate') }}
                    </label>
            <input
                id="datePicker"
                type="date"
            >
             </div>

             <template >
            <SliderInput
                :label="$t('common:modules.tools.shadow.slideHour')"
                :value="1"
                min=""
                :disabled="false"
                max=""
                unit=""
            />
        </template>
             <template >
            <SliderInput
                :label="$t('common:modules.tools.shadow.slideDate')"
                :value="1"
                min=""
                :disabled="false"
                max=""
                unit=""
            />
        </template>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
    @import "~variables";

label {
text-align: left;
width: 300px;
line-height: 26px;
margin-bottom: 10px;
}

input {
  height: 20px;
  flex: 0 0 200px;
  margin-left: 10px;
}
</style>
