import {expect} from "chai";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import calculateExtent from "../../calculateExtent.js";

describe("src/utils/calculateExtent.js", () => {
    const features = [];

    before(() => {
        features.push(new Feature({
            id: "Thor"
        }));
        features.push(new Feature({
            id: "Spider-Man"
        }));

        features[0].setGeometry(new Polygon([[
            [568688.141, 5931833.217, 0],
            [568718.44, 5931891.569, 0],
            [568940.626, 5931774.865, 0],
            [568926.786, 5931747.185, 0],
            [568909.206, 5931749.429, 0],
            [568890.503, 5931752.796, 0],
            [568871.97, 5931756.611, 0],
            [568855.886, 5931760.236, 0],
            [568837.014, 5931764.765, 0],
            [568814.945, 5931772.621, 0],
            [568777.54, 5931786.46, 0],
            [568742.753, 5931801.797, 0],
            [568722.18, 5931811.896, 0],
            [568703.478, 5931822.369, 0],
            [568688.141, 5931833.217, 0]
        ]]));
        features[1].setGeometry(new Polygon([[
            [567057.664, 5934494.053, 0],
            [567085.524, 5934449.476, 0],
            [567082.822, 5934439.177, 0],
            [567038.921, 5934414.862, 0],
            [567029.635, 5934415.707, 0],
            [567002.933, 5934461.55, 0],
            [567023.049, 5934455.893, 0],
            [567024.062, 5934450.321, 0],
            [567027.271, 5934444.242, 0],
            [567033.012, 5934439.346, 0],
            [567038.752, 5934436.982, 0],
            [567046.351, 5934436.982, 0],
            [567052.767, 5934439.514, 0],
            [567059.014, 5934443.567, 0],
            [567061.885, 5934448.295, 0],
            [567062.56, 5934455.048, 0],
            [567060.703, 5934461.296, 0],
            [567057.495, 5934465.855, 0],
            [567053.273, 5934469.907, 0],
            [567046.857, 5934472.778, 0],
            [567040.779, 5934473.453, 0],
            [567034.531, 5934471.765, 0],
            [567029.803, 5934468.894, 0],
            [567025.245, 5934463.491, 0],
            [567023.387, 5934458.425, 0],
            [567001.606, 5934463.829, 0],
            [567004.307, 5934473.791, 0],
            [567046.688, 5934496.754, 0],
            [567057.664, 5934494.053, 0]
        ]]));
    });

    it("should return extent that is not undefined", function () {
        expect(calculateExtent(features)).not.to.be.undefined;
    });
    it("should return extent of test-features with xMin = 567001.606", function () {
        expect(calculateExtent(features)[0]).to.equal(567001.606);
    });
    it("should return extent of test-features with yMin = 5931747.185", function () {
        expect(calculateExtent(features)[1]).to.equal(5931747.185);
    });
    it("should return extent of test-features with xMax = 568940.626", function () {
        expect(calculateExtent(features)[2]).to.equal(568940.626);
    });
    it("should return extent of test-features with yMax = 5934496.754", function () {
        expect(calculateExtent(features)[3]).to.equal(5934496.754);
    });
});
