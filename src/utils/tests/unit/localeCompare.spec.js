import {expect} from "chai";
import localeCompare from "../../localeCompare";

describe("src/utils/localeCompare.js", () => {
    describe("Testing localeCompare without options in German", () => {
        it("should return -1 if reference latter is before compared letter", () => {
            expect(localeCompare("a", "b", "de")).to.equal(-1);
        });
        it("should return 1 if reference latter is after compared letter", () => {
            expect(localeCompare("b", "a", "de")).to.equal(1);
        });
        it("should return 0 if  reference latter and compared letter are the same", () => {
            expect(localeCompare("a", "a", "de")).to.equal(0);
        });
        it("should return -1 if reference latter with german Umlaute is before compared letter", () => {
            expect(localeCompare("ä", "b", "de")).to.equal(-1);
        });
        it("should return 1 if reference latter with german Umlaute is after compared letter", () => {
            expect(localeCompare("ö", "b", "de")).to.equal(1);
        });
        it("should return 0 if  reference latter with german Umlaute and compared letter with german Umlaute are the same", () => {
            expect(localeCompare("ä", "ä", "de")).to.equal(0);
        });
    });
    describe("Testing localeCompare with options", () => {
        it("should return -1 if ignorePunctuation is true", () => {
            expect(localeCompare("a", "(b)", "de", {ignorePunctuation: true})).to.equal(-1);
        });
        it("should return 1 if ignorePunctuation is false", () => {
            expect(localeCompare("a", "(b)", "de", {ignorePunctuation: false})).to.equal(1);
        });
        it("should return 0 if sensitivity is 'base' in German", () => {
            expect(localeCompare("a", "ä", "de", {sensitivity: "base"})).to.equal(0);
        });
        it("should return -1 if sensitivity is 'base' in Swedish", () => {
            expect(localeCompare("a", "ä", "sv", {sensitivity: "base"})).to.equal(-1);
        });
        it("should return -1 if numeric is true", () => {
            expect(localeCompare("2", "10", "de", {numeric: true})).to.equal(-1);
        });
        it("should return 1 if numeric is false", () => {
            expect(localeCompare("2", "10", "de", {numeric: false})).to.equal(1);
        });
    });
});
