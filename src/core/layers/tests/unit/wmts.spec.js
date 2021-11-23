import {expect} from "chai";
import sinon from "sinon";
import WMTSLayer from "../../wmts";
import {getWidth} from "ol/extent";
import {get as getProjection} from "ol/proj";
import mapCollection from "../../../../core/dataStorage/mapCollection.js";
import store from "../../../../app-store";

describe("src/core/layers/wmts.js", () => {
    let attributes;

    before(() => {
        mapCollection.clear();
        const map = {
            id: "ol123",
            mode: "2D",
            addInteraction: sinon.stub(),
            removeInteraction: sinon.stub(),
            addLayer: () => sinon.stub(),
            getView: () => {
                return {
                    getResolutions: () => [2000, 1000]
                };
            }
        };

        mapCollection.addMap(map, "ol", "2D");
    });
    beforeEach(() => {
        attributes = {
            name: "wmtsTestLayer",
            id: "id",
            typ: "WMTS",
            tilesize: 512,
            singleTile: false,
            minScale: "0",
            maxScale: "2500000",
            isChildLayer: false,
            layers: "layer1,layer2",
            urls: ["-"],
            layer: "geolandbasemap",
            version: "1.0.0",
            format: "image/png",
            style: "normal",
            transparent: false,
            tileSize: "256",
            tileMatrixSet: "google3857",
            matrixSizes: [
                [1, 1], [2, 2],
                [4, 4], [8, 8],
                [16, 16], [32, 32],
                [64, 64], [128, 128],
                [256, 256], [512, 512],
                [1024, 1024], [2048, 2048],
                [4096, 4096], [8192, 8192],
                [16384, 16384], [32768, 32768],
                [65536, 65536], [131072, 131072],
                [262144, 262144], [524288, 524288]
            ],
            coordinateSystem: "EPSG:3857",
            layerAttribution: "nicht vorhanden",
            legend: false,
            cache: true,
            wrapX: true,
            origin: [
                -20037508.3428,
                20037508.3428
            ],
            resLength: "20",
            requestEncoding: "REST"
        };
        store.getters = {
            treeType: "custom"
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("createLayer shall create an ol.Layer with source", function () {
        const wmtsLayer = new WMTSLayer(attributes),
            layer = wmtsLayer.get("layer");

        expect(layer).not.to.be.undefined;
        expect(layer.getSource()).not.to.be.undefined;
    });
    it("createLayer with isSelected=true shall add layer to map", function () {
        attributes.isSelected = true;
        const wmtsLayer = new WMTSLayer(attributes);

        expect(wmtsLayer.get("layer")).not.to.be.undefined;
        expect(wmtsLayer.get("isVisibleInMap")).to.be.true;
        expect(wmtsLayer.get("layer").getVisible()).to.be.true;
    });
    it("createLayer with isSelected=false shall not add layer to map", function () {
        const wmtsLayer = new WMTSLayer(attributes);

        expect(wmtsLayer.get("layer")).not.to.be.undefined;
        expect(wmtsLayer.get("isVisibleInMap")).to.be.false;
        expect(wmtsLayer.get("layer").getVisible()).to.be.false;
    });

    describe("generateArrays", function () {
        it("should fill the arrays resolutions and matrixIds with numbers", function () {
            const wmtsLayer = new WMTSLayer(attributes),
                size = getWidth(getProjection("EPSG:3857").getExtent()) / 256,
                resLength = 20,
                resolutions = new Array(resLength),
                matrixIds = new Array(resLength);

            wmtsLayer.generateArrays(resolutions, matrixIds, resLength, size);

            resolutions.forEach((element, index) => {
                expect(typeof element).to.equal("number");
                expect(resolutions[index]).to.equal(size / Math.pow(2, index));
            });
            matrixIds.forEach((id, index) => {
                expect(typeof id).to.equal("number");
                expect(matrixIds[index]).to.equal(index);
            });
        });
    });

    it("should return the user-set extent if given for the layer", function () {
        const wmtsLayer = new WMTSLayer(attributes),
            extent = [510000.0, 5850000.0, 625000.4, 6000000.0];

        wmtsLayer.set("extent", extent);

        expect(wmtsLayer.getExtent()).to.equal(extent);
    });

    it("should return the extent of the projection if the user has not set an extent for the layer", function () {
        const wmtsLayer = new WMTSLayer(attributes),
            projectionExtent = getProjection(attributes.coordinateSystem).getExtent();

        wmtsLayer.set("extent", undefined);
        expect(wmtsLayer.getExtent()).to.equal(projectionExtent);
    });

});
