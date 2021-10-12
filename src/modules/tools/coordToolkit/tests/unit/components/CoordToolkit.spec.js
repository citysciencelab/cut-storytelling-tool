import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import * as crs from "masterportalAPI/src/crs";
import CoordToolkitComponent from "../../../components/CoordToolkit.vue";
import CoordToolkit from "../../../store/indexCoordToolkit";
import {MapMode} from "../../../../../map/store/enums";

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
            mouseCoord: () => sinon.stub(),
            mapMode: () => MapMode.MODE_2D
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
        CoordToolkit.actions.copyToClipboard = sinon.spy(CoordToolkit.actions.copyToClipboard);
        CoordToolkit.actions.validateInput = sinon.spy(CoordToolkit.actions.validateInput);
        CoordToolkit.actions.initHeightLayer = sinon.spy(CoordToolkit.actions.initHeightLayer);

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
            actions: {
                copyToClipboard: sinon.spy()
            },
            getters: {
                uiStyle: () => ""
            },
            state: {
                configJson: mockConfigJson
            }
        });
        crs.registerProjections(namedProjections);
    });

    it("renders CoordToolkit without height field", () => {
        store.commit("Tools/CoordToolkit/setActive", true);
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.true;
        expect(wrapper.find("#coordinatesHeightField").exists()).to.be.false;
        expect(CoordToolkit.actions.initHeightLayer.calledOnce).to.be.false;
    });

    it("not renders CoordToolkit", () => {
        store.commit("Tools/CoordToolkit/setActive", false);
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.false;
    });
    it("renders CoordToolkit with height field", () => {
        const layer = {id: "123", get: () => sinon.spy};

        store.commit("Tools/CoordToolkit/setActive", true);
        store.state.configJson.Portalconfig.menu.tools.children.coordToolkit.heightLayerId = "123";
        store.state.Tools.CoordToolkit.heightLayer = layer;
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

        expect(wrapper.find("#coord-toolkit").exists()).to.be.true;
        expect(wrapper.find("#coordinatesHeightField").exists()).to.be.true;
    });
    it("CoordToolkit mounting with heightLayerId shall call initHeightLayer", async () => {
        store.state.configJson.Portalconfig.menu.tools.children.coordToolkit.heightLayerId = "123";
        store.state.Tools.CoordToolkit.heightLayerId = "123";
        wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
        await wrapper.vm.$nextTick();

        expect(CoordToolkit.actions.initHeightLayer.calledOnce).to.be.true;
        store.state.Tools.CoordToolkit.heightLayerId = null;
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
            expect(store.state.Tools.CoordToolkit.active).to.be.true;
            wrapper.vm.close();
            await wrapper.vm.$nextTick();

            expect(store.state.Tools.CoordToolkit.active).to.be.false;
            expect(wrapper.find("#supply-coord").exists()).to.be.false;
        });
        it("method selectionChanged sets currentProjection", () => {
            const value = "EPSG:31467",
                event = {
                    target: {
                        value: value
                    }
                };

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(event);
            expect(store.state.Tools.CoordToolkit.currentProjection.name).to.be.equals(value);
            expect(store.state.Tools.CoordToolkit.currentProjection.projName).to.be.equals("tmerc");
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
        it("setSupplyCoordInactive removes interaction", () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(typeof store.state.Tools.CoordToolkit.selectPointerMove).to.be.equals("object");
            wrapper.vm.setSupplyCoordInactive();
            expect(store.state.Tools.CoordToolkit.selectPointerMove).to.be.null;
        });
        it("setSupplyCoordActive adds interaction", () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(store.state.Tools.CoordToolkit.selectPointerMove).to.be.null;
            wrapper.vm.setSupplyCoordActive();
            expect(typeof store.state.Tools.CoordToolkit.selectPointerMove).to.be.equals("object");
        });
        it("initProjections adds WGS84 decimal projection", () => {
            let projections = [];

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.initProjections();

            projections = store.state.Tools.CoordToolkit.projections;
            expect(projections.length).to.be.equals(5);
            expect(projections[0].id).to.be.not.null;
            expect(projections.filter(proj => proj.id === "EPSG:4326-DG").length).to.be.equals(1);
        });
        it("label returns correct path", () => {
            const key = "key";
            let value = "EPSG:4326",
                event = {
                    target: {
                        value: value
                    }
                },
                ret = "";

            store.commit("Tools/CoordToolkit/setActive", true);
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            wrapper.vm.selectionChanged(event);

            ret = wrapper.vm.getLabel(key);
            expect(ret).to.be.equals("modules.tools.coordToolkit.hdms.key");

            value = "EPSG:31467";
            event = {
                target: {
                    value: value
                }
            };
            wrapper.vm.selectionChanged(event);
            ret = wrapper.vm.getLabel(key);
            expect(ret).to.be.equals("modules.tools.coordToolkit.cartesian.key");

            value = null;
            event = {
                target: {
                    value: value
                }
            };
            wrapper.vm.selectionChanged(event);
            ret = wrapper.vm.getLabel(key);
            expect(ret).to.be.equals("modules.tools.coordToolkit.cartesian.key");
        });
        it("changeMode changes the mode 'supply' or 'search'", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(store.state.Tools.CoordToolkit.mode).to.be.equals("supply");
            expect(wrapper.vm.isEnabled("supply")).to.be.true;
            wrapper.vm.changeMode("search");
            await wrapper.vm.$nextTick();
            expect(store.state.Tools.CoordToolkit.mode).to.be.equals("search");
            expect(wrapper.vm.isEnabled("search")).to.be.true;
        });
        it("onInputClicked should call copyToClipboard if mode is 'supply'", async () => {
            const value = "EPSG:4326",
                event = {
                    target: {
                        value: value
                    }
                };

            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(store.state.Tools.CoordToolkit.mode).to.be.equals("search");
            wrapper.vm.onInputClicked(event);
            expect(CoordToolkit.actions.copyToClipboard.calledOnce).to.be.false;

            wrapper.vm.changeMode("supply");
            await wrapper.vm.$nextTick();
            expect(store.state.Tools.CoordToolkit.mode).to.be.equals("supply");
            wrapper.vm.onInputClicked(event);
            expect(CoordToolkit.actions.copyToClipboard.calledOnce).to.be.true;
        });
        it("onInputEvent should call validateInput if mode is 'search'", async () => {
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});
            expect(store.state.Tools.CoordToolkit.mode).to.be.equals("supply");
            wrapper.vm.onInputEvent("input");
            expect(CoordToolkit.actions.validateInput.calledOnce).to.be.false;

            wrapper.vm.changeMode("search");
            await wrapper.vm.$nextTick();
            expect(store.state.Tools.CoordToolkit.mode).to.be.equals("search");
            wrapper.vm.onInputEvent("input");
            expect(CoordToolkit.actions.validateInput.calledOnce).to.be.true;
        });
    });
    describe("CoordToolkit.vue watcher", () => {
        it("watch to active shall set mode to 'supply'", async () => {
            store.commit("Tools/CoordToolkit/setActive", false);
            wrapper = shallowMount(CoordToolkitComponent, {store, localVue});

            store.commit("Tools/CoordToolkit/setActive", true);
            await wrapper.vm.$nextTick();
            expect(store.state.Tools.CoordToolkit.mode).to.be.equals("supply");
            expect(typeof store.state.Tools.CoordToolkit.selectPointerMove).to.be.equals("object");
            expect(typeof store.state.Tools.CoordToolkit.selectPointerMove.handleMoveEvent).to.be.equals("function");

            store.commit("Tools/CoordToolkit/setActive", false);
            await wrapper.vm.$nextTick();

            expect(store.state.Tools.CoordToolkit.eastingNoCoord).to.be.false;
            expect(store.state.Tools.CoordToolkit.eastingNoMatch).to.be.false;
            expect(store.state.Tools.CoordToolkit.northingNoCoord).to.be.false;
            expect(store.state.Tools.CoordToolkit.northingNoMatch).to.be.false;
            expect(store.state.Tools.CoordToolkit.coordinatesEasting.value).to.be.equals("");
            expect(store.state.Tools.CoordToolkit.coordinatesNorthing.value).to.be.equals("");
        });
    });
});
