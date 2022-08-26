import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import RoutingDistanceDisplayComponent from "../../../components/RoutingDistanceDisplay.vue";
import mutations from "../../../store/mutationsRouting";
import actions from "../../../store/actionsRouting";
import getters from "../../../store/gettersRouting";
import state from "../../../store/stateRouting";
import Directions from "../../../store/directions/indexDirections";
import Isochrones from "../../../store/isochrones/indexIsochrones";
import thousandsSeparator from "../../../../../../utils/thousandsSeparator";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/routing/components/RoutingDistanceDisplay.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        routing:
                            {
                                "name": "translate#common:menu.tools.routing",
                                "icon": "bi-signpost-2-fill",
                                "renderToWindow": true
                            }
                    }
                }
            }
        }
    };
    let store,
        wrapper,
        props;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        Routing:
                        {
                            namespaced: true,
                            modules: {
                                Directions,
                                Isochrones
                            },
                            state: {...state},
                            mutations,
                            actions,
                            getters
                        }
                    }
                },
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: sinon.stub()
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });

        props = {
            distance: 1
        };
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders RoutingDistanceDisplayComponent", () => {
        wrapper = shallowMount(RoutingDistanceDisplayComponent, {
            store,
            localVue,
            propsData: props
        });
        expect(wrapper.find("span").exists()).to.be.true;
    });

    it("renders distance in m", () => {
        props.distance = 999;
        wrapper = shallowMount(RoutingDistanceDisplayComponent, {
            store,
            localVue,
            propsData: props
        });
        expect(wrapper.find("span").text()).equal("999 m");
    });

    it("renders distance in km", () => {
        props.distance = 1234;
        wrapper = shallowMount(RoutingDistanceDisplayComponent, {
            store,
            localVue,
            propsData: props
        });
        const expectedResult = thousandsSeparator(1.2);

        expect(wrapper.find("span").text()).equal(`${expectedResult} km`);
    });
});
