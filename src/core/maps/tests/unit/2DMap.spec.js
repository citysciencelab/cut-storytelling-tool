import "../../2DMap";
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import mapCollection from "../../../../core/dataStorage/mapCollection.js";
import {expect} from "chai";

describe("src/core/maps/2DMap.js", () => {
    const layer1 = new VectorLayer({
            id: "Donald",
            name: "Duck1",
            source: new VectorSource()
        }),
        layer2 = new VectorLayer({
            id: "Dagobert",
            name: "Duck2",
            alwaysOnTop: true,
            source: new VectorSource()
        }),
        layer3 = new VectorLayer({
            id: "Darkwing",
            name: "Duck3",
            source: new VectorSource()
        }),
        layer4 = new VectorLayer({
            id: "Daisy",
            name: "Duck4",
            source: new VectorSource()
        });
    let map;

    beforeEach(() => {
        mapCollection.clear();
        map = new Map({
            id: "ol",
            mode: "2D",
            view: new View()
        });

        mapCollection.addMap(map, "ol", "2D");
    });

    it("addLayer - set layer2 with alwaysOnTop on top", function () {
        const zIndexes = [0, 3, 2],
            ids = ["Donald", "Dagobert", "Darkwing"];

        map.addLayer(layer1, 0);
        map.addLayer(layer2, 1);
        map.addLayer(layer3, 2);

        map.getLayers().forEach((layer, index) => {
            expect(layer.getZIndex()).equals(zIndexes[index]);
            expect(layer.get("id")).equals(ids[index]);
        });
    });

    it("addLayerToIndex - set layer2 with alwaysOnTop on top", function () {
        const zIndexes = [0, 3, 2],
            ids = ["Donald", "Dagobert", "Darkwing"];

        map.addLayerToIndex(layer1, 0);
        map.addLayerToIndex(layer2, 1);
        map.addLayerToIndex(layer3, 2);

        map.getLayers().forEach((layer, index) => {
            expect(layer.getZIndex()).equals(zIndexes[index]);
            expect(layer.get("id")).equals(ids[index]);
        });
    });

    it("addLayerOnTop - set layer3 on top and then layer2 with alwaysOnTop on top", function () {
        const zIndexes = [0, 3, 2],
            ids = ["Donald", "Dagobert", "Darkwing"];

        map.addLayer(layer1);
        map.addLayer(layer2);
        map.addLayerOnTop(layer3);

        map.getLayers().forEach((layer, index) => {
            expect(layer.getZIndex()).equals(zIndexes[index]);
            expect(layer.get("id")).equals(ids[index]);
        });
    });

    it("addNewLayerIfNotExists - create new layer with alwaysOnTop: true", function () {
        const zIndexes = [2, 1],
            ids = ["Tick, Trick und Track", "Donald"];

        map.addNewLayerIfNotExists("Tick, Trick und Track");
        map.addLayer(layer1);

        map.getLayers().forEach((layer, index) => {
            expect(layer.getZIndex()).equals(zIndexes[index]);
            expect(layer.get("id")).equals(ids[index]);
        });
    });

    it("addNewLayerIfNotExists - create new layer with alwaysOnTop: false", function () {
        const zIndexes = [0, 1, 2],
            ids = ["Donald", "Tick, Trick und Track"];

        map.addLayer(layer1);
        map.addNewLayerIfNotExists("Tick, Trick und Track", false);

        map.getLayers().forEach((layer, index) => {
            expect(layer.getZIndex()).equals(zIndexes[index]);
            expect(layer.get("id")).equals(ids[index]);
        });
    });

    it("getLayerById - returns the layer with the correct id", function () {
        map.addLayer(layer1);
        map.addLayer(layer2);
        map.addLayer(layer3);
        map.addLayer(layer4);

        expect(map.getLayerById("Donald")).equals(layer1);
        expect(map.getLayerById("Dagobert")).equals(layer2);
        expect(map.getLayerById("Darkwing")).equals(layer3);
        expect(map.getLayerById("Daisy")).equals(layer4);
    });

    it("getLayerByName - returns the layer with the correct name", function () {
        map.addLayer(layer1);
        map.addLayer(layer2);
        map.addLayer(layer3);
        map.addLayer(layer4);

        expect(map.getLayerByName("Duck1")).equals(layer1);
        expect(map.getLayerByName("Duck2")).equals(layer2);
        expect(map.getLayerByName("Duck3")).equals(layer3);
        expect(map.getLayerByName("Duck4")).equals(layer4);
    });
});
