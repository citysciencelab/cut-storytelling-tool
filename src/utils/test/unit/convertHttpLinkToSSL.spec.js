import {expect} from "chai";
import convertHttpLinkToSSL from "../../convertHttpLinkToSSL";

describe("src/utils/convertHttpLinkToSSL.js", () => {
    describe("convertHttpLinkToSSL", () => {
        it("should return an empty string if anything but a string is given", () => {
            expect(convertHttpLinkToSSL(undefined)).to.be.a("string").and.to.be.empty;
            expect(convertHttpLinkToSSL(null)).to.be.a("string").and.to.be.empty;
            expect(convertHttpLinkToSSL(1234)).to.be.a("string").and.to.be.empty;
            expect(convertHttpLinkToSSL(true)).to.be.a("string").and.to.be.empty;
            expect(convertHttpLinkToSSL(false)).to.be.a("string").and.to.be.empty;
            expect(convertHttpLinkToSSL({})).to.be.a("string").and.to.be.empty;
            expect(convertHttpLinkToSSL([])).to.be.a("string").and.to.be.empty;
        });
        it("should return the given http link as https link", () => {
            expect(convertHttpLinkToSSL("http://example.com")).to.equal("https://example.com");
        });
        it("should return the given string if the given string is not http prefixed", () => {
            expect(convertHttpLinkToSSL("test")).to.equal("test");
        });
    });
});
