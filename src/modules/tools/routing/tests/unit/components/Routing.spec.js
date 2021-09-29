import Vuex from "vuex";
import {expect} from "chai";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import RoutingComponent from "../../../components/Routing.vue";
import Routing from "../../../store/indexRouting";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/routing/components/Routing.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        routing:
                            {
                                "name": "translate#common:menu.tools.routing",
                                "glyphicon": "glyphicon-road",
                                "renderToWindow": true
                            }
                    }
                }
            }
        }
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
                        Routing
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
        store.commit("Tools/Routing/setActive", true);
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders Routing", () => {
        store.commit("Tools/Routing/setActive", true);
        wrapper = shallowMount(RoutingComponent, {store, localVue});
        expect(wrapper.find("#routing").exists()).to.be.true;
    });

    it("not renders Routing", () => {
        store.commit("Tools/Routing/setActive", false);
        wrapper = shallowMount(RoutingComponent, {store, localVue});

        expect(wrapper.find("#routing").exists()).to.be.false;
    });

    describe("Routing.vue methods", () => {
        it("close sets active to false", async () => {
            wrapper = shallowMount(RoutingComponent, {store, localVue});
            wrapper.vm.close();
            await wrapper.vm.$nextTick();

            expect(store.state.Tools.Routing.active).to.be.false;
            expect(wrapper.find("#routing").exists()).to.be.false;
        });
    });
});
