import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";

import Field from "../../../components/Field.vue";
import Literal from "../../../components/Literal.vue";
import WfsSearchModule from "../../../store/indexWfsSearch";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/wfsSearch/components/Literal.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        WfsSearch: WfsSearchModule
                    }
                }
            }
        });
    });

    it("renders a field when literal has field", () => {
        const wrapper = shallowMount(Literal, {
            localVue,
            store,
            propsData: {
                literal: {
                    field: "test"
                }
            }
        });

        expect(wrapper.findComponent(Field).exists()).to.be.true;
    });

    it("renders more literals when literal has clause", () => {
        const wrapper = shallowMount(Literal, {
            localVue,
            store,
            propsData: {
                literal: {
                    clause: {
                        literals: [
                            {literal: "test"},
                            {literal: "test"},
                            {literal: "test"}
                        ]
                    }
                }
            }
        });

        // 4 includes the main literal itself and the 3 children above
        expect(wrapper.findAllComponents(Literal).length).to.equal(4);

        // child fields are not rendered due to shallow mounting
        expect(wrapper.findComponent(Field).exists()).to.be.false;
    });

    it("renders nothing on empty literal", () => {
        const wrapper = shallowMount(Literal, {
            localVue,
            store,
            propsData: {
                literal: {}
            }
        });

        expect(wrapper.find("div").exists()).to.be.false;
        expect(wrapper.findComponent(Field).exists()).to.be.false;
        // only the literal itself
        expect(wrapper.findAllComponents(Literal).length).to.equal(1);
    });
});
