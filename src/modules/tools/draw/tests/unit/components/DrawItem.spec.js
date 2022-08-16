import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import DrawItemComponent from "../../../components/DrawItem.vue";
import Draw from "../../../store/indexDraw";
import {expect} from "chai";
import sinon from "sinon";

const localVue = createLocalVue();

config.mocks.$t = key => key;
config.mocks.$i18n = {
    i18next: {
        exists: sinon.stub(),
        options: {
            isEnabled: () => sinon.stub(),
            getLanguages: () => sinon.stub()
        }
    }
};
localVue.use(Vuex);

describe("src/tools/draw/components/DrawItem.vue", () => {
    let store,
        wrapper,
        componentData;
    const
        mockConfigJson = {
            Portalconfig: {
                menu: {
                    tools: {
                        children: {
                            draw:
                                {
                                    "name": "draw",
                                    "renderToWindow": true
                                }
                        }
                    }
                }
            }
        };

    beforeEach(function () {
        Draw.state.layer = {
            visible: true,
            getVisible: () => Draw.state.layer.visible,
            setVisible: value => {
                Draw.state.layer.visible = value;
            },
            getSource: () => {
                return {
                    getFeatures: () => []
                };
            }
        };

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        Draw
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
        componentData = () => {
            return {
                mapElement: {style: {cursor: "pointer"}},
                constants: {},
                drawing: true
            };
        };
        store.commit("Tools/Draw/setActive", true);
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("sets focus to first input control", async () => {
        const elem = document.createElement("div");

        if (document.body) {
            document.body.appendChild(elem);
        }

        wrapper = shallowMount(DrawItemComponent, {store, localVue, data: componentData, attachTo: elem});
        wrapper.vm.setFocusToFirstControl();
        await wrapper.vm.$nextTick();
        expect(wrapper.find("#tool-draw-drawType").element).to.equal(document.activeElement);
    });
    it("should hide layer and disable controls", async () => {
        wrapper = shallowMount(DrawItemComponent, {store, localVue, data: componentData});
        expect(wrapper.find("#tool-draw-drawLayerVisible").exists()).to.be.true;

        expect(wrapper.vm.drawLayerVisible).to.be.true;
        expect(wrapper.vm.layer.getVisible()).to.be.true;
        expect(wrapper.find("#tool-draw-drawType").element.disabled).to.be.false;
        expect(wrapper.find("#tool-draw-undoInteraction").element.disabled).to.be.false;
        expect(wrapper.find("#tool-draw-redoInteraction").element.disabled).to.be.false;
        expect(wrapper.find("#tool-draw-deleteInteraction").element.disabled).to.be.false;
        expect(wrapper.find("#tool-draw-deleteAllInteraction").element.disabled).to.be.false;

        await wrapper.find("#tool-draw-drawLayerVisible").trigger("click");

        expect(wrapper.vm.drawLayerVisible).to.be.false;
        expect(wrapper.vm.layer.getVisible()).to.be.false;
        expect(wrapper.find("#tool-draw-drawType").element.disabled).to.be.true;
        expect(wrapper.find("#tool-draw-drawInteraction").element.disabled).to.be.true;
        expect(wrapper.find("#tool-draw-undoInteraction").element.disabled).to.be.true;
        expect(wrapper.find("#tool-draw-redoInteraction").element.disabled).to.be.true;
        expect(wrapper.find("#tool-draw-editInteraction").element.disabled).to.be.true;
        expect(wrapper.find("#tool-draw-deleteInteraction").element.disabled).to.be.true;
        expect(wrapper.find("#tool-draw-deleteAllInteraction").element.disabled).to.be.true;
    });
});
