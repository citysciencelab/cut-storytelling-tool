import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetDateRange from "../../../components/SnippetDateRange.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/module/tools/filter/components/SnippetDateRange.vue", () => {
    describe("constructor", () => {
        it("should have correct default values", () => {
            const wrapper = shallowMount(SnippetDateRange, {localVue});

            expect(wrapper.vm.api).to.be.null;
            expect(wrapper.vm.info).to.be.false;
            expect(wrapper.vm.format).to.equal("YYYY-MM-DD");
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
            const wrapper = shallowMount(SnippetDateRange, {localVue});

            expect(wrapper.find("div").classes("snippetDateRangeContainer")).to.be.true;
            wrapper.destroy();
        });
        it("should render correctly with prechecked as set value", async () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM",
                    prechecked: ["24_2021_07", "24_2021_12"]
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(wrapper.find(".snippetDateRangeFrom").element.value).to.be.equal("2021-07-24");
            expect(wrapper.find(".snippetDateRangeUntil").element.value).to.be.equal("2021-12-24");
        });
        it("should render hidden if visible is false", () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    visible: false
                },
                localVue
            });

            expect(wrapper.find(".snippetDateRangeContainer").element.style._values.display).to.be.equal("none");
            wrapper.destroy();
        });
        it("should render but also be disabled", () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    disabled: true
                },
                localVue
            });

            expect(wrapper.find(".snippetDateRangeFrom").exists()).to.be.true;
            expect(wrapper.find(".snippetDateRangeUntil").exists()).to.be.true;
            expect(wrapper.vm.disabled).to.be.true;
            wrapper.destroy();
        });
        it("should render with a title if the title is a string", () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    title: "foobar"
                },
                localVue
            });

            expect(wrapper.find(".snippetDateRangeLabel").text()).to.be.equal("foobar");
            wrapper.destroy();
        });
        it("should render without a title if title is a boolean and false", () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    title: false
                },
                localVue
            });

            expect(wrapper.find(".snippetDateRangeLabel").exists()).to.be.false;
            wrapper.destroy();
        });
        it("should set both minimumValue and maximumValue from properties if given", async () => {
            const wrapper = await shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM",
                    minValue: "24_2021_12",
                    maxValue: "24_2022_12"
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(wrapper.vm.minimumValue).to.equal("2021-12-24");
            expect(wrapper.vm.maximumValue).to.equal("2022-12-24");
            expect(wrapper.vm.value).to.deep.equal(["", ""]);
            wrapper.destroy();
        });
        it("should set both minimumValue and maximumValue from properties and value from prechecked if given", async () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM",
                    minValue: "24_2021_12",
                    maxValue: "24_2022_12",
                    prechecked: ["24_2022_07", "24_2022_09"]
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(wrapper.vm.minimumValue).to.equal("2021-12-24");
            expect(wrapper.vm.maximumValue).to.equal("2022-12-24");
            expect(wrapper.vm.value).to.deep.equal(["2022-07-24", "2022-09-24"]);
            wrapper.destroy();
        });
        it("should ask the api for minimumValue or maximumValue if minValue and maxValue are not given", async () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM",
                    api: {
                        getMinMax (attrName, onsuccess) {
                            onsuccess({
                                min: "24_2021_12",
                                max: "24_2022_12"
                            });
                        }
                    }
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(wrapper.vm.minimumValue).to.equal("2021-12-24");
            expect(wrapper.vm.maximumValue).to.equal("2022-12-24");
            expect(wrapper.vm.value).to.deep.equal(["2021-12-24", "2022-12-24"]);
            wrapper.destroy();
        });
        it("should ask the api for minimumValue if minValue is not given", async () => {
            let lastMinOnly = false,
                lastMaxOnly = false;
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM",
                    maxValue: "24_2022_12",
                    api: {
                        getMinMax (attrName, onsuccess, onerror, minOnly, maxOnly) {
                            lastMinOnly = minOnly;
                            lastMaxOnly = maxOnly;
                            onsuccess({
                                min: "24_2021_12"
                            });
                        }
                    }
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(lastMinOnly).to.be.true;
            expect(lastMaxOnly).to.be.false;
            expect(wrapper.vm.minimumValue).to.equal("2021-12-24");
            expect(wrapper.vm.maximumValue).to.equal("2022-12-24");
            expect(wrapper.vm.value).to.deep.equal(["2021-12-24", "2022-12-24"]);
            wrapper.destroy();
        });
        it("should ask the api for maximumValue if maxValue is not given", async () => {
            let lastMinOnly = false,
                lastMaxOnly = false;
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM",
                    minValue: "24_2021_12",
                    api: {
                        getMinMax (attrName, onsuccess, onerror, minOnly, maxOnly) {
                            lastMinOnly = minOnly;
                            lastMaxOnly = maxOnly;
                            onsuccess({
                                max: "24_2022_12"
                            });
                        }
                    }
                },
                localVue
            });

            await wrapper.vm.$nextTick();
            expect(lastMinOnly).to.be.false;
            expect(lastMaxOnly).to.be.true;
            expect(wrapper.vm.minimumValue).to.equal("2021-12-24");
            expect(wrapper.vm.maximumValue).to.equal("2022-12-24");
            expect(wrapper.vm.value).to.deep.equal(["2021-12-24", "2022-12-24"]);
            wrapper.destroy();
        });
        it("should not emit the current rule on startup, if no prechecked is given", async () => {
            const wrapper = await shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM",
                    minValue: "24_2021_12",
                    maxValue: "24_2022_12"
                },
                localVue
            });

            expect(wrapper.emitted("deleteRule")).to.be.undefined;
            wrapper.destroy();
        });
        it("should not use the given operator if an invalid operator is given", () => {
            const wrapper = shallowMount(SnippetDateRange, {
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
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    snippetId: 1234,
                    visible: false,
                    attrName: "attrName",
                    operator: "INTERSECTS",
                    format: "format"
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
                operator: "INTERSECTS",
                format: "format",
                value: "value"
            });
            wrapper.destroy();
        });
    });

    describe("deleteCurrentRule", () => {
        it("should emit deleteRule function with its snippetId", () => {
            const wrapper = shallowMount(SnippetDateRange, {
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
        it("should reset the snippet value to prechecked if prechecked is set", async () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM",
                    prechecked: ["24_2021_07", "24_2021_12"]
                },
                localVue
            });
            let called = false;

            await wrapper.vm.$nextTick();
            expect(wrapper.vm.value).to.deep.equal(["2021-07-24", "2021-12-24"]);
            await wrapper.vm.resetSnippet(() => {
                called = true;
            });

            expect(wrapper.vm.value).to.deep.equal(["2021-07-24", "2021-12-24"]);
            expect(called).to.be.true;
            wrapper.destroy();
        });
        it("should reset the snippet to value of minimum and maximum if they are set", async () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM",
                    minValue: "24_2021_07",
                    maxValue: "24_2021_12"
                },
                localVue
            });
            let called = false;


            await wrapper.vm.$nextTick();
            wrapper.vm.inRangeValueLeft = "2020-01-01";
            wrapper.vm.inRangeValueRight = "2020-01-01";
            await wrapper.vm.resetSnippet(() => {
                called = true;
            });
            expect(wrapper.vm.value).to.deep.equal(["2021-07-24", "2021-12-24"]);
            expect(called).to.be.true;
            wrapper.destroy();
        });
        it("should reset the snippet value and call the given onsuccess handler", async () => {
            const wrapper = shallowMount(SnippetDateRange, {
                propsData: {
                    format: "DD_YYYY_MM"
                },
                localVue
            });
            let called = false;

            await wrapper.vm.resetSnippet(() => {
                called = true;
            });
            expect(wrapper.vm.value).to.deep.equal(["", ""]);
            expect(called).to.be.true;
            wrapper.destroy();
        });
    });
});
