import {expect} from "chai";
import {prettyValue} from "../../../utils/preparePrint.js";

describe("src/modules/tools/compareFeatures/utils/preparePrint.js", () => {
    describe("prettyValue", () => {
        it("should return - for undefined input", () => {
            expect(prettyValue(undefined)).to.equals("-");
        });

        it("should return a value in which the | have been replaced by \n", () => {
            const abc = "a|b|c";

            expect(prettyValue(abc)).to.be.a("string");
            expect(prettyValue(abc)).to.equals("a\nb\nc");
        });
        it("should return the input value if no | exists", () => {
            const abc = "abc";

            expect(prettyValue(abc)).to.be.a("string");
            expect(prettyValue(abc)).to.equals(abc);
        });
    });
});
