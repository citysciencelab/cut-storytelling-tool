import {expect} from "chai";
import {convertSexagesimalFromString, convertSexagesimalToDecimal, convertSexagesimalFromDecimal} from "../../convertSexagesimalCoordinates.js";

describe("src/utils/convertSexagesimalCoordinates.js", () => {
    describe("convertSexagesimalFromString", () => {
        it("should return the given coord splitted", () => {
            expect(convertSexagesimalFromString("0° 00′ 00″ 0° 00′ 00″")).to.deep.equal({easting: "0° 00′ 00″", northing: "0° 00′ 00″"});
            expect(convertSexagesimalFromString("3° 33′ 04″ N 9° 56′ 29″ E")).to.deep.equal({easting: "3° 33′ 04″", northing: "9° 56′ 29″"});
            expect(convertSexagesimalFromString("53° 33′ 04″ N 19° 56′ 29″ E")).to.deep.equal({easting: "53° 33′ 04″", northing: "19° 56′ 29″"});
            expect(convertSexagesimalFromString("53° 33′ 04″ N 9° 56′ 29″ E")).to.deep.equal({easting: "53° 33′ 04″", northing: "9° 56′ 29″"});
        });
    });
    describe("convertSexagesimalFromDecimal", () => {
        it("should return the converted coordinate", () => {
            expect(convertSexagesimalFromDecimal(53.555185350130984)).to.equal("53° 33′ 18″");
            expect(convertSexagesimalFromDecimal(9.979056701168938)).to.equal("9° 58′ 44″");

        });
    });
    describe("convertSexagesimalToDecimal", () => {
        it("test string - should return the given coord as decimal values", () => {
            expect(convertSexagesimalToDecimal("0° 00′ 00″ 0° 00′ 00″")).to.deep.equal({easting: "0.0000°", northing: "0.0000°"});
            expect(convertSexagesimalToDecimal("3° 33′ 04″ N 9° 56′ 29″ E")).to.deep.equal({easting: "3.5511°", northing: "9.9414°"});
            expect(convertSexagesimalToDecimal("53° 33′ 04″ N 9° 56′ 29″ E")).to.deep.equal({easting: "53.5511°", northing: "9.9414°"});
            expect(convertSexagesimalToDecimal("53° 33′ 04″ N 19° 56′ 29″ E")).to.deep.equal({easting: "53.5511°", northing: "19.9414°"});
        });
        it("test array", () => {
            let coord = [["53", "33", "18", ""], ["9", "58", "43", ""]];

            expect(convertSexagesimalToDecimal(coord)).to.deep.equal([9.97861111111111, 53.555]);
            coord = [["53.5550", ""], ["9.9786", ""]];
            expect(convertSexagesimalToDecimal(coord)).to.deep.equal([9.9786, 53.555]);

        });
        it("test undefined", () => {
            expect(convertSexagesimalToDecimal(undefined)).to.deep.equal({easting: "No value", northing: "No value"});
        });
    });
});
