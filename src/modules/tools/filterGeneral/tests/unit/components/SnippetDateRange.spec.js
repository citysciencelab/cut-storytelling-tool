import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetDateRange from "../../../components/SnippetDateRange.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/module/tools/filterGeneral/components/SnippetDateRange.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                type: "dateRange",
                attrName: ["baubeginn", "bauende"],
                operator: "EQ",
                prechecked: ["08.12.2021", "08.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY"
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
        expect(wrapper.find("div").classes("snippetDateRangeContainer")).to.be.true;
    });

    it("should render correctly with prechecked empty", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                type: "dateRange",
                attrName: ["baubeginn", "bauende"],
                operator: "EQ",
                prechecked: [],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY"
            },
            localVue
        });
        expect(wrapper.find(".snippetDateRangeFrom").element.value).to.be.equal("");
        expect(wrapper.find(".snippetDateRangeUntil").element.value).to.be.equal("");
    });

    it("should render correctly with prechecked set", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                type: "dateRange",
                attrName: ["baubeginn", "bauende"],
                operator: "EQ",
                prechecked: ["08.12.2021", "08.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY"
            },
            localVue
        });
        expect(wrapper.find(".snippetDateRangeFrom").element.value).to.be.equal("2021-12-08");
        expect(wrapper.find(".snippetDateRangeUntil").element.value).to.be.equal("2021-12-08");
    });

    it("should render with pre set min and max values", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                type: "dateRange",
                attrName: ["baubeginn", "bauende"],
                operator: "EQ",
                prechecked: ["08.12.2021", "08.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY",
                minValue: "01.12.2021",
                maxValue: "10.12.2021"
            },
            localVue
        });

        const snippetFrom = wrapper.find(".snippetDateRangeFrom").element,
            snippetUntil = wrapper.find(".snippetDateRangeUntil").element;

        expect(wrapper.find("div").classes("snippetDateRangeContainer")).to.be.true;
        expect(snippetFrom.min).to.be.equal("2021-12-01");
        expect(snippetUntil.min).to.be.equal("2021-12-01");
        expect(snippetFrom.max).to.be.equal("2021-12-10");
        expect(snippetUntil.max).to.be.equal("2021-12-10");
    });

    it("should render snippet with min values in 'from' and max values in 'until' snippet", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                type: "dateRange",
                attrName: "baubeginn",
                operator: "EQ",
                prechecked: ["08.12.2021", "08.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY",
                minValue: "01.12.2021",
                maxValue: "10.12.2021"
            },
            localVue
        });

        const snippetFrom = wrapper.find(".snippetDateRangeFrom").element,
            snippetUntil = wrapper.find(".snippetDateRangeUntil").element;

        expect(snippetFrom.min).to.be.equal("2021-12-01");
        expect(snippetUntil.max).to.be.equal("2021-12-10");
    });

    it("date fields should be the same as minValue if prechecked min value is earlier than minValue", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                type: "dateRange",
                attrName: "baubeginn",
                operator: "EQ",
                prechecked: ["01.12.2021", "08.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY",
                minValue: "02.12.2021",
                maxValue: "10.12.2021"
            },
            localVue
        });

        expect(wrapper.vm.minFrom).to.be.equal("2021-12-02");
        expect(wrapper.vm.minUntil).to.be.equal("2021-12-02");
    });

    it("date fields should be the same as maxValue if prechecked max value is later than maxValue", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                type: "dateRange",
                attrName: "baubeginn",
                operator: "EQ",
                prechecked: ["08.12.2021", "09.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY",
                minValue: "01.12.2021",
                maxValue: "08.12.2021"
            },
            localVue
        });

        expect(wrapper.vm.maxFrom).to.be.equal("2021-12-08");
        expect(wrapper.vm.maxUntil).to.be.equal("2021-12-08");
    });

    it("should not render if minValue is higher than max value", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                type: "dateRange",
                attrName: ["baubeginn", "bauende"],
                operator: "EQ",
                prechecked: ["08.12.2021", "08.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY",
                minValue: "10.12.2021",
                maxValue: "01.12.2021"
            },
            localVue
        });

        expect(wrapper.vm.invalid).to.be.true;
    });

    it("should render but also be disabled", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                disabled: true,
                type: "dateRange",
                attrName: ["baubeginn", "bauende"],
                operator: "EQ",
                prechecked: ["08.12.2021", "08.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY"
            },
            localVue
        });
        expect(wrapper.find(".snippetDateRangeFrom").exists()).to.be.true;
        expect(wrapper.find(".snippetDateRangeUntil").exists()).to.be.true;
        expect(wrapper.vm.disabled).to.be.true;

    });

    it("should render and be enabaled", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                disabled: false,
                type: "dateRange",
                attrName: ["baubeginn", "bauende"],
                operator: "EQ",
                prechecked: ["08.12.2021", "08.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY"
            },
            localVue
        });
        expect(wrapper.find(".snippetDateRangeFrom").exists()).to.be.true;
        expect(wrapper.find(".snippetDateRangeUntil").exists()).to.be.true;
        expect(wrapper.vm.disable).to.be.false;
        expect(wrapper.vm.disabled).to.be.false;
    });

    it("should render the info span", () => {
        wrapper = shallowMount(SnippetDateRange, {
            propsData: {
                disabled: false,
                type: "dateRange",
                attrName: ["baubeginn", "bauende"],
                operator: "EQ",
                prechecked: ["08.12.2021", "08.12.2021"],
                label: "Date Slider",
                visible: true,
                format: "DD.MM.YYYY",
                info: "Die Info"
            },
            localVue
        });
        expect(wrapper.find(".info-text").exists()).to.be.true;
        expect(wrapper.find(".info-text span").element.innerHTML).to.be.equal("Die Info");
    });
});
