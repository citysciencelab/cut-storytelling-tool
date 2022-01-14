import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetDropdown from "../../../components/SnippetDropdown.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filterGeneral/components/SnippetDropdown.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                "type": "dropdown",
                "attrName": "bezirk_id",
                "operator": "EQ",
                "prechecked": [],
                "label": "selectBoxLabel",
                "placeholder": "",
                "addSelectAll": "selectAll",
                "display": "default",
                "renderIcons": "",
                "visible": true,
                "autoInit": true,
                "multiselect": false,
                "value": ["Yek", "DO"]
            },
            localVue
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("should render selectbox", () => {
        expect(wrapper.find("#select-box").exists()).to.be.true;
    });

    it("should render selectbox container", () => {
        expect(wrapper.find(".select-box-container").exists()).to.be.true;
    });

    it("should render hidden if visible is false", () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                operator: "EQ",
                placeholder: "Text eingeben",
                visible: false,
                multiselect: false,
                value: [1, 2]
            },
            localVue
        });

        expect(wrapper.find(".snippetDropdownContainer").element.style._values.display).to.be.equal("none");
    });

    it("should render correctly with snippetDropdownLabel if visible is true", () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                operator: "EQ",
                placeholder: "Text eingeben",
                visible: true,
                multiselect: false,
                value: [1, 2]
            },
            localVue
        });

        expect(wrapper.find(".select-box-label").exists()).to.be.true;
    });

    it("should render label", () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                label: "foobar",
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });
        expect(wrapper.find(".select-box-label").text()).to.be.equal("foobar:");
    });

    it("should render but also be disabled", () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                disabled: true,
                operator: "EQ",
                visible: true,
                multiselect: false,
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });
        expect(wrapper.find("#select-box").exists()).to.be.true;
        expect(wrapper.vm.disabled).to.be.true;

    });

    it("should render and be enabaled", () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                disabled: false,
                operator: "EQ",
                visible: true,
                multiselect: false,
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });
        expect(wrapper.find("#select-box").exists()).to.be.true;
        expect(wrapper.vm.disabled).to.be.false;
    });

    it("should render the info span", () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                disabled: false,
                operator: "EQ",
                visible: true,
                multiselect: false,
                value: ["First Opt", "Second Opt"],
                info: "Die Info"
            },
            localVue
        });
        expect(wrapper.find(".info-text").exists()).to.be.true;
        expect(wrapper.find(".info-text span").element.innerHTML).to.be.equal("Die Info");
    });

});
