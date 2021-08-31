import {expect} from "chai";
import {convertSexagesimalFromString, convertSexagesimalToDecimal} from "../../convertSexagesimalCoordinates.js";

describe("src/utils/convertSexagesimalCoordinates.js", () => {
    describe("convertSexagesimalFromString", () => {
        it("should return the given coord splitted", () => {
            expect(convertSexagesimalFromString("0° 00′ 00″ 0° 00′ 00″")).to.deep.equal({easting: "0° 00′ 00″", northing: "0° 00′ 00″"});
            expect(convertSexagesimalFromString("3° 33′ 04″ N 9° 56′ 29″ E")).to.deep.equal({easting: "3° 33′ 04″", northing: "9° 56′ 29″"});
            expect(convertSexagesimalFromString("53° 33′ 04″ N 19° 56′ 29″ E")).to.deep.equal({easting: "53° 33′ 04″", northing: "19° 56′ 29″"});
            expect(convertSexagesimalFromString("53° 33′ 04″ N 9° 56′ 29″ E")).to.deep.equal({easting: "53° 33′ 04″", northing: "9° 56′ 29″"});
        });
    });
    describe("convertSexagesimalToDecimal", () => {
        it("should return the given coord as decimal values", () => {
            expect(convertSexagesimalToDecimal("0° 00′ 00″ 0° 00′ 00″")).to.deep.equal({easting: "0.0000°", northing: "0.0000°"});
            expect(convertSexagesimalToDecimal("3° 33′ 04″ N 9° 56′ 29″ E")).to.deep.equal({easting: "3.5511°", northing: "9.9414°"});
            expect(convertSexagesimalToDecimal("53° 33′ 04″ N 9° 56′ 29″ E")).to.deep.equal({easting: "53.5511°", northing: "9.9414°"});
            expect(convertSexagesimalToDecimal("53° 33′ 04″ N 19° 56′ 29″ E")).to.deep.equal({easting: "53.5511°", northing: "19.9414°"});
        });
    });
});
