import {expect} from "chai";
import Map from "ol/Map.js";
import gettersMap from "../../../store/gettersMap";
import stateMap from "../../../store/stateMap";
import mutationsMap from "../../../store/mutationsMap";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";

const {addLayerToMap} = mutationsMap;

describe("src/core/maps/store/gettersMap.js", () => {

    describe("Map simple getters", async () => {

        it("returns false for maximumZoomLevelActive from state", () => {
            const state = {
                zoom: 0,
                maxZoomLevel: 10
            };

            expect(gettersMap.maximumZoomLevelActive(stateMap)).to.be.true;
            expect(gettersMap.maximumZoomLevelActive(state)).to.be.false;
        });

        it("returns false for minimumZoomLevelActive from state", () => {
            const state = {
                zoom: 5,
                minZoomLevel: 0
            };

            expect(gettersMap.minimumZoomLevelActive(stateMap)).to.be.true;
            expect(gettersMap.minimumZoomLevelActive(state)).to.be.false;
        });
        it("returns the 2D map", () => {
            const map = {
                id: "ol",
                mode: "2D"
            };

            mapCollection.clear();
            mapCollection.addMap(map, "2D");

            expect(mapCollection.getMap("2D")).to.deep.equal({id: "ol", mode: "2D"});
        });
        it("returns the 3D map", () => {
            const map = {
                id: "olcs",
                mode: "3D"
            };

            mapCollection.addMap(map, "3D");

            expect(mapCollection.getMap("3D")).to.deep.equal({id: "olcs", mode: "3D"});
        });
        it("returns the map layers", () => {
            const layers = [],
                map = {
                    id: "ol",
                    mode: "2D",
                    addLayer: (layer) => {
                        layers.push(layer);
                    },
                    getLayers: () => {
                        return layer;
                    }
                },
                layer = new VectorLayer({
                    name: "layer123",
                    source: new VectorSource()
                }),
                state = {
                    mode: "2D"
                };

            mapCollection.clear();
            mapCollection.addMap(map, "2D");
            addLayerToMap(state, layer);

            expect(gettersMap.getLayers().values_.name).to.equals("layer123");
        });
    });

    describe("Map custom getters", () => {
        it("returns the visibleLayerList", () => {
            const map = new Map({
                id: "ol",
                mode: "2D"
            });

            mapCollection.clear();
            mapCollection.addMap(map, "2D");
            expect(gettersMap.getVisibleLayerList()).to.be.a("array");
        });
    });

    describe("scaleToOne", () => {
        it("should return \"1 : scale must be a positive number\" if anything but a number is given", () => {
            expect(gettersMap.scaleToOne(false, {scale: undefined})).to.equal("1 : scale must be a positive number");
            expect(gettersMap.scaleToOne(false, {scale: null})).to.equal("1 : scale must be a positive number");
            expect(gettersMap.scaleToOne(false, {scale: "string"})).to.equal("1 : scale must be a positive number");
            expect(gettersMap.scaleToOne(false, {scale: true})).to.equal("1 : scale must be a positive number");
            expect(gettersMap.scaleToOne(false, {scale: false})).to.equal("1 : scale must be a positive number");
            expect(gettersMap.scaleToOne(false, {scale: {}})).to.equal("1 : scale must be a positive number");
            expect(gettersMap.scaleToOne(false, {scale: []})).to.equal("1 : scale must be a positive number");
        });
        it("should return \"1 : scale must be a positive number\" if zero is given", () => {
            expect(gettersMap.scaleToOne(false, {scale: 0})).to.equal("1 : scale must be a positive number");
        });
        it("should return \"1 : scale must be a positive number\" if a negative scale is given", () => {
            expect(gettersMap.scaleToOne(false, {scale: -1})).to.equal("1 : scale must be a positive number");
        });
        it("should keep the given scale as scaleToOne untouched if scale is 1.000 or less", () => {
            expect(gettersMap.scaleToOne(false, {scale: 1})).to.equal("1 : 1");
            expect(gettersMap.scaleToOne(false, {scale: 123})).to.equal("1 : 123");
            expect(gettersMap.scaleToOne(false, {scale: 999})).to.equal("1 : 999");
            expect(gettersMap.scaleToOne(false, {scale: 1000})).to.equal("1 : 1.000");
        });
        it("should return the given scale as scaleToOne down to the fifties if scale is 10.000 or less", () => {
            expect(gettersMap.scaleToOne(false, {scale: 1001})).to.equal("1 : 1.000");
            expect(gettersMap.scaleToOne(false, {scale: 1024})).to.equal("1 : 1.000");
            expect(gettersMap.scaleToOne(false, {scale: 1025})).to.equal("1 : 1.050");
            expect(gettersMap.scaleToOne(false, {scale: 10000})).to.equal("1 : 10.000");
        });
        it("should return the given scale as scaleToOne down to five hundreds if scale is greater than 10.000", () => {
            expect(gettersMap.scaleToOne(false, {scale: 10249})).to.equal("1 : 10.000");
            expect(gettersMap.scaleToOne(false, {scale: 10250})).to.equal("1 : 10.500");
        });
    });
    describe("test getters from mapView", () => {
        /**
         * Is needed to run the tests.
         * @see https://github.com/vuejs/vue-test-utils/issues/974
         * @returns {void}
         */
        global.requestAnimationFrame = () => "";

        let map, size;

        beforeEach(() => {
            mapCollection.clear();
            size = [1920, 887];
            map = new Map({
                id: "ol",
                mode: "2D",
                view: new View({
                    extent: [510000.0, 5850000.0, 625000.4, 6000000.0],
                    center: [565874, 5934140],
                    zoom: 2,
                    options: [
                        {resolution: 66.14579761460263, scale: 250000, zoomLevel: 0},
                        {resolution: 26.458319045841044, scale: 100000, zoomLevel: 1},
                        {resolution: 15.874991427504629, scale: 60000, zoomLevel: 2},
                        {resolution: 10.583327618336419, scale: 40000, zoomLevel: 3},
                        {resolution: 5.2916638091682096, scale: 20000, zoomLevel: 4},
                        {resolution: 2.6458319045841048, scale: 10000, zoomLevel: 5},
                        {resolution: 1.3229159522920524, scale: 5000, zoomLevel: 6},
                        {resolution: 0.6614579761460262, scale: 2500, zoomLevel: 7},
                        {resolution: 0.2645831904584105, scale: 1000, zoomLevel: 8},
                        {resolution: 0.1322915952292052, scale: 500, zoomLevel: 9}
                    ],
                    resolution: 15.874991427504629,
                    resolutions: [66.14579761460263, 26.458319045841044, 15.874991427504629, 10.583327618336419, 5.2916638091682096, 2.6458319045841048, 1.3229159522920524, 0.6614579761460262, 0.2645831904584105, 0.13229159522920522]
                })
            });

            map.setSize(size);
            mapCollection.addMap(map, "2D");
        });

        it("getCurrentExtent - calculate the extent for the current view state and the passed size", function () {
            const state = {size: size};

            expect(gettersMap.getCurrentExtent(state)).to.deep.equal([
                550634.0082295956, 5927099.441301902, 581113.9917704044, 5941180.558698098
            ]);

            map.getView().setZoom(3);
            expect(gettersMap.getCurrentExtent(state)).to.not.have.members([
                550634.0082295956, 5927099.441301902, 581113.9917704044, 5941180.558698098
            ]);
        });
    });
});
