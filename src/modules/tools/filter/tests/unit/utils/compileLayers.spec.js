import {expect} from "chai";
import {
    removeInvalidLayers,
    convertStringLayersIntoObjects,
    addFilterIds,
    addSnippetArrayIfMissing,
    createLayerConfigsAssoc
} from "../../../utils/compileLayers.js";

describe("src/modules/tools/filter/utils/compileLayers.js", () => {
    describe("createLayerConfigsAssoc", () => {
        it("should create a associative list of layers", () => {
            const layers = [
                    {filterId: "A"},
                    {filterId: "B"},
                    {filterId: "C"},
                    {filterId: "F"}
                ],
                expected = {
                    A: {filterId: "A"},
                    B: {filterId: "B"},
                    C: {filterId: "C"},
                    F: {filterId: "F"}
                };

            expect(createLayerConfigsAssoc(layers)).to.deep.equal(expected);
        });
    });
    describe("addSnippetArrayIfMissing", () => {
        it("should add a snippet array if missing", () => {
            const layers = [
                    {filterId: "A", snippets: [1, 2, 3]},
                    {filterId: "B"},
                    {filterId: "C"},
                    {filterId: "F", snippets: "this is not an array"}
                ],
                expected = [
                    {filterId: "A", snippets: [1, 2, 3]},
                    {filterId: "B", snippets: []},
                    {filterId: "C", snippets: []},
                    {filterId: "F", snippets: []}
                ];

            addSnippetArrayIfMissing(layers);
            expect(layers).to.deep.equal(expected);
        });
    });
    describe("addFilterIds", () => {
        it("should add an incremented filterId to all layers, should override", () => {
            const layers = [
                    {filterId: "A"},
                    {filterId: "B"},
                    {filterId: "C"},
                    {filterId: "F"}
                ],
                expected = [
                    {filterId: 0},
                    {filterId: 1},
                    {filterId: 2},
                    {filterId: 3}
                ];

            addFilterIds(layers);
            expect(layers).to.deep.equal(expected);
        });
    });
    describe("convertStringLayersIntoObjects", () => {
        it("should convert string layers to objects", () => {
            const layers = [
                    {filterId: "A"},
                    "filterB",
                    {
                        filterId: "C"
                    },
                    {filterId: "F"}
                ],
                expected = [
                    {filterId: "A"},
                    {layerId: "filterB"},
                    {
                        filterId: "C"
                    },
                    {filterId: "F"}
                ];

            convertStringLayersIntoObjects(layers);
            expect(layers).to.deep.equal(expected);
        });
    });
    describe("removeInvalidLayers", () => {
        it("should return an empty array if anything but an array is given", () => {
            expect(removeInvalidLayers(undefined)).to.be.an("array").and.to.be.empty;
            expect(removeInvalidLayers(null)).to.be.an("array").and.to.be.empty;
            expect(removeInvalidLayers("string")).to.be.an("array").and.to.be.empty;
            expect(removeInvalidLayers(1234)).to.be.an("array").and.to.be.empty;
            expect(removeInvalidLayers(true)).to.be.an("array").and.to.be.empty;
            expect(removeInvalidLayers(false)).to.be.an("array").and.to.be.empty;
            expect(removeInvalidLayers({})).to.be.an("array").and.to.be.empty;
        });
        it("should remove layers that are no string and no object", () => {
            const layers = [
                    {filterId: "A"},
                    1234,
                    {
                        filterId: "C"
                    },
                    false,
                    {filterId: "F"}
                ],
                expected = [
                    {filterId: "A"},
                    {
                        filterId: "C"
                    },
                    {filterId: "F"}
                ];

            expect(removeInvalidLayers(layers)).to.deep.equal(expected);
        });
    });
});
