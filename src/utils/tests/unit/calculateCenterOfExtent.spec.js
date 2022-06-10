import {expect} from "chai";
import calculateCenterOfExtent from "../../calculateCenterOfExtent";

describe("src/utils/calculateCenterOfExtent.js", () => {
    it("should return the center coordinate of an extent", () => {
        const extent = [567001.606, 5934414.862, 567085.524, 5934496.754],
            expectedCenter = [567043.565, 5934455.808],
            center = calculateCenterOfExtent(extent);

        expect(center).to.deep.equal(expectedCenter);
    });
});
