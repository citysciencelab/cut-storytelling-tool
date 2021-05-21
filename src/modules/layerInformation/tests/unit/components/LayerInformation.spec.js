import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import LayerInformationComponent from "../../../components/LayerInformation.vue";
import Sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("LayerInformation.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                LayerInformation: {
                    namespaced: true,
                    state: {
                        active: true,
                        metaDataCatalogueId: "2"
                    },
                    mutations: {
                        setMetaDataCatalogueId: () => Sinon.stub()
                    },
                    getters: {
                        active: () => true,
                        metaDataCatalogueId: () => "2",
                        title: () => "",
                        layerInfo: () => "",
                        isVisible: () => false,
                        uniqueIdList: () => [],
                        datePublication: () => null,
                        dateRevision: () => null,
                        downloadLinks: () => null,
                        periodicityKey: () => null,
                        periodicity: () => null,
                        idCounter: () => 0,
                        additionalLayer: () => null,
                        abstractText: () => "Test",
                        noMetadataLoaded: () => "",
                        metaURLs: () => []
                    },
                    actions: {
                        activate: () => Sinon.stub()
                    }
                }
            },
            getters: {
                metaDataCatalogueId: () => "2"
            }
        });
        // store.dispatch("LayerInformation/activate", true);
    });


    it("should have an existing title", () => {
        const wrapper = mount(LayerInformationComponent, {
            store,
            localVue
        });

        expect(wrapper.find(".subtitle")).to.exist;
    });

    it("should have a close button", async () => {
        const wrapper = mount(LayerInformationComponent, {
            store,
            localVue
        });

        expect(wrapper.find(".glyphicon-remove")).to.exist;
    });

    it("should emitted close event if button is clicked", async () => {
        const wrapper = mount(LayerInformationComponent, {
                store,
                localVue
            }),
            button = wrapper.find(".glyphicon-remove");

        expect(button).to.exist;

        await button.trigger("click");
        expect(wrapper.emitted()).to.have.property("close");
        expect(wrapper.emitted().close).to.have.lengthOf(1);
    });

});
