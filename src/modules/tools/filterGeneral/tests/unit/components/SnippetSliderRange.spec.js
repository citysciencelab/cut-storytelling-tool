import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetSliderRangeComponent from "../../../components/SnippetSliderRange.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filterGeneral/components/SnippetSliderRange.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                attrName: "bezirk_id",
                decimalStep: 1,
                disabled: false,
                label: "SliderRange",
                minValue: 0,
                maxValue: 1000,
                operator: "BETWEEN",
                prechecked: [400, 500],
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

    it("should set the minOnly", () => {
        expect(wrapper.vm.minOnly).to.be.false;
    });

    it("should set the maxOnly", () => {
        expect(wrapper.vm.maxOnly).to.be.false;
    });

    it("should set the invalid", () => {
        expect(wrapper.vm.invalid).to.be.false;
    });

    it("should render the component", () => {
        expect(wrapper.find("label").exists()).to.be.true;
        expect(wrapper.find("label").text()).equals("SliderRange");

        expect(wrapper.find(".slider-range-min").exists()).to.be.true;
        expect(wrapper.find(".slider-input-min").element.value).equals("400");

        expect(wrapper.find(".slider-range-max").exists()).to.be.true;
        expect(wrapper.find(".slider-input-max").element.value).equals("500");

        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                decimalStep: 1,
                disabled: false,
                minValue: 0,
                maxValue: 1000,
                prechecked: [400, 500]
            },
            localVue
        });

        expect(wrapper.find(".slider-input-min").element.value).equals("400");
        expect(wrapper.find(".slider-range-min").element.value).equals("400");

        expect(wrapper.find(".slider-input-max").element.value).equals("500");
        expect(wrapper.find(".slider-range-max").element.value).equals("500");
    });

    it("should get a valid step value", () => {
        expect(wrapper.vm.getStep(1)).equals(1);
        expect(wrapper.vm.getStep(0)).equals(1);
        expect(wrapper.vm.getStep("")).equals(1);
        expect(wrapper.vm.getStep(null)).equals(1);
        expect(wrapper.vm.getStep(undefined)).equals(1);
        expect(wrapper.vm.getStep([])).equals(1);
        expect(wrapper.vm.getStep({})).equals(1);
        expect(wrapper.vm.getStep(1.2)).equals(1.2);
    });

    it("should get the value in range", () => {
        expect(wrapper.vm.getValueInRange(40, false)).equals(40);
        expect(wrapper.vm.getValueInRange(80.6, false)).equals(80.6);
        expect(wrapper.vm.getValueInRange(0, false)).equals(0);
        expect(wrapper.vm.getValueInRange(1000, false)).equals(1000);

        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                minValue: 20,
                maxValue: 100
            },
            localVue
        });

        expect(wrapper.vm.getValueInRange(40, false)).equals(40);
        expect(wrapper.vm.getValueInRange(80.6, false)).equals(80.6);
        expect(wrapper.vm.getValueInRange(60, false)).equals(60);
        expect(wrapper.vm.getValueInRange(100, false)).equals(100);
    });

    it("should get the value without range as minimum value", () => {
        expect(wrapper.vm.getValueInRange(-10, false)).equals(0);
        expect(wrapper.vm.getValueInRange(-20, false)).equals(0);
        expect(wrapper.vm.getValueInRange(-20.5, false)).equals(0);

        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                minValue: 20,
                maxValue: 100
            },
            localVue
        });

        expect(wrapper.vm.getValueInRange(10, false)).equals(20);
        expect(wrapper.vm.getValueInRange(10.6, false)).equals(20);
        expect(wrapper.vm.getValueInRange(0, false)).equals(20);
        expect(wrapper.vm.getValueInRange(-100, false)).equals(20);
    });

    it("should get the value without range as maximum value", () => {
        expect(wrapper.vm.getValueInRange(1010, false)).equals(1000);
        expect(wrapper.vm.getValueInRange(1011, false)).equals(1000);
        expect(wrapper.vm.getValueInRange(1000.5, false)).equals(1000);


        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                minValue: 20,
                maxValue: 100
            },
            localVue
        });

        expect(wrapper.vm.getValueInRange(1010, false)).equals(100);
        expect(wrapper.vm.getValueInRange(1011, false)).equals(100);
        expect(wrapper.vm.getValueInRange(1000.5, false)).equals(100);
    });

    it("should set value from input text max", async () => {
        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                minValue: 0,
                disabled: false,
                maxValue: 100
            },
            localVue
        });
        const textInput = wrapper.find(".slider-input-max");

        textInput.setValue("50");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-input-max").element.value).equals("50");

        textInput.setValue("500");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-input-max").element.value).equals("50");

        textInput.setValue("5000");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-input-max").element.value).equals("50");

        textInput.setValue("-1000");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-input-max").element.value).equals("50");
    });

    it("should set value from input text min", async () => {
        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                minValue: 0,
                disabled: false,
                maxValue: 100
            },
            localVue
        });

        const textInput = wrapper.find(".slider-input-min");

        textInput.setValue("50");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-input-min").element.value).equals("50");

        textInput.setValue("500");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-input-min").element.value).equals("50");

        textInput.setValue("5000");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-input-min").element.value).equals("50");

        textInput.setValue("-1000");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-input-min").element.value).equals("50");

    });

    it("should set prechecked correctly at min and max slider", () => {
        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                decimalStep: 1,
                minValue: 0,
                maxValue: 1000,
                prechecked: [400, 500]
            },
            localVue
        });
        expect(wrapper.find(".slider-range-min").element.value).equals("400");
        expect(wrapper.find(".slider-range-max").element.value).equals("500");
    });

    it("should set value from slider max", async () => {
        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                minValue: 0,
                maxValue: 100
            },
            localVue
        });
        const sliderInput = wrapper.find(".slider-range-max");

        await sliderInput.setValue("50");
        expect(wrapper.find(".slider-range-max").element.value).equals("50");

        await sliderInput.setValue("500");
        expect(wrapper.find(".slider-range-max").element.value).equals("100");

        await sliderInput.setValue("5000");
        expect(wrapper.find(".slider-range-max").element.value).equals("100");

        await sliderInput.setValue("-1000");
        expect(wrapper.find(".slider-range-max").element.value).equals("0");
    });

    it("should render the info span", () => {
        wrapper = shallowMount(SnippetSliderRangeComponent, {
            propsData: {
                minValue: 0,
                maxValue: 100,
                info: "Die Info"
            },
            localVue
        });
        expect(wrapper.find(".info-text").exists()).to.be.true;
        expect(wrapper.find(".info-text span").element.innerHTML).to.be.equal("Die Info");
    });
});
