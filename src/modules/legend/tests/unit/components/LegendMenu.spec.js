import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import LegendMenuComponent from "../../../components/LegendMenu.vue";
import Legend from "../../../store/indexLegend";
import {expect} from "chai";
import sinon from "sinon";

const localVue = createLocalVue();


localVue.use(Vuex);
config.mocks.$t = key => key;

describe("LegendMenu.vue", () => {
    const mockConfigJson = {
            Portalconfig: {
                menu: {
                    legend: {
                        name: "common:modules.legend.name",
                        icon: "bi-lightbulb",
                        showCollapseAllButton: true
                    }
                }
            }
        },
        getters = {
            mobile: state => state.mobile,
            uiStyle: sinon.stub()
        },
        mutations = {
            setMobile (state, mobile) {
                state.mobile = mobile;
            }
        },
        oldDomContent = document.body.innerHTML,
        mobileDom = `
    <div>
        <div id="root">
                <div>
                    <span name="legend" style=""></span>
                </div> 
                <div>
                    <span name="nextSibling"></span>
                </div>
        </div>
    </div>
    `;
    let store,
        wrapper;

    beforeEach(() => {
        // Mock a DOM to play around
        document.body.innerHTML = `
        <div>
            <div id="root">
                <div >
                    <div>
                        <span name="legend" style=""></span>
                    </div> 
                    <div>
                        <span name="nextSibling"></span>
                    </div>
                </div>
            </div>
        </div>
        `;
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Legend
            },
            state: {
                configJson: mockConfigJson,
                mobile: false
            },
            getters,
            mutations
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
        document.body.innerHTML = oldDomContent;
    });

    describe("LegendMenu.vue rendering", () => {
        it("renders the legend in Menu", () => {
            wrapper = shallowMount(LegendMenuComponent, {store, localVue});

            expect(wrapper.find("#legend-menu").exists()).to.be.true;
        });
        it("renders the legend in mobile view", () => {
            document.body.innerHTML = mobileDom;
            store.commit("setMobile", true);
            wrapper = shallowMount(LegendMenuComponent, {store, localVue});

            expect(wrapper.find("#legend-menu.mobile").exists()).to.be.true;
        });
    });
    describe("LegendMenu.vue methods", () => {
        it("toggleLegend", () => {
            wrapper = shallowMount(LegendMenuComponent, {store, localVue});

            store.state.Legend.showLegend = false;
            wrapper.vm.toggleLegend();
            expect(store.state.Legend.showLegend).to.be.equals(true);
        });
        it("replaceMenuChild mobile", () => {
            let root = null,
                hiddenLegendEntry = null,
                legendMenu = null;

            document.body.innerHTML = mobileDom;
            store.commit("setMobile", true);
            wrapper = shallowMount(LegendMenuComponent, {store, localVue});
            wrapper.vm.replaceMenuChild();

            root = document.getElementById("root");
            hiddenLegendEntry = root.querySelector("[name=legend]");
            legendMenu = document.getElementById("legend-menu");

            expect(hiddenLegendEntry).to.be.instanceof(Object);
            expect(hiddenLegendEntry.parentNode.style.display).to.equals("none");
            expect(legendMenu).to.be.instanceof(Object);
        });
        it("replaceMenuChild desktop", () => {
            let legendMenues = null;

            wrapper = shallowMount(LegendMenuComponent, {store, localVue});
            wrapper.vm.replaceMenuChild();
            legendMenues = document.getElementsByClassName("menuitem");

            expect(legendMenues.length).to.be.equals(1);
            expect(legendMenues.item(0)).to.be.instanceof(Object);
            expect(legendMenues.item(0).textContent).to.be.equals("common:modules.legend.name");
        });
    });
});
