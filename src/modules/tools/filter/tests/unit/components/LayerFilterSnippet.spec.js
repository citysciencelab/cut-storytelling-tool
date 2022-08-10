import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import LayerFilterSnippet from "../../../components/LayerFilterSnippet.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filter/components/LayerFilterSnippet.vue", () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallowMount(LayerFilterSnippet, {
            propsData: {
                layerConfig: {
                    service: {
                        type: "something external"
                    }
                }
            },
            localVue
        });
    });
    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    describe("hasThisSnippetTheExpectedType", () => {
        it("should return false if the given snippet has not the expected type", () => {
            expect(wrapper.vm.hasThisSnippetTheExpectedType(undefined)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType(null)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType(1234)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType("string")).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType(true)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType(false)).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType([])).to.be.false;
            expect(wrapper.vm.hasThisSnippetTheExpectedType({})).to.be.false;

            expect(wrapper.vm.hasThisSnippetTheExpectedType({type: "anything"}, "something")).to.be.false;
        });
        it("should return true if the given snippet has the expected type", () => {
            expect(wrapper.vm.hasThisSnippetTheExpectedType({type: "something"}, "something")).to.be.true;
        });
    });
    describe("setSearchInMapExtent", () => {
        it("should set the internal searchInMapExtent variable to the given value", () => {
            expect(wrapper.vm.searchInMapExtent).to.be.false;
            wrapper.vm.setSearchInMapExtent(true);
            expect(wrapper.vm.searchInMapExtent).to.be.true;
        });
    });
    describe("changeRule", () => {
        it("should emit the updateRules event", async () => {
            wrapper.vm.changeRule({
                snippetId: 0,
                startup: false,
                fixed: false,
                attrName: "test",
                operator: "EQ"
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().updateRules).to.be.an("array").with.lengthOf(1);
        });
    });
    describe("deleteRule", () => {
        it("should emit the update function", async () => {
            wrapper.vm.deleteRule(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().updateRules).to.be.an("array").with.lengthOf(1);
        });
    });
    describe("hasUnfixedRules", () => {
        it("should return false if there are no rules with fixed=false", () => {
            const rules = {
                snippetId: 1,
                startup: false,
                fixed: true,
                attrName: "test",
                operator: "EQ"
            };

            expect(wrapper.vm.hasUnfixedRules(rules)).to.be.false;
        });
        it("should return true if there are rules with fixed=false in the rules", () => {
            const rules = [
                {
                    snippetId: 1,
                    startup: false,
                    fixed: true,
                    attrName: "test",
                    operator: "EQ"
                },
                {
                    snippetId: 0,
                    startup: false,
                    fixed: false,
                    attrName: "test",
                    operator: "EQ"
                }
            ];

            expect(wrapper.vm.hasUnfixedRules(rules)).to.be.true;
        });
    });
    describe("getTitle", () => {
        it("should return true if title is true", () => {
            expect(wrapper.vm.getTitle(true), 1).to.be.true;
        });
        it("should return the title if title is set", () => {
            expect(wrapper.vm.getTitle({title: "title"}, 1)).to.be.equal("title");
        });
        it("should return true if title is not set", () => {
            expect(wrapper.vm.getTitle({}, 1)).to.be.true;
        });
    });
    describe("getTagTitle", () => {
        it("should return value if there is no tagTitle defined", () => {
            expect(wrapper.vm.getTagTitle({value: "title"})).to.equal("title");
            expect(wrapper.vm.getTagTitle({value: false})).to.equal("false");
            expect(wrapper.vm.getTagTitle({value: 0})).to.equal("0");
            expect(wrapper.vm.getTagTitle({value: undefined})).to.equal("undefined");
            expect(wrapper.vm.getTagTitle({value: null})).to.equal("null");
        });
        it("should return tagTitle if there is tagTitle defined", () => {
            expect(wrapper.vm.getTagTitle({value: "title", tagTitle: "tagTitle"})).to.equal("tagTitle");
            expect(wrapper.vm.getTagTitle({value: "title", tagTitle: false})).to.equal("false");
            expect(wrapper.vm.getTagTitle({value: "title", tagTitle: 0})).to.equal("0");
            expect(wrapper.vm.getTagTitle({value: "title", tagTitle: null})).to.equal("null");
        });
    });
    describe("getDownloadHandlerCSV", () => {
        it("should hand over an empty array if filteredItems is anything but an array", () => {
            let last_result = false;
            const dummy = {
                handler: result => {
                    last_result = result;
                }
            };

            wrapper.vm.filteredItems = undefined;
            wrapper.vm.getDownloadHandlerCSV(dummy.handler);
            expect(last_result).to.be.an("array").that.is.empty;
        });
        it("should hand over an empty array if filteredItems is an array but has no objects in it", () => {
            let last_result = false;
            const dummy = {
                handler: result => {
                    last_result = result;
                }
            };

            wrapper.vm.filteredItems = [undefined, null, 1234, "string", true, false, []];
            wrapper.vm.getDownloadHandlerCSV(dummy.handler);
            expect(last_result).to.be.an("array").that.is.empty;
        });
        it("should hand over an empty array if filteredItems is an array with objects but without getProperties function", () => {
            let last_result = false;
            const dummy = {
                handler: result => {
                    last_result = result;
                }
            };

            wrapper.vm.filteredItems = [{
                notGetProperties: () => false
            }];
            wrapper.vm.getDownloadHandlerCSV(dummy.handler);
            expect(last_result).to.be.an("array").that.is.empty;
        });
        it("should hand over an array of properties", () => {
            let last_result = false;
            const dummy = {
                    handler: result => {
                        last_result = result;
                    }
                },
                expected = [
                    {a: 1, b: 2},
                    {a: 3, b: 4},
                    {a: 5, b: 6},
                    {a: 7, b: 8}
                ];

            wrapper.vm.filteredItems = [
                {getProperties: () => {
                    return {a: 1, b: 2};
                }},
                {getProperties: () => {
                    return {a: 3, b: 4};
                }},
                {getProperties: () => {
                    return {a: 5, b: 6};
                }},
                {getProperties: () => {
                    return {a: 7, b: 8};
                }}
            ];
            wrapper.vm.getDownloadHandlerCSV(dummy.handler);
            expect(last_result).to.deep.equal(expected);
        });
        it("should hand over an array of properties, excluding the geometry", () => {
            let last_result = false;
            const dummy = {
                    handler: result => {
                        last_result = result;
                    }
                },
                expected = [
                    {a: 1},
                    {a: 3},
                    {a: 5},
                    {a: 7}
                ];

            wrapper.vm.filteredItems = [
                {getProperties: () => {
                    return {a: 1, b: 2};
                }, getGeometryName: () => "b"},
                {getProperties: () => {
                    return {a: 3, b: 4};
                }, getGeometryName: () => "b"},
                {getProperties: () => {
                    return {a: 5, b: 6};
                }, getGeometryName: () => "b"},
                {getProperties: () => {
                    return {a: 7, b: 8};
                }, getGeometryName: () => "b"}
            ];
            wrapper.vm.getDownloadHandlerCSV(dummy.handler);
            expect(last_result).to.deep.equal(expected);
        });
    });
});
