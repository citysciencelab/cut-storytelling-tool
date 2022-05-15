import axios from "axios";
import sinon from "sinon";
import {expect} from "chai";
import getAndFilterFeatures from "../../../../zoomTo/utils/getAndFilterFeatures";
import {getLayerList} from "@masterportal/masterportalapi/src/rawLayerList";

const fs = require("fs"),
    exampleFeatureCollection = fs.readFileSync("./src/utils/tests/unit/zoomTo/resources/featureCollection.xml", "utf8");

describe("src/utils/zoomTo/utils/getAndFilterFeatures.js", () => {
    const id = "someId",
        property = "flaechenid",
        values = ["18", "26"];

    afterEach(() => {
        sinon.restore();
        getLayerList().length = 0;
    });

    it("should return a rejecting Promise if the layer with the given can not be found", () => {
        getAndFilterFeatures(id, property, values)
            .catch(error => {
                expect(error).to.equal(`The layer with the id ${id} could not be found.`);
            });
    });
    it("should return a Promise which resolves to Feature[] only including features including an allowed value for the given property", () => {
        sinon.stub(axios, "get").callsFake(() => new Promise(resolve => resolve({status: 200, statusText: "OK", data: exampleFeatureCollection})));

        getAndFilterFeatures(id, property, values)
            .then(features => {
                expect(features.length).to.equal(2);
            });
        getAndFilterFeatures(id, property, ["18"])
            .then(features => {
                expect(features.length).to.equal(1);
            });
    });
});
