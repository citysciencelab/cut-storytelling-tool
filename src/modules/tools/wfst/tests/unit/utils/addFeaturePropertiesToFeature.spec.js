import {expect} from "chai";
import addFeaturePropertiesToFeature from "../../../utils/addFeaturePropertiesToFeature";

describe("src/modules/tools/wfst/utils/addFeaturePropertiesToFeature.js", () => {
    const geometryObject = {
            id: "unique",
            geometryName: "special",
            geometry: null
        },
        featurePrefix = "very";
    let updateFeature,
        featureProperties;

    beforeEach(() => {
        updateFeature = false;
        featureProperties = [{
            label: "any",
            key: "awesome",
            value: null,
            type: null,
            required: false
        }];
    });

    it("should not add an extra property if the type is 'geometry' and just set it through setGeometry", () => {
        featureProperties[0].type = "geometry";

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include("special");
        expect(properties.special).to.be.equal(null);
        expect(Object.keys(properties)).to.not.include("awesome");
    });
    it("should not add an extra property if the type is 'geometry' and just set it through setGeometry with a prefix if updateFeature is true", () => {
        updateFeature = true;
        featureProperties[0].type = "geometry";

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include(featurePrefix + ":special");
        expect(properties[featurePrefix + ":special"]).to.be.equal(null);
        expect(Object.keys(properties)).to.not.include(featurePrefix + ":awesome");
        expect(Object.keys(properties)).to.not.include("awesome");
    });
    it("should set null as the value of a property if the actual value is an empty string and the function parameter updateFeature is true", () => {
        updateFeature = true;
        featureProperties[0].type = "integer";
        featureProperties[0].value = "";

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include(featurePrefix + ":awesome");
        expect(properties[featurePrefix + ":awesome"]).to.equal(null);
    });
    it("should set null as the value of a property if the actual value is null and the function parameter updateFeature is true", () => {
        updateFeature = true;
        featureProperties[0].type = "integer";

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include(featurePrefix + ":awesome");
        expect(properties[featurePrefix + ":awesome"]).to.equal(null);
    });
    it("should set null as the value of a property if the actual value is undefined and the function parameter updateFeature is true", () => {
        updateFeature = true;
        featureProperties[0].type = "integer";
        featureProperties[0].value = undefined;

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include(featurePrefix + ":awesome");
        expect(properties[featurePrefix + ":awesome"]).to.equal(null);
    });
    it("should set the actual value as the value of the property if it is neither an empty string, null or undefined and the function parameter updateFeature is true", () => {
        updateFeature = true;
        featureProperties[0].type = "string";
        featureProperties[0].value = "Heyo";

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include(featurePrefix + ":awesome");
        expect(properties[featurePrefix + ":awesome"]).to.equal("Heyo");
    });
    it("should convert the string value of the property to a Number if the type is integer and it represents an actual number", () => {
        featureProperties[0].type = "integer";
        featureProperties[0].value = "42";

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include("awesome");
        expect(properties.awesome).to.equal(42);
    });
    it("should convert the string value of the property to a Number if the type is int and it represents an actual number", () => {
        featureProperties[0].type = "int";
        featureProperties[0].value = "42";

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include("awesome");
        expect(properties.awesome).to.equal(42);
    });
    it("should convert the string value of the property to a Number if the type is decimal and it represents an actual number", () => {
        featureProperties[0].type = "decimal";
        featureProperties[0].value = "42";

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include("awesome");
        expect(properties.awesome).to.equal(42);
    });
    it("should not set the value if the type is either integer, int or decimal and the value is not numerical", () => {
        featureProperties[0].type = "integer";
        featureProperties[0].value = "Not a Number";

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.not.include("awesome");
    });
    it("should just set the value if it is a string, boolean or date", () => {
        featureProperties[0].type = "boolean";
        featureProperties[0].value = false;

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include("awesome");
        expect(properties.awesome).to.equal(false);
    });
    it("should set the value if it is undefined, null or an empty string if updateFeature is false", () => {
        featureProperties[0].type = "boolean";
        featureProperties[0].value = undefined;

        const feature = addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature),
            properties = feature.getProperties();

        expect(Object.keys(properties)).to.include("awesome");
        expect(properties.awesome).to.equal(undefined);
    });
    it("should set an id for the feature if the value is given", () => {
        featureProperties[0].type = "boolean";
        featureProperties[0].value = false;

        expect(addFeaturePropertiesToFeature(geometryObject, featureProperties, featurePrefix, updateFeature).getId()).to.equal("unique");
    });
});
