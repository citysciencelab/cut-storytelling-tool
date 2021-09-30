import {expect} from "chai";
import sinon from "sinon";
import WMSLayer from "../../wms";
import mapCollection from "../../../../dataStorage/mapCollection.js";
import store from "../../../../app-store";

describe("src/core/layers/wms.js", () => {
    let layerAdded = false,
        attributes;

    before(() => {
        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            addInteraction: sinon.spy(),
            removeInteraction: sinon.spy(),
            addLayer: () => {
                layerAdded = true;
            }
        };

        mapCollection.addMap(map, "ol", "2D");
    });
    beforeEach(() => {
        attributes = {
            name: "wmsTestLayer",
            id: "id",
            typ: "WMS",
            tilesize: 512,
            singleTile: false,
            minScale: "0",
            maxScale: "2500000",
            isChildLayer: true,
            layers: "layer1,layer2"
        };
    });

    afterEach(() => {
        sinon.restore();
        layerAdded = false;
    });

    it("createLayer shall create an ol.Layer with source", function () {
        const wmsLayer = new WMSLayer(attributes),
            layer = wmsLayer.get("layer");

        expect(layer).not.to.be.undefined;
        expect(layer.getSource()).not.to.be.undefined;
    });
    it("createLayer with isSelected=true shall add layer to map", function () {
        sinon.stub(Radio, "request").callsFake((...args) => {
            let ret = null;

            args.forEach(arg => {
                if (arg === "getResolutions") {
                    ret = [60, 20];
                }
            });
            return ret;
        });

        attributes.isSelected = true;
        const wmsLayer = new WMSLayer(attributes);

        expect(wmsLayer.get("layer")).not.to.be.undefined;
        expect(layerAdded).to.be.true;

    });
    it("createLayer with isSelected=false shall not add layer to map", function () {
        sinon.stub(Radio, "request").callsFake((...args) => {
            let ret = null;

            args.forEach(arg => {
                if (arg === "getResolutions") {
                    ret = [60, 20];
                }
            });
            return ret;
        });

        const wmsLayer = new WMSLayer(attributes);

        expect(wmsLayer.get("layer")).not.to.be.undefined;
        expect(layerAdded).to.be.false;

    });
    it("updateSourceSLDBody shall call updateParams at layers source", function () {
        attributes.SLDBody = "SLD_BODY";
        attributes.paramStyle = "paramStyle";
        const wmsLayer = new WMSLayer(attributes),
            layer = wmsLayer.get("layer");
        let paramsInCall = null;

        layer.getSource().updateParams = (params) => {
            paramsInCall = params;
        };
        wmsLayer.updateSourceSLDBody();
        expect(paramsInCall).not.to.be.null;
        expect(paramsInCall.SLD_BODY).to.be.equals("SLD_BODY");
        expect(paramsInCall.STYLES).to.be.equals("paramStyle");

    });
    it("updateSource shall change cacheId and update params of layer source", function () {
        const wmsLayer = new WMSLayer(attributes),
            cacheId = wmsLayer.get("cacheId"),
            layer = wmsLayer.get("layer");
        let paramsInCall = null;

        layer.getSource().updateParams = (params) => {
            paramsInCall = params;
        };
        wmsLayer.updateSource();
        expect(wmsLayer.get("cacheId")).not.to.be.equals(cacheId);
        expect(paramsInCall).not.to.be.null;
        expect(paramsInCall.CACHEID).to.be.equals(wmsLayer.get("cacheId"));

    });

    it("createLegend shall dispatch an array of legends", function () {
        const dispatchCalls = {};
        let wmsLayer = null;

        attributes.legendURL = "";
        attributes.legend = true;
        attributes.version = "1.2.3";
        attributes.url = "http://url";
        wmsLayer = new WMSLayer(attributes);
        store.dispatch = (arg1, arg2) => {
            dispatchCalls[arg1] = arg2 !== undefined ? arg2 : "called";
        };

        wmsLayer.createLegend();
        expect(Array.isArray(dispatchCalls["Legend/setLegendOnChanged"])).to.be.true;
        expect(dispatchCalls["Legend/setLegendOnChanged"].length).to.be.equals(2);

    });
});
