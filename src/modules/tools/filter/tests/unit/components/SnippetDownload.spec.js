import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetDownload from "../../../components/SnippetDownload.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filter/components/SnippetDownload.vue", () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallowMount(SnippetDownload, {
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

    describe("getDownloadHandler", () => {
        it("should hand over an empty array if filteredItems is anything but an array", () => {
            let last_result = false;
            const dummy = {
                handler: result => {
                    last_result = result;
                }
            };

            wrapper.vm.filteredItems = undefined;
            wrapper.vm.getDownloadHandler(dummy.handler);
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
            wrapper.vm.getDownloadHandler(dummy.handler);
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
            wrapper.vm.getDownloadHandler(dummy.handler);
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
            wrapper.vm.getDownloadHandler(dummy.handler);
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
            wrapper.vm.getDownloadHandler(dummy.handler);
            expect(last_result).to.deep.equal(expected);
        });
    });
});
