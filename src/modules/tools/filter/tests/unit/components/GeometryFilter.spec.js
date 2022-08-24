import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import GeometryFilter from "../../../components/GeometryFilter.vue";
import {expect} from "chai";
import sinon from "sinon";
import Draw from "ol/interaction/Draw.js";
import {Vector as VectorLayer} from "ol/layer";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/filter/components/GeometryFilter.vue", () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallowMount(GeometryFilter, {
            localVue,
            store: new Vuex.Store({
                namespaced: true,
                modules: {
                    Maps: {
                        namespaced: true,
                        actions: {
                            addInteraction: sinon.stub(),
                            removeInteraction: sinon.stub(),
                            addLayer: sinon.stub()
                        },
                        mutations: {
                            removeLayerFromMap: sinon.stub()
                        }
                    }
                }
            })
        });
    });
    afterEach(() => {
        wrapper.destroy();
    });

    describe("html", () => {
        describe("created", () => {
            it("should render correctly", () => {
                expect(wrapper.find("#geometryFilterChecked").exists()).to.be.true;
                expect(wrapper.find("#geometryFilterHelp").exists()).to.be.true;
                expect(wrapper.find("#geometrySelect").exists()).to.be.false;
                expect(wrapper.find("#inputLineBuffer").exists()).to.be.false;
                expect(wrapper.find("#buttonRemoveGeometry").exists()).to.be.false;
            });
        });
        describe("reactivity", () => {
            it("should show the select box if the checkbox is clicked", async () => {
                await wrapper.find("#geometryFilterChecked").trigger("click");
                expect(wrapper.find("#geometrySelect").exists()).to.be.true;
            });
        });
    });
    describe("methods", () => {
        describe("getGeometries", () => {
            it("should return a specific structure", () => {
                expect(wrapper.vm.getGeometries()).to.deep.equal([
                    {
                        "type": "Polygon",
                        "name": "common:modules.tools.filter.geometryFilter.geometries.polygon"
                    },
                    {
                        "type": "Rectangle",
                        "name": "common:modules.tools.filter.geometryFilter.geometries.rectangle"
                    },
                    {
                        "type": "Circle",
                        "name": "common:modules.tools.filter.geometryFilter.geometries.circle"
                    },
                    {
                        "type": "LineString",
                        "name": "common:modules.tools.filter.geometryFilter.geometries.lineString"
                    }
                ]);
            });
        });
        describe("getSelectedGeometry", () => {
            it("should return the first geometry on startup", () => {
                expect(wrapper.vm.getSelectedGeometry()).to.deep.equal({
                    "type": "Polygon",
                    "name": "common:modules.tools.filter.geometryFilter.geometries.polygon"
                });
            });
            it("should return the second geometry if data.selectedGeometry is set 1", () => {
                wrapper.vm.selectedGeometry = 1;
                expect(wrapper.vm.getSelectedGeometry()).to.deep.equal({
                    "type": "Rectangle",
                    "name": "common:modules.tools.filter.geometryFilter.geometries.rectangle"
                });
            });
            it("should return the third geometry if data.selectedGeometry is set 2", () => {
                wrapper.vm.selectedGeometry = 2;
                expect(wrapper.vm.getSelectedGeometry()).to.deep.equal({
                    "type": "Circle",
                    "name": "common:modules.tools.filter.geometryFilter.geometries.circle"
                });
            });
            it("should return the fourth geometry if data.selectedGeometry is set 3", () => {
                wrapper.vm.selectedGeometry = 3;
                expect(wrapper.vm.getSelectedGeometry()).to.deep.equal({
                    "type": "LineString",
                    "name": "common:modules.tools.filter.geometryFilter.geometries.lineString"
                });
            });
        });
        describe("setDrawInteraction", () => {
            it("should set the draw state", () => {
                wrapper.vm.draw = false;
                wrapper.vm.setDrawInteraction();
                expect(wrapper.vm.draw).to.be.instanceOf(Draw);
            });
        });
        describe("setLayer", () => {
            it("should set the layer", () => {
                wrapper.vm.layer = false;
                wrapper.vm.setLayer();
                expect(wrapper.vm.layer).to.be.instanceOf(VectorLayer);
            });
        });
        describe("removeGeometry", () => {
            it("should set isGeometryVisible to false", () => {
                wrapper.vm.isGeometryVisible = true;
                wrapper.vm.removeGeometry();
                expect(wrapper.vm.isGeometryVisible).to.be.false;
            });
        });
    });
});
