import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import ExportButtonGeoJSON from "../../../components/ExportButtonGeoJSON.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/share-components/exportButton/components/exportButtonGeoJSON.vue", () => {
    before(() => {
        i18next.init({
            lng: "cimode",
            debug: false
        });
    });
    describe("createFilename", () => {
        const wrapper = shallowMount(ExportButtonGeoJSON, {
            propsData: {},
            localVue
        });

        expect(wrapper.vm.createFilename("prefix", "YYYY")).to.equal("prefix" + String(new Date().getFullYear()));
    });
    describe("template", () => {
        const wrapper = shallowMount(ExportButtonGeoJSON, {
            propsData: {},
            localVue
        });

        expect(wrapper.find("button").exists()).to.be.true;
    });
});
