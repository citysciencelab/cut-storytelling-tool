import Vuex from "vuex";
import {config, mount, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import ShadowComponent from "../../../components/ShadowTool.vue";
import ToggleCheckboxComponent from "../../../../../../share-components/toggleCheckbox/components/ToggleCheckbox.vue";
import Module from "../../../store/indexShadowTool";
import Getters from "../../../store/gettersShadowTool";
import sinon from "sinon";


const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

localVue.use(Vuex);

describe("src/modules/tools/contact/components/ShadowTool.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        shadow:
                        {
                            "name": "translate#common:menu.shadow",
                            "icon": "bi-lamp-fill",
                            isShadowEnabled: true
                        }
                    }
                }
            }
        }
    };

    let store, shadowWrapper;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        Shadow: Module
                    }
                },
                Language: {
                    namespaced: true,
                    getters: {currentLocale: () => {
                        return "de";
                    }}
                }
            },
            getters: Getters,
            state: {
                configJson: mockConfigJson
            }
        });

        store.commit("Tools/Shadow/setActive", true);
    });

    afterEach(() => {
        if (shadowWrapper) {
            shadowWrapper.destroy();
        }
    });
    it("should find Tool component", () => {
        shadowWrapper = mount(ShadowComponent, {store, localVue, stubs: {"ToggleCheckbox": ToggleCheckboxComponent}});
        const toolshadowWrapper = shadowWrapper.findComponent({name: "ToolTemplate"});

        expect(toolshadowWrapper.exists()).to.be.true;

    });
    it("component has checkbox,date picker, time and date slider", () => {
        shadowWrapper = mount(ShadowComponent, {store, localVue, stubs: {"ToggleCheckbox": ToggleCheckboxComponent}});

        const checkbox = shadowWrapper.find("#tool-shadow-checkbox"),
            datePicker = shadowWrapper.find("#datePicker"),
            dateSlider = shadowWrapper.find("#dateSlider"),
            timeSlider = shadowWrapper.find("#timeSlider");

        expect(checkbox.exists()).to.be.true;
        expect(datePicker.exists()).to.be.true;
        expect(dateSlider.exists()).to.be.true;
        expect(timeSlider.exists()).to.be.true;
    });
    it("should call toggleShadow if shadowCheckBox is changed", async () => {
        const spyToggleShadow = sinon.spy(),
            wrapper = shallowMount(ShadowComponent, {store, methods: {"toggleShadow": spyToggleShadow}, localVue, stubs: {"ToggleCheckbox": ToggleCheckboxComponent}}),
            checkBox = wrapper.findComponent({ref: "shadowCheckBox"});

        await checkBox.vm.$emit("change");
        expect(spyToggleShadow.calledOnce).to.be.true;
    });
    it("PickDateFormat is DD.MM.YYYY for de", () => {
        shadowWrapper = mount(ShadowComponent, {store, localVue, stubs: {"ToggleCheckbox": ToggleCheckboxComponent}});
        shadowWrapper.vm.checkDateFormat();
        expect(shadowWrapper.vm.pickDateFormat).to.equal("DD.MM.YYYY");
    });
    it("test watch on active should call create date once", async () => {
        const spyCreateDate = sinon.spy();

        shadowWrapper = mount(ShadowComponent, {store, methods: {"createDate": spyCreateDate}, localVue, stubs: {"ToggleCheckbox": ToggleCheckboxComponent}});
        shadowWrapper.vm.$nextTick();
        await shadowWrapper.vm.$options.watch.active.call(shadowWrapper.vm, true);
        expect(spyCreateDate.calledOnce).to.be.true;
    });
    it("control div should be visible if tool and shadow is activated", async () => {
        const spyCreateDate = sinon.spy();

        shadowWrapper = mount(ShadowComponent, {store, methods: {"createDate": spyCreateDate}, localVue, stubs: {"ToggleCheckbox": ToggleCheckboxComponent}});
        shadowWrapper.vm.$nextTick();

        await shadowWrapper.vm.$options.watch.active.call(shadowWrapper.vm, true);

        expect(shadowWrapper.find("#control").isVisible()).to.be.true;
    });

});
