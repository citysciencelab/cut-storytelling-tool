import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import * as crs from "masterportalAPI/src/crs";
import CoordToolkitComponent from "../../../components/CoordToolkit.vue";
import CoordToolkit from "../../../store/indexCoordToolkit";

const localVue = createLocalVue(),
    namedProjections = [
        ["EPSG:31467", "+title=Bessel/Gauß-Krüger 3 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs"],
        ["EPSG:25832", "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
        ["EPSG:8395", "+title=ETRS89/Gauß-Krüger 3 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=GRS80 +datum=GRS80 +units=m +no_defs"],
        ["EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"]
    ];

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/coordToolkit/components/CoordToolkit.vue", () => {
    const mockMapGetters = {
            map: () => sinon.stub(),
            projection: () => sinon.stub(),
            mouseCoord: () => sinon.stub()
        },
        mockMapMarkerActions = {
            removePointMarker: sinon.stub()
        },
        mockMapActions = {
            addPointerMoveHandler: sinon.stub(),
            removePointerMoveHandler: sinon.stub(),
            removeInteraction: sinon.stub(),
            addInteraction: sinon.stub()
        },
        mockMapMutations = {
        },
        mockConfigJson = {
            Portalconfig: {
                menu: {
                    tools: {
                        children: {
                            coordToolkit:
                            {
                                "name": "translate#common:menu.tools.coordToolkit",
                                "glyphicon": "glyphicon-globe"
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
                        CoordToolkit
                    }
                },
                Map: {
                    namespaced: true,
                    getters: mockMapGetters,
                    mutations: mockMapMutations,
                    actions: mockMapActions
                },
                MapMarker: {
                    namespaced: true,
                    actions: mockMapMarkerActions
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
        crs.registerProjections(namedProjections);
    });

    it("renders CoordToolkit", () => {
        store.commit("Tools/CoordToolkit/setActive", true);
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.true;
    });

    it("not renders CoordToolkit", () => {
        store.commit("Tools/CoordToolkit/setActive", false);
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.false;
    });

    it("has initially selected projection \"EPSG:25832\"", async () => {
        let options = null,
            selected = null;

        store.commit("Tools/CoordToolkit/setActive", true);
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        await wrapper.vm.$nextTick();

        options = wrapper.findAll("option");
        expect(options.length).to.equal(namedProjections.length + 1);

        selected = options.filter(o => o.attributes().selected === "true");
        expect(selected.length).to.equal(1);
        expect(selected.at(0).attributes().value).to.equal("EPSG:25832");
    });
    describe("CoordToolkit.vue methods", () => {
        it("close sets active to false", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

            wrapper.vm.close();
            await wrapper.vm.$nextTick();

            expect(store.state.Tools.CoordToolkit.active).to.be.false;
            expect(wrapper.find("#supply-coord").exists()).to.be.false;
        });
        it("method selectionChanged sets currentSelection", () => {
            const value = "EPSG:25832",
                event = {
                    target: {
                        value: value
                    }
                };

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(event);
            expect(store.state.Tools.CoordToolkit.currentSelection).to.be.equals(value);
            expect(store.state.Tools.CoordToolkit.currentProjection.name).to.be.equals(value);
            expect(store.state.Tools.CoordToolkit.coordinatesEasting.value).to.be.equals("0.00");
            expect(store.state.Tools.CoordToolkit.coordinatesNorthing.value).to.be.equals("0.00");

        });
        it("createInteraction sets projections and adds interaction", () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(store.state.Tools.CoordToolkit.selectPointerMove).to.be.null;
            wrapper.vm.createInteraction();
            expect(typeof store.state.Tools.CoordToolkit.selectPointerMove).to.be.equals("object");
            expect(typeof store.state.Tools.CoordToolkit.selectPointerMove.handleMoveEvent).to.be.equals("function");
        });
        it("removeInteraction removes interaction", () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(typeof store.state.Tools.CoordToolkit.selectPointerMove).to.be.equals("object");
            wrapper.vm.removeInteraction();
            expect(store.state.Tools.CoordToolkit.selectPointerMove).to.be.null;
        });
        it("label returns correct path", () => {
            const key = "key";
            let ret = "";

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            store.commit("Tools/CoordToolkit/setActive", true);
            store.commit("Tools/CoordToolkit/setCurrentSelection", "EPSG:4326");
            ret = wrapper.vm.getLabel(key);
            expect(ret).to.be.equals("modules.tools.coordToolkit.hdms.key");

            store.commit("Tools/CoordToolkit/setCurrentSelection", "EPSG:31467");
            ret = wrapper.vm.label(key);
            expect(ret).to.be.equals("modules.tools.coordToolkit.cartesian.key");

            store.commit("Tools/CoordToolkit/setCurrentSelection", null);
            ret = wrapper.vm.label(key);
            expect(ret).to.be.equals("modules.tools.coordToolkit.cartesian.key");
        });
    });
    describe("CoordToolkit.vue watcher", () => {
        it("watch to active shall create/remove PointerMove interaction", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

            store.commit("Tools/CoordToolkit/setActive", true);
            await wrapper.vm.$nextTick();
            expect(typeof store.state.Tools.CoordToolkit.selectPointerMove).to.be.equals("object");
            expect(typeof store.state.Tools.CoordToolkit.selectPointerMove.handleMoveEvent).to.be.equals("function");

            store.commit("Tools/CoordToolkit/setActive", false);
            await wrapper.vm.$nextTick();

            expect(store.state.Tools.CoordToolkit.updatePosition).to.be.true;
            expect(store.state.Tools.CoordToolkit.selectPointerMove).to.be.null;
        });
    });
});
