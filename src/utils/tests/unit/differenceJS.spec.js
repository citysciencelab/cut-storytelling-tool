import {expect} from "chai";
import differenceJs from "../../differenceJS.js";

describe("src/utils/differenceJS.js", () => {
    describe("differenceJs", function () {
        it("should return the last three entries in the array", function () {
            const array = [1, 2, 3, 4, 5];

            expect(differenceJs(array, [1, 2])).to.deep.equal([3, 4, 5]);
        });
        it("should return the given five entries in the array", function () {
            const array = [1, 2, 3, 4, 5];

            expect(differenceJs(array, [])).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("should return the last two entries in the array", function () {
            const array = ["Hamburg", "Bremen", "Berlin", "Delmenhosrt"];

            expect(differenceJs(array, ["Hamburg", "Bremen"])).to.deep.equal(["Berlin", "Delmenhosrt"]);
        });
        it("should return the given five entries in the array", function () {
            const array = [1, 2, 3, 4, 5];

            expect(differenceJs(array, undefined)).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("should return an empty array", function () {
            expect(differenceJs(undefined, undefined)).to.deep.equal([]);
        });
    });
});
