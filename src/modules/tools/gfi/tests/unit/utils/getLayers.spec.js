import {expect} from "chai";
import {getVisibleLayersWithGroupLayersChildren, getVisibleWmsLayersAtResolution} from "../../../utils/getLayers";
import Layer from "ol/layer/Layer";
import LayerGroup from "ol/layer/Group";
import mutations from "../../../../../../core/maps/store/mutationsMap";

const {addLayerToMap} = mutations;

describe("src/modules/tools/gfi/utils/getLayers.js", () => {
    describe("getVisibleLayersWithGroupLayersChildren", () => {
        it("returns the getVisibleLayersWithGroupLayersChildren with Group layers", () => {
            const layers = [],
                layer1 = new Layer({visible: true}),
                layer2 = new Layer({visible: true}),
                grouplayer = new LayerGroup({
                    layers: [layer1, layer2]
                });

            layers.push(grouplayer);

            expect(getVisibleLayersWithGroupLayersChildren(layers)).to.be.an("array").that.contains(layer1, layer2);
        });

        it("returns the getVisibleLayersWithGroupLayersChildren without Group layers", () => {
            const layers = [],
                layer1 = {
                    get: () => true,
                    visible: true,
                    getArray: () => [layer1],
                    getVisible: () => true
                };

            layers.push(layer1);

            expect(getVisibleLayersWithGroupLayersChildren(layers)).to.be.an("array").that.contains(layer1);
        });
    });

    describe("getVisibleWmsLayersAtResolution", () => {
        it("returns the getVisibleWmsLayersAtResolution from grouplayer", () => {
            const layers = [],
                map = {
                    id: "ol",
                    mode: "2D",
                    addLayer: (grouplayer) => {
                        layers.push(grouplayer);
                    },
                    getLayers: () => {
                        return grouplayer.getLayers();
                    },
                    getArray: () => [grouplayer]
                },
                layer1 = new Layer({
                    visible: true,
                    typ: "WMS",
                    minResolution: 0.1322915952292052,
                    maxResolution: 66.14579761460263
                }),
                layer2 = new Layer({
                    visible: true,
                    typ: "WFS",
                    minResolution: 0.1322915952292052,
                    maxResolution: 66.14579761460263
                }),
                layer3 = new Layer({
                    visible: true,
                    typ: "WMS",
                    minResolution: 0.1322915952292052,
                    maxResolution: 66.14579761460263
                }),
                grouplayer = new LayerGroup({
                    layers: [layer1, layer2, layer3]
                }),
                state = {
                    mode: "2D"
                };

            mapCollection.clear();
            mapCollection.addMap(map, "2D");
            addLayerToMap(state, grouplayer);

            expect(getVisibleWmsLayersAtResolution(5.2916638091682096)).to.be.an("array").that.contains(layer1, layer3);
        });
    });

});
