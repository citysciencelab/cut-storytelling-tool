import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetInput from "../../../components/SnippetInput.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filterGeneral/components/SnippetInput.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SnippetInput, {
            propsData: {
                operator: "IN",
                prechecked: "",
                placeholder: "",
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
        expect(wrapper.find("input").classes("snippetInput")).to.be.true;
    });

    it("should render hidden if visible is false and prechecked is set", () => {
        wrapper = shallowMount(SnippetInput, {
            propsData: {
                operator: "IN",
                prechecked: "test",
                placeholder: "Text eingeben",
                visible: false
            },
            localVue
        });

        expect(wrapper.find(".snippetInput").element.value).to.be.equal("test");
        expect(wrapper.find(".snippetInputContainer").element.style._values.display).to.be.equal("none");
    });

    it("should render snippet with placeholder", () => {
        wrapper = shallowMount(SnippetInput, {
            propsData: {
                operator: "IN",
                prechecked: "test",
                placeholder: "Placeholder 1234",
                visible: false
            },
            localVue
        });

        expect(wrapper.find(".snippetInput").attributes("placeholder")).to.be.equal("Placeholder 1234");
    });

    it("should render without placeholder", () => {
        wrapper = shallowMount(SnippetInput, {
            propsData: {
                operator: "IN",
                prechecked: "test",
                visible: false
            },
            localVue
        });

        expect(wrapper.find(".snippetInput").attributes("placeholder")).to.be.equal("");
    });

    it("should render without props", () => {
        wrapper = shallowMount(SnippetInput, {
            propsData: {},
            localVue
        });

        expect(wrapper.find("input").classes("snippetInput")).to.be.true;
        expect(wrapper.find(".snippetInput").element.value).to.be.equal("");
        expect(wrapper.find(".snippetInput").attributes("placeholder")).to.be.equal("");
        expect(wrapper.find(".snippetInputLabel").text()).to.be.equal("");
    });

    it("should render label", () => {
        wrapper = shallowMount(SnippetInput, {
            propsData: {
                label: "foobar"
            },
            localVue
        });

        expect(wrapper.find(".snippetInputLabel").text()).to.be.equal("foobar");
    });

    it("should render but also be disabled", () => {
        wrapper = shallowMount(SnippetInput, {
            propsData: {
                disabled: true,
                label: "foobar"
            },
            localVue
        });
        expect(wrapper.find(".snippetInput").exists()).to.be.true;
        expect(wrapper.vm.disabled).to.be.true;
        expect(wrapper.find(".snippetInput").element.disabled).to.be.true;
    });

    it("should render the info span", () => {
        wrapper = shallowMount(SnippetInput, {
            propsData: {
                disabled: true,
                label: "foobar",
                info: "Die Info"
            },
            localVue
        });

        expect(wrapper.find(".info-text").exists()).to.be.true;
        expect(wrapper.find(".info-text span").element.innerHTML).to.be.equal("Die Info");
    });
});
