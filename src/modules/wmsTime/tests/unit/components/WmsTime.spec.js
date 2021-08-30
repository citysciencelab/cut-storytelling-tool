import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";

import WmsTime from "../../../components/WmsTime.vue";
import LayerSwiper from "../../../components/LayerSwiper.vue";
import TimeSlider from "../../../components/TimeSlider.vue";
import WmsTimeModule from "../../../store/indexWmsTime";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/wmsTime/components/WmsTime.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {WmsTime: WmsTimeModule}
        });
        store.commit("WmsTime/setTimeSliderActive", {active: true});
    });

    afterEach(() => {
        window.innerWidth = 1024;
        store.commit("WmsTime/setWindowWidth");
        store.commit("WmsTime/setTimeSliderActive", {active: false});
        store.commit("WmsTime/setLayerSwiperActive", false);
    });

    it("render one TimeSlider component if it is active and the layerSwiper is inactive", () => {
        const wrapper = shallowMount(WmsTime, {localVue, store});

        expect(wrapper.findAllComponents(TimeSlider).length).to.equal(1);
        expect(wrapper.findComponent(LayerSwiper).exists()).to.be.false;
    });
    it("render two TimeSlider component and a LayerSwiper component if the timeSlider is active, the layerSwiper is active and the window has a minWidth of 800px", () => {
        store.commit("WmsTime/setLayerSwiperActive", true);
        const wrapper = shallowMount(WmsTime, {localVue, store}),
            timeSliderComponents = wrapper.findAllComponents(TimeSlider);

        expect(timeSliderComponents.length).to.equal(2);
        expect(timeSliderComponents.at(0).element.className).to.equal("moveLeft");
        expect(timeSliderComponents.at(1).element.className).to.equal("moveRight");
        expect(wrapper.findComponent(LayerSwiper).exists()).to.be.true;
    });
    it("should only render one TimeSlider component and no LayerSwiper component if the window size is smaller than the minWidth of 800px", () => {
        store.commit("WmsTime/setLayerSwiperActive", true);
        window.innerWidth = 799;
        store.commit("WmsTime/setWindowWidth");
        const wrapper = shallowMount(WmsTime, {localVue, store});

        expect(wrapper.findAllComponents(TimeSlider).length).to.equal(1);
        expect(wrapper.findComponent(LayerSwiper).exists()).to.be.false;
    });
});
