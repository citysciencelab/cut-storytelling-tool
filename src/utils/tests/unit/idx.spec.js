import {expect} from "chai";
import idx, {badPathSymbol} from "../../idx";

describe("src/utils/idx.js", () => {
    const firstFinish = "We want this!",
        secondFinish = {value: "... or we could want this!"},
        object = {
            prm: {
                firstFinish,
                arr: [
                    "no",
                    "also no",
                    {
                        secondFinish
                    },
                    "definitely no"
                ]
            }
        };
    let path;

    it("should return the value from the nested object if it is present (only object nesting)", () => {
        path = ["prm", "firstFinish"];

        expect(idx(object, path)).to.equal(firstFinish);
    });
    it("should return the value from the nested object if it is present (arrays included)", () => {
        path = ["prm", "arr", "2", "secondFinish"];

        expect(idx(object, path)).to.eql(secondFinish);
    });
    it("should return badPathSymbol if the path does not exist inside the given object", () => {
        path = ["prm", "arr", "whoops"];

        expect(idx(object, path)).to.equal(badPathSymbol);
    });
});
