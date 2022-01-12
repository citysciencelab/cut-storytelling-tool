import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetSliderComponent from "../../../components/SnippetSlider.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filterGeneral/components/SnippetSlider.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(SnippetSliderComponent, {
            propsData: {
                attrName: "bezirk_id",
                decimalStep: 0.1,
                label: "Slider",
                minValue: 0,
                maxValue: 1000,
                operator: "EQ",
                prechecked: 30,
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
        expect(wrapper.find("label").text()).equals("Slider");

        expect(wrapper.find(".input-single").exists()).to.be.true;
        expect(wrapper.find(".input-single").element.value).equals("30");

        expect(wrapper.find(".slider-single").exists()).to.be.true;
        expect(wrapper.find(".slider-single").element.value).equals("30");

        wrapper = shallowMount(SnippetSliderComponent, {
            propsData: {
                minValue: 0,
                maxValue: 1000,
                prechecked: 50
            },
            localVue
        });

        expect(wrapper.find(".input-single").element.value).equals("50");
        expect(wrapper.find(".slider-single").element.value).equals("50");
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

        wrapper = shallowMount(SnippetSliderComponent, {
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

        wrapper = shallowMount(SnippetSliderComponent, {
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

        wrapper = shallowMount(SnippetSliderComponent, {
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

    it("should set value from input text", async () => {
        wrapper = shallowMount(SnippetSliderComponent, {
            propsData: {
                minValue: 20,
                maxValue: 100
            },
            localVue
        });

        const textInput = wrapper.find(".input-single");

        textInput.setValue("50");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-single").element.value).equals("50");

        textInput.setValue("500");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-single").element.value).equals("50");

        textInput.setValue("5000");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-single").element.value).equals("50");

        textInput.setValue("-1000");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-single").element.value).equals("50");

        textInput.setValue("");
        await textInput.trigger("blur");
        expect(wrapper.find(".slider-single").element.value).equals("50");
    });

    it("should set value from slider", async () => {
        wrapper = shallowMount(SnippetSliderComponent, {
            propsData: {
                minValue: 20,
                maxValue: 100
            },
            localVue
        });

        const sliderInput = wrapper.find(".slider-single");

        await sliderInput.setValue("50");
        expect(wrapper.find(".input-single").element.value).equals("50");

        await sliderInput.setValue("80");
        expect(wrapper.find(".input-single").element.value).equals("80");

        await sliderInput.setValue("90");
        expect(wrapper.find(".input-single").element.value).equals("90");

        await sliderInput.setValue("100");
        expect(wrapper.find(".input-single").element.value).equals("100");
    });

    it("should render but also be disabled", () => {
        wrapper = shallowMount(SnippetSliderComponent, {
            propsData: {
                disabled: true,
                minValue: 20,
                maxValue: 100
            },
            localVue
        });
        expect(wrapper.find(".input-single").exists()).to.be.true;
        expect(wrapper.find(".slider-single").exists()).to.be.true;
        expect(wrapper.vm.disabled).to.be.true;
    });

    it("should render and be enabaled", () => {
        wrapper = shallowMount(SnippetSliderComponent, {
            propsData: {
                disabled: false,
                minValue: 20,
                maxValue: 100
            },
            localVue
        });
        expect(wrapper.find(".input-single").exists()).to.be.true;
        expect(wrapper.find(".slider-single").exists()).to.be.true;
        expect(wrapper.vm.disable).to.be.false;
        expect(wrapper.vm.disabled).to.be.false;
    });

    it("should render the info span", () => {
        wrapper = shallowMount(SnippetSliderComponent, {
            propsData: {
                disabled: false,
                minValue: 20,
                maxValue: 100,
                info: "Die Info"
            },
            localVue
        });
        expect(wrapper.find(".info-text").exists()).to.be.true;
        expect(wrapper.find(".info-text span").element.innerHTML).to.be.equal("Die Info");
    });
});
