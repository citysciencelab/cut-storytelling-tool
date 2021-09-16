import Vuex from "vuex";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import ExportButtonCSV from "../../../components/ExportButtonCSV.vue";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("src/share-components/exportButton/components/exportButtonCSV.vue", () => {
    describe("createFilename", () => {
        const wrapper = shallowMount(ExportButtonCSV, {
            propsData: {},
            localVue
        });

        expect(wrapper.vm.createFilename("prefix", "YYYY")).to.equal("prefix" + String(new Date().getFullYear()) + ".csv");
    });
    describe("template", () => {
        const wrapper = shallowMount(ExportButtonCSV, {
            propsData: {},
            localVue
        });

        expect(wrapper.find("button").exists()).to.be.true;
    });
});
