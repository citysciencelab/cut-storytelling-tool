import {expect} from "chai";
import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import StyleVT from "../../store/indexStyleVT";
import StyleVTComponent from "../../components/StyleVT.vue";

const localVue = createLocalVue();

config.mocks.$t = key => key;

localVue.use(Vuex);

describe("src/modules/tools/styleVT/components/StyleVT.vue", () => {
    let store,
        wrapper;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        StyleVT
                    }
                }
            }
        });
        store.commit("Tools/StyleVT/setActive", true);
    });

    afterEach(sinon.restore);

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("should render a paragraph informing the user that no styleable layers are available if none are", () => {
        wrapper = shallowMount(StyleVTComponent, {store, localVue});

        expect(wrapper.find("#tool-styleVT-noStyleableLayers").exists()).to.be.true;
        expect(wrapper.find("#tool-styleVT-styleableLayersAvailable").exists()).to.be.false;
    });
    it("should render the regular UI if styleable layers are available", () => {
        const layerOne = Symbol(),
            layerTwo = Symbol();

        store.commit("Tools/StyleVT/setVectorTileLayerList", [layerOne, layerTwo]);
        wrapper = shallowMount(StyleVTComponent, {store, localVue});

        expect(wrapper.find("#tool-styleVT-styleableLayersAvailable").exists()).to.be.true;
        expect(wrapper.find("#tool-styleVT-noStyleableLayers").exists()).to.be.false;
    });

    it("sets focus to first input control", async () => {
        const elem = document.createElement("div");

        if (document.body) {
            document.body.appendChild(elem);
        }
        wrapper = shallowMount(StyleVTComponent, {store, localVue, attachTo: elem});

        wrapper.vm.setFocusToFirstControl();

        await wrapper.vm.$nextTick();
        expect(wrapper.find("#tool-styleVT-selectedLayerField").element).to.equal(document.activeElement);
    });
});
