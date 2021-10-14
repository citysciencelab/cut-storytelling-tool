import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import PrintComponent from "../../../components/Print.vue";
import Print from "../../../store/indexPrint";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("tools/Print/components/Print.vue", () => {
    const scales = ["1000", "5000", "10000"],
        mockMapGetters = {
            scales: () => scales,
            scale: sinon.stub(),
            getView: sinon.stub()
        },
        mockMapActions = {
            setResolutionByIndex: sinon.stub()
        },
        mockMapMutations = {
            setScale: sinon.stub()
        },
        mockGfiGetters = {
            currentFeature: () => sinon.stub()
        };
    let store,
        wrapper;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        Print,
                        Gfi: {
                            namespaced: true,
                            getters: mockGfiGetters
                        }
                    }
                },
                Map: {
                    namespaced: true,
                    mutations: mockMapMutations,
                    getters: mockMapGetters,
                    actions: mockMapActions
                }
            },
            getters: {
                printSettings: () => ""
            }
        });

        store.commit("Tools/Print/setActive", true);

        wrapper = mount(PrintComponent, {store, localVue});
    });

    describe("template", () => {
        it("should have an existing title", () => {
            expect(wrapper.find("#printToolNew")).to.exist;
        });

        it("should have a close button", () => {
            expect(wrapper.find(".glyphicon-remove")).to.exist;
        });

        it("should emitted close event if button is clicked", async () => {
            const button = wrapper.find(".glyphicon-remove");

            expect(button).to.exist;

            button.trigger("click");
            expect(wrapper.emitted()).to.have.property("close");
            expect(wrapper.emitted().close).to.have.lengthOf(1);
        });

        it("should have a dropdown for layouts", () => {
            expect(wrapper.find("#printLayout").exists()).to.be.true;
        });
        it("should have a dropdown for formats", () => {
            expect(wrapper.find("#printFormat").exists()).to.be.true;
        });
        it("should have a dropdown for scales", () => {
            expect(wrapper.find("#printScale").exists()).to.be.true;
        });
    });

    describe("returnScale", () => {
        it("should return an empty string if anything but a number is given", () => {
            expect(wrapper.vm.returnScale(undefined)).to.be.a("string").and.to.be.empty;
            expect(wrapper.vm.returnScale(null)).to.be.a("string").and.to.be.empty;
            expect(wrapper.vm.returnScale("string")).to.be.a("string").and.to.be.empty;
            expect(wrapper.vm.returnScale(true)).to.be.a("string").and.to.be.empty;
            expect(wrapper.vm.returnScale(false)).to.be.a("string").and.to.be.empty;
            expect(wrapper.vm.returnScale([])).to.be.a("string").and.to.be.empty;
            expect(wrapper.vm.returnScale({})).to.be.a("string").and.to.be.empty;
        });
        it("should return the given scale untouched if any number below 10.000 is given", () => {
            expect(wrapper.vm.returnScale(9999)).to.equal("9999");
            expect(wrapper.vm.returnScale(1)).to.equal("1");
            expect(wrapper.vm.returnScale(0)).to.equal("0");
            expect(wrapper.vm.returnScale(-1)).to.equal("-1");
            expect(wrapper.vm.returnScale(-999999)).to.equal("-999999");
        });
        it("should return the given scale with spaces as thousands separators if any number above 9.999 is given", () => {
            expect(wrapper.vm.returnScale(10000)).to.equal("10 000");
            expect(wrapper.vm.returnScale(999999)).to.equal("999 999");
            expect(wrapper.vm.returnScale(1000000)).to.equal("1 000 000");
        });
    });
});
