import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetCheckboxComponent from "../../../components/SnippetCheckbox.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filterGeneral/components/SnippetCheckbox.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SnippetCheckboxComponent, {
            propsData: {
                operator: "EQ",
                prechecked: false,
                label: "Ist dies eine Schwerpunktschule?",
                visible: true
            },
            localVue
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("should render correctly", () => {
        expect(wrapper.find("input").classes("snippetCheckbox")).to.be.true;
    });

    it("should render correctly with prechecked as true", () => {
        wrapper = shallowMount(SnippetCheckboxComponent, {
            propsData: {
                operator: "EQ",
                prechecked: true,
                label: "Ist dies eine Schwerpunktschule?",
                visible: true
            },
            localVue
        });
        expect(wrapper.find(".snippetCheckbox").element.checked).to.be.equal(true);
    });

    it("should render correctly with prechecked as false", () => {
        wrapper = shallowMount(SnippetCheckboxComponent, {
            propsData: {
                operator: "EQ",
                prechecked: false,
                label: "Ist dies eine Schwerpunktschule?",
                visible: true
            },
            localVue
        });
        expect(wrapper.find(".snippetCheckbox").element.checked).to.be.equal(false);
    });

    it("should render correctly with prechecked as true and visible as false", () => {
        wrapper = shallowMount(SnippetCheckboxComponent, {
            propsData: {
                operator: "EQ",
                prechecked: true,
                label: "Ist dies eine Schwerpunktschule?",
                visible: false
            },
            localVue
        });
        expect(wrapper.find(".snippetCheckbox").element.checked).to.be.equal(true);
        expect(wrapper.find(".snippetCheckboxContainer").element.style._values.display).to.be.equal("none");
    });

    it("should render correctly with prechecked as false and visible as true", () => {
        wrapper = shallowMount(SnippetCheckboxComponent, {
            propsData: {
                operator: "EQ",
                prechecked: false,
                label: "Ist dies eine Schwerpunktschule?",
                visible: true
            },
            localVue
        });
        expect(wrapper.find(".snippetCheckbox").element.checked).to.be.equal(false);
        expect(wrapper.find(".snippetCheckboxContainer").element.style._values.display).to.be.equal(undefined);
    });

    it("should render without prechecked and visible and operator", () => {
        wrapper = shallowMount(SnippetCheckboxComponent, {
            propsData: {
                label: "Ist dies eine Schwerpunktschule?"
            },
            localVue
        });
        expect(wrapper.find("input").classes("snippetCheckbox")).to.be.true;
    });

    it("should render correctly without prechecked and visible and operator", () => {
        wrapper = shallowMount(SnippetCheckboxComponent, {
            propsData: {
                label: "Ist dies eine Schwerpunktschule?"
            },
            localVue
        });
        expect(wrapper.find(".snippetCheckbox").element.checked).to.be.equal(false);
        expect(wrapper.find(".snippetCheckboxContainer").element.style._values.display).to.be.equal(undefined);
    });

    it("should render but also be disabled", () => {
        wrapper = shallowMount(SnippetCheckboxComponent, {
            propsData: {
                disabled: true,
                label: "foobar"
            },
            localVue
        });
        expect(wrapper.find(".snippetCheckbox").exists()).to.be.true;
        expect(wrapper.vm.disabled).to.be.true;
        expect(wrapper.find(".snippetCheckbox").element.disabled).to.be.true;
    });

    it("should render the info span", () => {
        wrapper = shallowMount(SnippetCheckboxComponent, {
            propsData: {
                disabled: false,
                label: "foobar",
                info: "Die Info"
            },
            localVue
        });
        expect(wrapper.find(".info-text").exists()).to.be.true;
        expect(wrapper.find(".info-text span").element.innerHTML).to.be.equal("Die Info");
    });
});
