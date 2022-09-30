import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import ToolManagerComponent from "../../../ToolManager.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/ToolManager.vue", () => {
    let store,
        mobile = false,
        wrapper;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    state: {
                        Draw: {
                            renderToWindow: false
                        },
                        ScaleSwitcher: {
                            renderToWindow: true
                        }
                    },
                    getters: {
                        componentMap: () => {
                            return {
                                ScaleSwitcher: {
                                    key: "scaleSwitcher"
                                },
                                Draw: {
                                    key: "draw"
                                }
                            };
                        },
                        configuredTools: () => [
                            {
                                component: {
                                    name: "ScaleSwitcher",
                                    template: "<span />"
                                },
                                configPath: "configJson.Portalconfig.menu.scaleSwitcher",
                                key: "scaleSwitcher"
                            },
                            {
                                component: {
                                    name: "Draw",
                                    template: "<span />"
                                },
                                configPath: "configJson.Portalconfig.menu.draw",
                                key: "draw"
                            }
                        ]
                    },
                    mutations: {
                        setConfiguredTools: sinon.stub()
                    },
                    actions: {
                        addToolNameAndIconToModelList: sinon.stub(),
                        pushAttributesToStoreElements: sinon.stub(),
                        setToolActiveByConfig: sinon.stub()
                    }
                }
            },
            getters: {
                menuConfig: () => {
                    return {
                        tools: {
                            children: {
                                scaleSwitcher: {
                                    id: "scaleSwitcher"
                                },
                                draw: {
                                    id: "draw"
                                }
                            }
                        }
                    };
                },
                mobile: () => mobile
            }
        });
    });

    it("renders the ToolManager", () => {
        wrapper = shallowMount(ToolManagerComponent, {store, localVue});

        expect(wrapper.find(".tool-manager").exists()).to.be.true;
    });

    it("renders one tool in sidebar and one in window", () => {
        wrapper = shallowMount(ToolManagerComponent, {store, localVue});

        expect(wrapper.vm.toolsInSidebar).to.deep.equals({
            ScaleSwitcher: false,
            Draw: true
        });
    });

    it("renders all tools in window in mobile mode", () => {
        mobile = true;
        wrapper = shallowMount(ToolManagerComponent, {store, localVue});

        expect(wrapper.vm.toolsInSidebar).to.deep.equals({
            ScaleSwitcher: false,
            Draw: false
        });
    });
});
