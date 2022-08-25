import Vuex from "vuex";
import {config, mount, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import ShadowComponent from "../../../components/ShadowTool.vue";
import Module from "../../../store/indexShadowTool";
import Getters from "../../../store/gettersShadowTool";
import Actions from "../../../store/actionsShadowTool";


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
                            isShadowEnabled: false
                        }
                    }
                }
            }
        }
    };

    let store, wrapper;

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
            actions: Actions,
            state: {
                configJson: mockConfigJson
            }
        });

        store.commit("Tools/Shadow/setActive", true);
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });
    it("should find Tool component", () => {
        wrapper = shallowMount(ShadowComponent, {store, localVue});
        const toolWrapper = wrapper.findComponent({name: "ToolTemplate"});

        expect(toolWrapper.exists()).to.be.true;

    });
    it("component has checkbox,date picker, time and date slider", () => {
        wrapper = mount(ShadowComponent, {store, localVue});

        const checkbox = wrapper.find("#tool-shadow-checkbox"),
            datePicker = wrapper.find("#datePicker"),
            dateSlider = wrapper.find("#dateSlider"),
            timeSlider = wrapper.find("#timeSlider");

        expect(checkbox.exists()).to.be.true;
        expect(datePicker.exists()).to.be.true;
        expect(dateSlider.exists()).to.be.true;
        expect(timeSlider.exists()).to.be.true;
    });
    it("PickDateFormat is DD.MM.YYYY for de", () => {
        wrapper = mount(ShadowComponent, {store, localVue});
        wrapper.vm.checkDateFormat();
        expect(wrapper.vm.pickDateFormat).to.equal("DD.MM.YYYY");
    });

});
