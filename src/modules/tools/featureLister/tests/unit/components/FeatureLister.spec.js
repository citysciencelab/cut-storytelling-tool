import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import FeatureListerComponent from "../../../components/FeatureLister.vue";
import FeatureLister from "../../../store/indexFeatureLister";
// import VectorLayer from "ol/layer/Vector.js";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/featureLister/components/FeatureLister.vue", () => {
    const mockMapGetters = {
            visibleLayerList: () => [{name: "ersterLayer", id: "123", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point"}, {name: "zweiterLayer", id: "456", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point"}, {name: "dritterLayer", id: "789", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point"}]
        },
        mockConfigJson = {
            Portalconfig: {
                menu: {
                    tools: {
                        children: {
                            featureLister:
                            {
                                "name": "translate#common:menu.tools.featureLister",
                                "glyphicon": "glyphicon-th-list",
                                "renderToWindow": true
                            }
                        }
                    }
                }
            }
        },
        switchTabToSpy = sinon.spy(),
        addMouseEventsSpy = sinon.spy();
    let store,
        wrapper;

    beforeEach(() => {
        FeatureLister.actions.switchTabTo = sinon.spy();
        FeatureLister.actions.addMouseEvents = sinon.spy();

        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        FeatureLister
                    }
                },
                Map: {
                    namespaced: true,
                    getters: mockMapGetters
                }
            },
            state: {
                configJson: mockConfigJson
            },
            actions: {
                switchTabTo: switchTabToSpy,
                addMouseEvents: addMouseEventsSpy
            },
            getters: {
                getHeaders: () => ["name", "id"]
            }
        });
    });

    it("renders list of visible vector layers", () => {
        store.commit("Tools/FeatureLister/setActive", true);
        store.commit("Tools/FeatureLister/setLayerListView", true);
        wrapper = shallowMount(FeatureListerComponent, {store, localVue});

        expect(wrapper.find("#featurelist-themes").exists()).to.be.true;
    });

    // it("renders list of layer features", () => {
    //     const layer1 = new VectorLayer({
    //             name: "ersterLayer", id: "123", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point", values_: [1, 2]
    //         }),
    //         layer2 = new VectorLayer({
    //             name: "ersterLayer", id: "123", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point", values_: [1, 2]
    //         }),
    //         layerList = [layer1, layer2],
    //         layer = {name: "ersterLayer", id: "123", features: [{values_: {features: [1, 2]}}], geometryType: "Point"};

    //     store.commit("Tools/FeatureLister/setVisibleLayers", layerList);
    //     store.dispatch("Tools/FeatureLister/switchToList", layer);
    //     wrapper = shallowMount(FeatureListerComponent, {store, localVue});

    //     expect(wrapper.find("#featurelist-list").exists()).to.be.true;
    // });

    // describe("CompareFeatures.vue methods", () => {
    //     it("close sets active to false", async () => {
    //         wrapper = shallowMount(CompareFeaturesComponent, {store, localVue});

    //         wrapper.vm.close();
    //         await wrapper.vm.$nextTick();

    //         expect(store.state.Tools.CompareFeatures.active).to.be.false;
    //         expect(wrapper.find("#tool-compareFeatures").exists()).to.be.false;
    //     });
    // });
});
