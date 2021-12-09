import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetDateComponent from "../../../components/SnippetDate.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/generalFilter/components/SnippetDate.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                attrName: "baubeginn",
                label: "Baubegin",
                type: "date",
                format: "DD.MM.YYYY",
                operator: "EQ",
                prechecked: "12.12.2021",
                visible: true,
                minValue: "01.01.2021",
                maxValue: "31.12.2021"
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
        expect(wrapper.find("input").classes("snippetDate")).to.be.true;
    });

    it("should set the invalid false", () => {
        expect(wrapper.vm.invalid).to.be.false;
    });

    it("should set the invalid true, if the min date is greater than the max date", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2021",
                label: "Baubegin",
                visible: true,
                minValue: "01.01.2022",
                maxValue: "31.12.2021"
            },
            localVue
        });
        expect(wrapper.vm.invalid).to.be.true;
    });

    it("should set the invalid true, if max date is incorrect", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2021",
                label: "Baubegin",
                visible: true,
                minValue: "31.12.2020",
                maxValue: ""
            },
            localVue
        });
        expect(wrapper.vm.invalid).to.be.true;
    });

    it("should set the invalid true, if min date is incorrect", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2021",
                label: "Baubegin",
                visible: true,
                minValue: "",
                maxValue: "31.12.2020"
            },
            localVue
        });
        expect(wrapper.vm.invalid).to.be.true;
    });

    it("should render correctly with prechecked", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2021",
                label: "Baubegin",
                visible: true,
                minValue: "01.01.2021",
                maxValue: "31.12.2021"
            },
            localVue
        });
        expect(wrapper.find(".snippetDate").element.value).to.be.equal("2021-12-12");
    });

    it("should render correctly with visible as false", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2021",
                label: "Baubegin",
                visible: false,
                minValue: "01.01.2021",
                maxValue: "31.12.2021"
            },
            localVue
        });
        expect(wrapper.find(".snippetDateContainer").element.style._values.display).to.be.equal("none");
    });

    it("should set the min and max with correct format", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2021",
                label: "Baubegin",
                visible: true,
                minValue: "01.01.2021",
                maxValue: "31.12.2021"
            },
            localVue
        });
        expect(wrapper.vm.min).to.be.equal("2021-01-01");
        expect(wrapper.vm.max).to.be.equal("2021-12-31");
    });

    it("should return the max, if the given value is greater than maxValue", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2022",
                label: "Baubegin",
                visible: true,
                minValue: "01.01.2021",
                maxValue: "31.12.2021"
            },
            localVue
        });
        expect(wrapper.vm.getValueInRange("2022-12-12")).to.be.equal("2021-12-31");
    });

    it("should return the min, if the given value is less than minValue", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2022",
                label: "Baubegin",
                visible: true,
                minValue: "01.01.2021",
                maxValue: "31.12.2021"
            },
            localVue
        });
        expect(wrapper.vm.getValueInRange("2020-01-01")).to.be.equal("2021-01-01");
    });

    it("should set the min as prechecked, if prechecked is less than minValue", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2020",
                label: "Baubegin",
                visible: true,
                minValue: "01.01.2021",
                maxValue: "31.12.2021"
            },
            localVue
        });
        expect(wrapper.vm.min).to.be.equal("2021-01-01");
    });

    it("should set the max as prechecked, if prechecked is greater than maxValue", () => {
        wrapper = shallowMount(SnippetDateComponent, {
            propsData: {
                operator: "EQ",
                format: "DD.MM.YYYY",
                prechecked: "12.12.2022",
                label: "Baubegin",
                visible: true,
                minValue: "01.01.2021",
                maxValue: "31.12.2021"
            },
            localVue
        });
        expect(wrapper.vm.max).to.be.equal("2021-12-31");
    });
});
