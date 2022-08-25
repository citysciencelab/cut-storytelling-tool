import {expect} from "chai";
import Feature from "ol/Feature";
import View from "ol/View";
import sinon from "sinon";
import getters from "../../../store/gettersGfi";

describe("src/modules/tools/gfi/store/gettersGfi.js", () => {
    describe("gfiFeaturesAtPixel", () => {
        it("gfiFeaturesAtPixel returns an array", () => {
            const gfiFeaturesAtPixel = getters.gfiFeaturesAtPixel(),
                map = {
                    id: "ol",
                    mode: "2D",
                    view: new View(),
                    forEachFeatureAtPixel: sinon.spy()
                };

            mapCollection.clear();
            mapCollection.addMap(map, "2D");
            expect(gfiFeaturesAtPixel([40, 50], null, "2D")).be.an("array");
        });
    });

    describe("gfiFeaturesReverse", () => {
        it("returns the Features in reverse order", () => {
            const feature1 = new Feature({visible: true, typ: "WMS"}),
                feature2 = new Feature({visible: true, typ: "WFS"}),
                feature3 = new Feature({visible: true, typ: "WCS"}),
                state = {
                    gfiFeatures: [feature1, feature2, feature3]
                };

            expect(getters.gfiFeaturesReverse(state)).to.eql([feature3, feature2, feature1]);
        });
    });
});
