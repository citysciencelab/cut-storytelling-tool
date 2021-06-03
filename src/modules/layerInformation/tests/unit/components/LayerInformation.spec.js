import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import LayerInformationComponent from "../../../components/LayerInformation.vue";
import sinon from "sinon";

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
                        metaDataCatalogueId: "2",
                        layerInfo: {"metaIdArray": ["123", "456"]}
                    },
                    mutations: {
                        setMetaDataCatalogueId: () => sinon.stub(),
                        setLayerInfo: () => sinon.stub()
                    },
                    getters: {
                        active: () => true,
                        metaDataCatalogueId: () => "2",
                        title: () => "",
                        layerInfo: () => ({"metaIdArray": ["123", "456"], "layerNames": ["name", "name_name"]}),
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
                        activate: () => sinon.stub(),
                        layerInfo: () => sinon.stub()
                    }
                }
            },
            getters: {
                metaDataCatalogueId: () => "2"
            }
        });
        store.dispatch("LayerInformation/layerInfo", {"metaIdArray": ["123", "456"]});
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

    it("should check if dropdown for group layer exists", () => {
        const spyRemoveInteractions = sinon.spy(LayerInformationComponent.methods, "changeLayerAbstract"),
            wrapper = mount(LayerInformationComponent, {store, localVue}),
            dropEntries = wrapper.findAll(".abstractChange");

        expect(wrapper.find("#changeLayerInfo")).to.exist;
        expect(dropEntries.at(1)).to.exist;

        spyRemoveInteractions.restore();
    });

});
