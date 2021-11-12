import {expect} from "chai";
import {GeoJSON} from "ol/format.js";
import Model from "@modules/vectorStyle/styleModel";
import getFeaturePropertyPath from "../../getFeaturePropertyPath.js";

describe("src/utils/getFeaturePropertyPath.js", () => {
    const geojsonReader = new GeoJSON(),
        jsonFeatures = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "id": "test1",
                        "myObj": {
                            "myCascade": 10,
                            "myArray": [
                                {
                                    "myValue": 20
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "@test": "test",
                        "id": "test1"
                    }
                }
            ]
        };

    let styleModel,
        jsonObjects;


    before(function () {
        styleModel = new Model();
        jsonObjects = geojsonReader.readFeatures(jsonFeatures);
    });

    describe("getFeaturePropertyPath", function () {
        it("should return direct property", function () {
            expect(getFeaturePropertyPath(jsonObjects[0].getProperties(), "@id")).to.equal("test1");
        });
        it("should return object property", function () {
            expect(getFeaturePropertyPath(jsonObjects[0].getProperties(), "@myObj.myCascade")).to.equal(10);
        });
        it("should return object property in array", function () {
            expect(getFeaturePropertyPath(jsonObjects[0].getProperties(), "@myObj.myArray.0.myValue")).to.equal(20);
        });
        it("should return null if path is invalid", function () {
            expect(getFeaturePropertyPath(jsonObjects[0].getProperties(), "@myObj.myArray.1.myValue")).to.be.null;
        });
        it("should return null if path is invalid", function () {
            expect(getFeaturePropertyPath(jsonObjects[1].getProperties(), "@@test")).to.equal("test");
        });
    });

    describe("isObjectPath", function () {
        it("should return true if value is an object path", function () {
            expect(styleModel.isObjectPath("@id")).to.be.true;
        });
        it("should return false if value is not an object path", function () {
            expect(styleModel.isObjectPath(123)).to.be.false;
            expect(styleModel.isObjectPath("123")).to.be.false;
            expect(styleModel.isObjectPath("foo@id")).to.be.false;
        });
    });
});

