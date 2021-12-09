import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import LayerFilterSnippetComponent from "../../../components/LayerFilterSnippet.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filterGeneral/components/LayerFilterSnippet.vue", () => {
    let wrapper, snippet, type;

    beforeEach(() => {
        wrapper = shallowMount(LayerFilterSnippetComponent, {
            propsData: {
                layersConfig: [{
                    "snippets": [
                        {
                            "attrName": "checkbox",
                            "label": "Ist dies eine Schwerpunktschule?",
                            "type": "checkbox",
                            "matchingMode": "OR"
                        }
                    ]
                }]
            },
            localVue
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("checks if the snippet type exists", () => {
        snippet = {
            "attrName": "checkbox",
            "label": "Ist dies eine Schwerpunktschule?",
            "type": "checkbox",
            "matchingMode": "OR"
        };
        type = "checkbox";
        expect(wrapper.vm.checkSnippetType(snippet, type)).to.be.true;

        expect(wrapper.vm.checkSnippetType(snippet, "dropdown")).to.be.false;
        expect(wrapper.vm.checkSnippetType(snippet, "text")).to.be.false;
        expect(wrapper.vm.checkSnippetType(snippet, "slider")).to.be.false;
        expect(wrapper.vm.checkSnippetType(snippet, "sliderRange")).to.be.false;
        expect(wrapper.vm.checkSnippetType(snippet, "date")).to.be.false;
        expect(wrapper.vm.checkSnippetType(snippet, "dateRange")).to.be.false;

        snippet = {
            "attrName": "checkbox",
            "label": "Ist dies eine Schwerpunktschule?",
            "matchingMode": "OR"
        };
        type = "checkbox";
        expect(wrapper.vm.checkSnippetType(snippet, type)).to.be.false;

        expect(wrapper.vm.checkSnippetType({}, type)).to.be.false;
        expect(wrapper.vm.checkSnippetType([], type)).to.be.false;
        expect(wrapper.vm.checkSnippetType("", type)).to.be.false;
        expect(wrapper.vm.checkSnippetType(null, type)).to.be.false;
        expect(wrapper.vm.checkSnippetType(undefined, type)).to.be.false;
        expect(wrapper.vm.checkSnippetType(false, type)).to.be.false;
        expect(wrapper.vm.checkSnippetType(0, type)).to.be.false;
    });
});
