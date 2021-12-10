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

    it("should render select", () => {
        expect(wrapper.find("select").exists()).to.be.true;
    });

    it("should render selectbox", () => {
        expect(wrapper.find("#selectbox").exists()).to.be.true;
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

        expect(wrapper.find(".snippetDropdownLabel").exists()).to.be.true;
    });

    it("should render correctly if multiselect is false", () => {
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
        expect(wrapper.find(".singleClass").exists()).to.be.true;
    });

    it("should render correctly if multiselect is true", () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                operator: "EQ",
                placeholder: "Text eingeben",
                visible: true,
                multiselect: true,
                value: [1, 2]
            },
            localVue
        });
        expect(wrapper.find(".multipleClass").exists()).to.be.true;
    });

    it("should be the first option element selected", async () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                operator: "EQ",
                visible: true,
                multiselect: false,
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.findAll("option").at(0).element.selected).to.be.true;
    });

    it("should render label", () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                label: "foobar",
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });
        expect(wrapper.find(".snippetDropdownLabel").text()).to.be.equal("foobar:");
    });

    it("Options should have two items", async () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                operator: "EQ",
                visible: true,
                multiselect: false,
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.findAll("option")).to.have.lengthOf(2);
    });

    it("Options should have 'First Opt' as first item", async () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                operator: "EQ",
                visible: true,
                multiselect: false,
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.findAll("option").at(0).text()).to.be.equal("First Opt");
    });

    it("Options should have 'Second Opt' as second item", async () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                operator: "EQ",
                visible: true,
                multiselect: false,
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.findAll("option").at(1).text()).to.be.equal("Second Opt");
    });

    it("the value of the select element should be equal to the value of the first option element", async () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                operator: "EQ",
                visible: true,
                multiselect: false,
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });

        await wrapper.vm.$nextTick();

        const optionValue = wrapper.findAll("option").at(0).element.value;

        expect(wrapper.find("select").element.value).to.equal(optionValue);
    });

    it("should change the value of the select element to the value of the first option element", async () => {
        wrapper = shallowMount(SnippetDropdown, {
            propsData: {
                operator: "EQ",
                visible: true,
                multiselect: false,
                value: ["First Opt", "Second Opt"]
            },
            localVue
        });

        await wrapper.vm.$nextTick();
        const options = wrapper.find("select").findAll("option");

        await options.at(0).setSelected();

        expect(wrapper.find("select").element.value).to.equal("First Opt");
    });
});
