import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetSliderRange from "../../../components/SnippetSliderRange.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filter/components/SnippetSliderRange.vue", () => {
    describe("constructor", () => {
        it("should have correct default values", () => {
            const wrapper = shallowMount(SnippetSliderRange, {localVue});

            expect(wrapper.vm.api).to.be.null;
            expect(wrapper.vm.decimalPlaces).to.equal(0);
            expect(wrapper.vm.info).to.be.false;
            expect(wrapper.vm.title).to.be.true;
            expect(wrapper.vm.minValue).to.be.undefined;
            expect(wrapper.vm.maxValue).to.be.undefined;
            expect(wrapper.vm.operator).to.be.undefined;
            expect(wrapper.vm.prechecked).to.be.undefined;
            expect(wrapper.vm.snippetId).to.equal(0);
            expect(wrapper.vm.visible).to.be.true;
            wrapper.destroy();
        });
        it("should render correctly with default values", () => {
            const wrapper = shallowMount(SnippetSliderRange, {localVue});

            expect(wrapper.find(".slider-range-min").exists()).to.be.true;
            expect(wrapper.find(".slider-range-max").exists()).to.be.true;
            wrapper.destroy();
        });
        it("should render the component with set min and max values if configured", async () => {
            const wrapper = await shallowMount(SnippetSliderRange, {
                propsData: {
                    minValue: 10,
                    maxValue: 1000,
                    prechecked: [50, 500]
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(wrapper.find(".slider-range-min").element.min).equals("10");
            expect(wrapper.find(".slider-range-min").element.max).equals("1000");
            expect(wrapper.find(".slider-range-min").element.value).equals("50");

            expect(wrapper.find(".slider-range-max").element.min).equals("10");
            expect(wrapper.find(".slider-range-max").element.max).equals("1000");
            expect(wrapper.find(".slider-range-max").element.value).equals("500");

            expect(wrapper.find(".slider-input-min").element.min).equals("10");
            expect(wrapper.find(".slider-input-min").element.max).equals("1000");
            expect(wrapper.find(".slider-input-min").element.value).equals("50");

            expect(wrapper.find(".slider-input-max").element.min).equals("10");
            expect(wrapper.find(".slider-input-max").element.max).equals("1000");
            expect(wrapper.find(".slider-input-max").element.value).equals("500");
            wrapper.destroy();
        });
        it.skip("should set slider value by input text", async () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                    propsData: {
                        minValue: 20,
                        maxValue: 100
                    },
                    localVue
                }),
                textInput = wrapper.find(".slider-input-min");

            await textInput.setValue("30");
            expect(wrapper.find(".slider-input-min").element.value).to.equal("30");
            expect(wrapper.find(".slider-range-min").element.value).to.equal("30");

            await textInput.setValue("50");
            expect(wrapper.find(".slider-input-min").element.value).to.equal("50");
            expect(wrapper.find(".slider-range-min").element.value).to.equal("50");

            await textInput.setValue("500");
            expect(wrapper.find(".slider-input-min").element.value).to.equal("100");
            expect(wrapper.find(".slider-range-min").element.value).to.equal("100");

            await textInput.setValue("10");
            expect(wrapper.find(".slider-input-min").element.value).to.equal("20");
            expect(wrapper.find(".slider-range-min").element.value).to.equal("20");
            wrapper.destroy();
        });
        it.skip("should set input value by slider", async () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                    propsData: {
                        minValue: 20,
                        maxValue: 100
                    },
                    localVue
                }),
                sliderInput = wrapper.find(".slider-range-min");

            await sliderInput.setValue("30");
            expect(wrapper.find(".slider-range-min").element.value).to.equal("30");
            expect(wrapper.find(".slider-input-min").element.value).to.equal("30");

            await sliderInput.setValue("50");
            expect(wrapper.find(".slider-range-min").element.value).to.equal("50");
            expect(wrapper.find(".slider-input-min").element.value).to.equal("50");

            await sliderInput.setValue("500");
            expect(wrapper.find(".slider-range-min").element.value).to.equal("100");
            expect(wrapper.find(".slider-input-min").element.value).to.equal("100");

            await sliderInput.setValue("10");
            expect(wrapper.find(".slider-range-min").element.value).to.equal("20");
            expect(wrapper.find(".slider-input-min").element.value).to.equal("20");

            wrapper.destroy();
        });
        it("should render hidden if visible is false", () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    visible: false
                },
                localVue
            });

            expect(wrapper.find(".snippetSliderRangeContainer").element.style._values.display).to.be.equal("none");
            wrapper.destroy();
        });
        it("should render but also be disabled", () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    disabled: true
                },
                localVue
            });

            expect(wrapper.find(".slider-input-min").exists()).to.be.true;
            expect(wrapper.find(".slider-input-max").exists()).to.be.true;
            expect(wrapper.find(".slider-range-min").exists()).to.be.true;
            expect(wrapper.find(".slider-range-max").exists()).to.be.true;
            expect(wrapper.vm.disabled).to.be.true;
            wrapper.destroy();
        });
        it("should render with a title if the title is a string", () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    title: "foobar"
                },
                localVue
            });

            expect(wrapper.find(".snippetSliderRangeLabel").text()).to.be.equal("foobar");
            wrapper.destroy();
        });
        it("should render without a title if title is a boolean and false", () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    title: false
                },
                localVue
            });

            expect(wrapper.find(".snippetSliderRangeLabel").exists()).to.be.false;
            wrapper.destroy();
        });
        it("should not render the info button if info is a boolean and false", () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    info: false
                },
                localVue
            });

            expect(wrapper.find(".info-icon").exists()).to.be.false;
            wrapper.destroy();
        });
        it("should set both minimumValue and maximumValue from properties if given", async () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    minValue: 1,
                    maxValue: 3
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(wrapper.vm.minimumValue).to.equal(1);
            expect(wrapper.vm.maximumValue).to.equal(3);
            expect(wrapper.vm.value).to.deep.equal([1, 3]);
            wrapper.destroy();
        });
        it("should set both minimumValue and maximumValue from properties and value from prechecked if given", async () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    minValue: 1,
                    maxValue: 3,
                    prechecked: [2, 2]
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(wrapper.vm.minimumValue).to.equal(1);
            expect(wrapper.vm.maximumValue).to.equal(3);
            expect(wrapper.vm.value).to.deep.equal([2, 2]);
            wrapper.destroy();
        });
        it("should ask the api for minimumValue or maximumValue if minValue and maxValue are not given", async () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    api: {
                        getMinMax (attrName, onsuccess) {
                            onsuccess({
                                min: 10,
                                max: 12
                            });
                        }
                    }
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(wrapper.vm.minimumValue).to.equal(10);
            expect(wrapper.vm.maximumValue).to.equal(12);
            expect(wrapper.vm.value).to.deep.equal([10, 12]);
            wrapper.destroy();
        });
        it("should ask the api for minimumValue if minValue is not given", async () => {
            let lastMinOnly = false,
                lastMaxOnly = false;
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    maxValue: 22,
                    api: {
                        getMinMax (attrName, onsuccess, onerror, minOnly, maxOnly) {
                            lastMinOnly = minOnly;
                            lastMaxOnly = maxOnly;
                            onsuccess({
                                min: 20
                            });
                        }
                    }
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(lastMinOnly).to.be.true;
            expect(lastMaxOnly).to.be.false;
            expect(wrapper.vm.minimumValue).to.equal(20);
            expect(wrapper.vm.maximumValue).to.equal(22);
            expect(wrapper.vm.value).to.deep.equal([20, 22]);
            wrapper.destroy();
        });
        it("should ask the api for maximumValue if maxValue is not given", async () => {
            let lastMinOnly = false,
                lastMaxOnly = false;
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    minValue: 30,
                    api: {
                        getMinMax (attrName, onsuccess, onerror, minOnly, maxOnly) {
                            lastMinOnly = minOnly;
                            lastMaxOnly = maxOnly;
                            onsuccess({
                                max: 32
                            });
                        }
                    }
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(lastMinOnly).to.be.false;
            expect(lastMaxOnly).to.be.true;
            expect(wrapper.vm.minimumValue).to.equal(30);
            expect(wrapper.vm.maximumValue).to.equal(32);
            expect(wrapper.vm.value).to.deep.equal([30, 32]);
            wrapper.destroy();
        });
        it("should not emit the current rule on startup, if no prechecked is given", async () => {
            const wrapper = await shallowMount(SnippetSliderRange, {
                propsData: {
                    minValue: 40,
                    maxValue: 42
                },
                localVue
            });

            expect(wrapper.emitted("deleteRule")).to.be.undefined;
            wrapper.destroy();
        });
        it("should not use the given operator if an invalid operator is given", () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    operator: "operator"
                },
                localVue
            });

            expect(wrapper.vm.securedOperator).to.not.be.equal("operator");
        });
    });

    describe("emitCurrentRule", () => {
        it("should emit changeRule function with the expected values", () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    snippetId: 1234,
                    visible: false,
                    attrName: "attrName",
                    operator: "BETWEEN"
                },
                localVue
            });

            wrapper.vm.emitCurrentRule("value", "startup");
            expect(wrapper.emitted("changeRule")).to.be.an("array").and.to.have.lengthOf(1);
            expect(wrapper.emitted("changeRule")[0]).to.be.an("array").and.to.have.lengthOf(1);
            expect(wrapper.emitted("changeRule")[0][0]).to.deep.equal({
                snippetId: 1234,
                startup: "startup",
                fixed: true,
                attrName: "attrName",
                operator: "BETWEEN",
                value: "value"
            });
            wrapper.destroy();
        });
    });

    describe("deleteCurrentRule", () => {
        it("should emit deleteRule function with its snippetId", () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    snippetId: 1234
                },
                localVue
            });

            wrapper.vm.deleteCurrentRule();
            expect(wrapper.emitted("deleteRule")).to.be.an("array").and.to.have.lengthOf(1);
            expect(wrapper.emitted("deleteRule")[0]).to.be.an("array").and.to.have.lengthOf(1);
            expect(wrapper.emitted("deleteRule")[0][0]).to.equal(1234);
            wrapper.destroy();
        });
    });

    describe("resetSnippet", () => {
        it("should reset the snippet value and call the given onsuccess handler", async () => {
            const wrapper = shallowMount(SnippetSliderRange, {
                propsData: {
                    minValue: 10,
                    maxValue: 90,
                    prechecked: [40, 50]
                },
                localVue
            });
            let called = false;

            await wrapper.vm.$nextTick();
            expect(wrapper.vm.value).to.deep.equal([40, 50]);
            await wrapper.vm.resetSnippet(() => {
                called = true;
            });
            expect(wrapper.vm.value).to.deep.equal([10, 90]);
            expect(called).to.be.true;
            wrapper.destroy();
        });
    });

    describe("getSliderSteps", () => {
        it("should return the steps the slider should have based on the configured decimal places", () => {
            const wrapper = shallowMount(SnippetSliderRange, {localVue});

            expect(wrapper.vm.getSliderSteps(-2)).to.equal(100);
            expect(wrapper.vm.getSliderSteps(-1)).to.equal(10);
            expect(wrapper.vm.getSliderSteps(0)).to.equal(1);
            expect(wrapper.vm.getSliderSteps(1)).to.equal(0.1);
            expect(wrapper.vm.getSliderSteps(2)).to.equal(0.01);

            wrapper.destroy();
        });
    });
});
