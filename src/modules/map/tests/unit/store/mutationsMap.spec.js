import {expect} from "chai";
import mutations from "../../../store/mutationsMap";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";

const {addLayerToMap, removeLayerFromMap} = mutations;

describe("src/modules/map/store/mutationsMap.js", () => {
    describe("addLayerToMap", () => {
        it("should add a layer to the map", () => {
            const state = {
                    map: new Map()
                },
                layer = new VectorLayer({
                    name: "layer123",
                    source: new VectorSource()
                });

            addLayerToMap(state, layer);

            expect(state.map.getLayers().getLength()).to.equals(1);
            expect(state.map.getLayers().getArray()[0].get("name")).to.equals("layer123");
        });

        it("should only be added if given parameter is a instance of BaseLayer", () => {
            const state = {
                map: new Map()
            };

            addLayerToMap(state, undefined);
            addLayerToMap(state, null);
            addLayerToMap(state, []);
            addLayerToMap(state, {});
            addLayerToMap(state, false);
            addLayerToMap(state, new VectorSource());
            addLayerToMap(state, "Layer");
            expect(state.map.getLayers().getArray()).to.have.lengthOf(0);
        });
    });

    describe("removeLayerFromMap", () => {
        it("should remove a layer from the map", () => {
            const layer = new VectorLayer({
                    source: new VectorSource()
                }),
                state = {
                    map: new Map({
                        layers: [
                            layer
                        ]
                    })
                };

            removeLayerFromMap(state, layer);
            expect(state.map.getLayers().getLength()).to.equals(0);
        });

        it("should only be remove if given parameter is a instance of BaseLayer", () => {
            const layer = new VectorLayer({
                    source: new VectorSource()
                }),
                state = {
                    map: new Map({
                        layers: [layer]
                    })
                };

            removeLayerFromMap(state, undefined);
            removeLayerFromMap(state, null);
            removeLayerFromMap(state, []);
            removeLayerFromMap(state, {});
            removeLayerFromMap(state, false);
            removeLayerFromMap(state, new VectorSource());
            removeLayerFromMap(state, "Layer");
            expect(state.map.getLayers().getArray()).to.have.lengthOf(1);
        });
    });
});
