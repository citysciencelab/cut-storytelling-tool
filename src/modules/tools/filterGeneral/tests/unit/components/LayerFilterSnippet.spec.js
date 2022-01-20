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
                layerConfig: {
                    "snippets": [
                        {
                            "attrName": "checkbox",
                            "label": "Ist dies eine Schwerpunktschule?",
                            "type": "checkbox",
                            "matchingMode": "OR"
                        }
                    ]
                }
            },
            localVue
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    describe("checkSnippetType", () => {
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

    describe("isRule", () => {
        it("should return false if anything but a rule is given", () => {
            expect(wrapper.vm.isRule(undefined)).to.be.false;
            expect(wrapper.vm.isRule(null)).to.be.false;
            expect(wrapper.vm.isRule("string")).to.be.false;
            expect(wrapper.vm.isRule(1234)).to.be.false;
            expect(wrapper.vm.isRule(true)).to.be.false;
            expect(wrapper.vm.isRule(false)).to.be.false;
            expect(wrapper.vm.isRule([])).to.be.false;
            expect(wrapper.vm.isRule({})).to.be.false;
        });
        it("should return true if a rule is given", () => {
            expect(wrapper.vm.isRule({
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "",
                operator: ""
            })).to.be.true;
        });
    });
    describe("changeRule", () => {
        it("should add the new rule", () => {
            wrapper.vm.changeRule({
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "EQ"
            });
            expect(wrapper.vm.rules).to.deep.equal([{
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "EQ"
            }]);
        });
        it("should change an existing rule", () => {
            wrapper.vm.changeRule({
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "EQ"
            });
            wrapper.vm.changeRule({
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "IN"
            });
            expect(wrapper.vm.rules).to.deep.equal([{
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "IN"
            }]);
        });
    });
    describe("deleteRule", () => {
        it("should delete an existing rule", () => {
            wrapper.vm.changeRule({
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "EQ"
            });
            wrapper.vm.deleteRule(0);
            expect(wrapper.vm.rules).to.deep.equal([false]);
        });
    });
    describe("hasUnfixedRules", () => {
        it("should return false if there are no rules with fixed=false", () => {
            wrapper.vm.changeRule({
                snippetId: 1,
                startup: false,
                fixed: true,
                attrName: "test",
                operator: "EQ"
            });
            expect(wrapper.vm.hasUnfixedRules()).to.be.false;
        });
        it("should return true if there are rules with fixed=false in the rules", () => {
            wrapper.vm.changeRule({
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "EQ"
            });
            wrapper.vm.changeRule({
                snippetId: 1,
                startup: false,
                fixed: true,
                attrName: "test",
                operator: "EQ"
            });
            expect(wrapper.vm.hasUnfixedRules()).to.be.true;
        });
    });
});
