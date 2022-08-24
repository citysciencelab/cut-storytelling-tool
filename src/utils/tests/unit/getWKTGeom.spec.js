import {expect} from "chai";
import {getWKTGeom} from "../../getWKTGeom.js";

describe("src/utils/getWKTGeom.js", () => {
    it("should return a feature with geometryType and POLYGON coordinates", () => {
        const content = ["570374.959", "5936460.361", "570369.316", "5936458.5", "570364.706", "5936473.242", "570370.393", "5936474.993", "570374.959", "5936460.361"],
            geometryType = "POLYGON";

        expect(getWKTGeom(content, geometryType)).is.not.undefined;
        expect(getWKTGeom(content, geometryType).getGeometry()).is.not.undefined;
        expect(getWKTGeom(content, geometryType).getGeometry().getCoordinates()).to.deep.equal([[
            [570374.959, 5936460.361],
            [570369.316, 5936458.5],
            [570364.706, 5936473.242],
            [570370.393, 5936474.993],
            [570374.959, 5936460.361]
        ]]);
    });

    it("should return a feature with geometryType and POINT coordinates", () => {
        const content = ["570374.959", "5936460.361"],
            geometryType = "POINT";

        expect(getWKTGeom(content, geometryType)).is.not.undefined;
        expect(getWKTGeom(content, geometryType).getGeometry()).is.not.undefined;
        expect(getWKTGeom(content, geometryType).getGeometry().getCoordinates()).to.deep.equal(
            [570374.959, 5936460.361]
        );
    });

    it("should return a feature with POLYGON coordinates by given content as object", () => {
        const content = {
            geometryType: "POLYGON",
            coordinate: ["570374.959", "5936460.361", "570369.316", "5936458.5", "570364.706", "5936473.242", "570370.393", "5936474.993", "570374.959", "5936460.361"]
        };

        expect(getWKTGeom(content)).is.not.undefined;
        expect(getWKTGeom(content).getGeometry()).is.not.undefined;
        expect(getWKTGeom(content).getGeometry().getCoordinates()).to.deep.equal([[
            [570374.959, 5936460.361],
            [570369.316, 5936458.5],
            [570364.706, 5936473.242],
            [570370.393, 5936474.993],
            [570374.959, 5936460.361]
        ]]);
    });

    it("should return a feature with POLYGON with voids coordinates by given content as object", () => {
        const content = {
            geometryType: "POLYGON",
            coordinate: [
                ["633653.190", "5647452.770", "633528.150", "5647303.820", "633517.510", "5647293.520", "633502.960", "5647282.230", "633653.190", "5647452.770"],
                ["633806.963", "5646359.816", "633826.122", "5646366.259", "633836.733", "5646369.832", "633852.427", "5646375.113", "633806.963", "5646359.816"],
                ["634037.745", "5646804.502", "634082.117", "5646797.795", "634109.727", "5646798.550", "634104.507", "5646805.330", "634100.089", "5646811.410", "634037.745", "5646804.502"]
            ]
        };

        expect(getWKTGeom(content)).is.not.undefined;
        expect(getWKTGeom(content).getGeometry()).is.not.undefined;
        expect(getWKTGeom(content).getGeometry().getCoordinates()).to.deep.equal([
            [
                [633653.190, 5647452.770],
                [633528.150, 5647303.820],
                [633517.510, 5647293.520],
                [633502.960, 5647282.230],
                [633653.190, 5647452.770]
            ],
            [
                [633806.963, 5646359.816],
                [633826.122, 5646366.259],
                [633836.733, 5646369.832],
                [633852.427, 5646375.113],
                [633806.963, 5646359.816]
            ],
            [
                [634037.745, 5646804.502],
                [634082.117, 5646797.795],
                [634109.727, 5646798.550],
                [634104.507, 5646805.330],
                [634100.089, 5646811.410],
                [634037.745, 5646804.502]
            ]
        ]);
    });

    it("should return a feature with MULTIPOLYGON coordinates by given content as object", () => {
        const content = {
            geometryType: "MULTIPOLYGON",
            coordinate: [
                ["570374.959", "5936460.361", "570369.316", "5936458.5", "570364.706", "5936473.242", "570370.393", "5936474.993", "570374.959", "5936460.361"],
                ["556622.043", "5935346.022", "556605.381", "5935347.509", "556583.860", "5935349.429", "556562.872", "5935351.302", "556562.855", "5935344.371", "556604.117", "5935340.974", "556622.043", "5935339.707", "556622.043", "5935346.022"]
            ]
        };

        expect(getWKTGeom(content)).is.not.undefined;
        expect(getWKTGeom(content).getGeometry()).is.not.undefined;
        expect(getWKTGeom(content).getGeometry().getCoordinates()).to.deep.equal([
            [
                [
                    [570374.959, 5936460.361],
                    [570369.316, 5936458.5],
                    [570364.706, 5936473.242],
                    [570370.393, 5936474.993],
                    [570374.959, 5936460.361]
                ]
            ],
            [
                [
                    [556622.043, 5935346.022],
                    [556605.381, 5935347.509],
                    [556583.860, 5935349.429],
                    [556562.872, 5935351.302],
                    [556562.855, 5935344.371],
                    [556604.117, 5935340.974],
                    [556622.043, 5935339.707],
                    [556622.043, 5935346.022]
                ]
            ]
        ]);
    });
    it("should return a feature with MULTIPOLYGON with polygon with voids coordinates by given content as object", () => {
        const content = {
            geometryType: "MULTIPOLYGON",
            coordinate: [
                ["616556.662", "5640251.335", "616556.662", "5640251.335", "616556.256", "5640251.662", "616556.662", "5640251.335"],
                ["616501.461", "5640403.126", "616444.650", "5640308.210", "616479.019", "5640292.544", "616482.912", "5640298.671", "616501.461", "5640403.126"],
                [
                    ["616626.114", "5640175.171", "616699.340", "5640034.420", "616708.300", "5639859.060", "616626.114", "5640175.171"],
                    ["619219.121", "5643040.941", "619387.503", "5643128.571", "619418.598", "5643144.862", "619219.121", "5643040.941"],
                    ["618171.149", "5642161.063", "618177.133", "5642139.270", "618167.636", "5642136.583", "618150.931", "5642130.018", "618142.673", "5642128.056", "618171.149", "5642161.063"]
                ]
            ]
        };

        expect(getWKTGeom(content)).is.not.undefined;
        expect(getWKTGeom(content).getGeometry()).is.not.undefined;
        expect(getWKTGeom(content).getGeometry().getCoordinates()).to.deep.equal([
            [
                [
                    [616556.662, 5640251.335],
                    [616556.662, 5640251.335],
                    [616556.256, 5640251.662],
                    [616556.662, 5640251.335]
                ]
            ],
            [
                [
                    [616501.461, 5640403.126],
                    [616444.650, 5640308.210],
                    [616479.019, 5640292.544],
                    [616482.912, 5640298.671],
                    [616501.461, 5640403.126]
                ]
            ],
            [
                [
                    [616626.114, 5640175.171],
                    [616699.340, 5640034.420],
                    [616708.300, 5639859.060],
                    [616626.114, 5640175.171]
                ],
                [
                    [619219.121, 5643040.941],
                    [619387.503, 5643128.571],
                    [619418.598, 5643144.862],
                    [619219.121, 5643040.941]
                ],
                [
                    [618171.149, 5642161.063],
                    [618177.133, 5642139.270],
                    [618167.636, 5642136.583],
                    [618150.931, 5642130.018],
                    [618142.673, 5642128.056],
                    [618171.149, 5642161.063]
                ]
            ]
        ]);
    });
});
