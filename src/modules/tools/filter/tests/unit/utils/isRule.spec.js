import {expect} from "chai";
import {isRule} from "../../../utils/isRule.js";

describe("isRule", () => {
    it("should return false if anything but a valid rule is given", () => {
        expect(isRule(undefined)).to.be.false;
        expect(isRule(null)).to.be.false;
        expect(isRule("string")).to.be.false;
        expect(isRule(1234)).to.be.false;
        expect(isRule(true)).to.be.false;
        expect(isRule(false)).to.be.false;
        expect(isRule([])).to.be.false;
        expect(isRule({})).to.be.false;
        expect(isRule({
            snippetId: "string",
            fixed: "blub",
            attrName: 55
        }));
    });
    it("should return true if a rule is given", () => {
        expect(isRule({
            snippetId: 0,
            startup: false,
            fixed: false,
            attrName: "",
            operator: ""
        })).to.be.true;
    });
});
