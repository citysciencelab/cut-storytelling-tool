import {expect} from "chai";
import {translateKeyWithPlausibilityCheck} from "../../translateKeyWithPlausibilityCheck.js";

describe("translateKeyWithPlausibilityCheck", () => {
    it("should return an empty string if the given value is not a string", () => {
        expect(translateKeyWithPlausibilityCheck(undefined)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck(null)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck(1234)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck(true)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck(false)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck([])).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck({})).to.be.a("string").and.to.be.empty;
    });
    it("should return an empty string if the given translation function is not a function", () => {
        expect(translateKeyWithPlausibilityCheck("", undefined)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck("", null)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck("", "string")).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck("", 1234)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck("", true)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck("", false)).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck("", [])).to.be.a("string").and.to.be.empty;
        expect(translateKeyWithPlausibilityCheck("", {})).to.be.a("string").and.to.be.empty;
    });
    it("should return the given key if the key includes more than one \":\"", () => {
        expect(translateKeyWithPlausibilityCheck("foo:bar:baz", () => {
            // mocking i18next behavior $t("common:unvalid:key") => "unvalid.key"
            return "bar.baz";
        })).to.equal("foo:bar:baz");
    });
    it("should return the given key if only one \":\" is found and the translation equals the value from the \":\" onwards", () => {
        expect(translateKeyWithPlausibilityCheck("foo:bar", () => {
            // mocking i18next behavior $t("common:unvalid.key") => "unvalid.key"
            return "bar";
        })).to.equal("foo:bar");
    });
    it("should return the given key if translation returns a value identical to the key", () => {
        expect(translateKeyWithPlausibilityCheck("foo bar baz", () => {
            return "foo bar baz";
        })).to.equal("foo bar baz");
    });
    it("should return the translation of the key", () => {
        expect(translateKeyWithPlausibilityCheck("foo:bar.baz", () => {
            return "this is the translation of foo:bar.baz";
        })).to.equal("this is the translation of foo:bar.baz");
    });
});
