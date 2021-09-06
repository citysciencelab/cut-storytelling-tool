import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import TimeSlider from "../../../components/TimeSlider.vue";
import WmsTimeModule from "../../../store/indexWmsTime";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/wmsTime/components/TimeSlider.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {WmsTime: {...WmsTimeModule, actions: {...WmsTimeModule.actions, updateMap: sinon.spy()}}}
        });
    });

    afterEach(() => {
        window.innerWidth = 1024;
        store.commit("WmsTime/setWindowWidth");
        store.commit("WmsTime/setTimeSliderActive", {active: false});
        store.commit("WmsTime/setLayerSwiperActive", false);
        sinon.restore();
    });

    it("renders the TimeSlider component without the possibility to activate the the LayerSwiper component if window.innerWidth is below 800", () => {
        window.innerWidth = 799;
        store.commit("WmsTime/setWindowWidth");
        store.commit("WmsTime/setTimeSliderActive", {active: true});
        const wrapper = shallowMount(TimeSlider, {localVue, store, propsData: {layerId: "layerId"}});

        expect(wrapper.find(".timeSlider-innerWrapper-interactions").exists()).to.be.true;
        expect(wrapper.find(".timeSlider-innerWrapper-interactions").element.tagName).to.equal("DIV");
        expect(wrapper.find("#timeSlider-button-backward-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-button-backward-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-button-play-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-button-play-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-button-forward-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-button-forward-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-input-range-layerId-label").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-input-range-layerId-label").element.tagName).to.equal("LABEL");
        expect(wrapper.find("#timeSlider-input-range-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-input-range-layerId").element.tagName).to.equal("INPUT");
        expect(wrapper.find(".timeSlider-innerWrapper").exists()).to.be.false;
    });
    it("renders the TimeSlider component with the possibility to activate the the LayerSwiper component and the text to activate it if it is currently inactive", () => {
        window.innerWidth = 801;
        store.commit("WmsTime/setWindowWidth");
        store.commit("WmsTime/setTimeSliderActive", {active: true});
        const wrapper = shallowMount(TimeSlider, {localVue, store, propsData: {layerId: "layerId"}});

        expect(wrapper.find(".timeSlider-innerWrapper-interactions").exists()).to.be.true;
        expect(wrapper.find(".timeSlider-innerWrapper-interactions").element.tagName).to.equal("DIV");
        expect(wrapper.find("#timeSlider-button-backward-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-button-backward-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-button-play-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-button-play-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-button-forward-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-button-forward-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-input-range-layerId-label").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-input-range-layerId-label").element.tagName).to.equal("LABEL");
        expect(wrapper.find("#timeSlider-input-range-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-input-range-layerId").element.tagName).to.equal("INPUT");
        expect(wrapper.find(".timeSlider-innerWrapper").exists()).to.be.true;
        expect(wrapper.find(".timeSlider-innerWrapper").element.tagName).to.equal("DIV");
        expect(wrapper.find("#timeSlider-activate-layerSwiper-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-activate-layerSwiper-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-activate-layerSwiper-layerId").text()).to.equal("common:modules.wmsTime.timeSlider.buttons.layerSwiper");
    });
    it("renders the TimeSlider component with the possibility to activate the the LayerSwiper component and the text to deactivate it if it is currently active", () => {
        window.innerWidth = 801;
        store.commit("WmsTime/setWindowWidth");
        store.commit("WmsTime/setLayerSwiperActive", true);
        store.commit("WmsTime/setTimeSliderActive", {active: true});
        const wrapper = shallowMount(TimeSlider, {localVue, store, propsData: {layerId: "layerId"}});

        expect(wrapper.find(".timeSlider-innerWrapper-interactions").exists()).to.be.true;
        expect(wrapper.find(".timeSlider-innerWrapper-interactions").element.tagName).to.equal("DIV");
        expect(wrapper.find("#timeSlider-button-backward-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-button-backward-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-button-play-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-button-play-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-button-forward-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-button-forward-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-input-range-layerId-label").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-input-range-layerId-label").element.tagName).to.equal("LABEL");
        expect(wrapper.find("#timeSlider-input-range-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-input-range-layerId").element.tagName).to.equal("INPUT");
        expect(wrapper.find(".timeSlider-innerWrapper").exists()).to.be.true;
        expect(wrapper.find(".timeSlider-innerWrapper").element.tagName).to.equal("DIV");
        expect(wrapper.find("#timeSlider-activate-layerSwiper-layerId").exists()).to.be.true;
        expect(wrapper.find("#timeSlider-activate-layerSwiper-layerId").element.tagName).to.equal("BUTTON");
        expect(wrapper.find("#timeSlider-activate-layerSwiper-layerId").text()).to.equal("common:modules.wmsTime.timeSlider.buttons.deactivateLayerSwiper");
    });
});
