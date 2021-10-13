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
    let store;

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
    });


    it("should have an existing title", () => {
        const wrapper = mount(PrintComponent, {
            store,
            localVue
        });

        expect(wrapper.find("#printToolNew")).to.exist;
    });

    it("should have a close button", () => {
        const wrapper = mount(PrintComponent, {
            store,
            localVue
        });

        expect(wrapper.find(".glyphicon-remove")).to.exist;
    });

    it("should emitted close event if button is clicked", async () => {
        const wrapper = mount(PrintComponent, {
                store,
                localVue
            }),
            button = wrapper.find(".glyphicon-remove");

        expect(button).to.exist;

        await button.trigger("click");
        expect(wrapper.emitted()).to.have.property("close");
        expect(wrapper.emitted().close).to.have.lengthOf(1);
    });

    it("should check if dropdown for layouts exists", () => {
        const wrapper = mount(PrintComponent, {store, localVue});

        expect(wrapper.find("#printLayout").exists()).to.be.false;
    });
    it("should check if dropdown for formats exists", () => {
        const wrapper = mount(PrintComponent, {store, localVue});

        expect(wrapper.find("#printFormat").exists()).to.be.false;
    });
    it("should check if dropdown for scales exists", () => {
        const wrapper = mount(PrintComponent, {store, localVue});

        expect(wrapper.find("#printScale").exists()).to.be.false;
    });

});
