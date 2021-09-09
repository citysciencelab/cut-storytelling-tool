import {expect} from "chai";
import {buildPath, prepareOptionsWithId, removePath} from "../../../utils/pathFunctions";

describe("src/modules/tools/wfsSearch/utils/pathFunctions.js", () => {
    describe("buildPath", () => {
        it("should build a path to the currentOption based on the optionsObject", () => {
            const currentOption = "nenner",
                optionsObject = {
                    "": {
                        value: "Waldesch"
                    },
                    flur: {
                        index: 0,
                        value: "1"
                    },
                    zaehler: {
                        index: 2,
                        value: "2038"
                    }
                };

            expect(buildPath(optionsObject, currentOption)).to.eql(["Waldesch", "flur", 0, "zaehler", 2, currentOption]);
        });
    });

    describe("prepareOptionsWithId", () => {
        it("should return an array of option-objects containing the parameter 'fieldValue' and 'displayName'", () => {
            const ids = ["741", "879", "2038", "3954"],
                elements = [
                    {
                        id: ids[0],
                        nenner: ["0", "420"]
                    },
                    {
                        id: ids[1],
                        nenner: ["420"]
                    },
                    {
                        id: ids[2],
                        nenner: ["420"]
                    },
                    {
                        id: ids[3],
                        nenner: ["420"]
                    }
                ];

            expect(prepareOptionsWithId(elements)).to.eql([
                {
                    fieldValue: ids[0],
                    displayName: ids[0]
                },
                {
                    fieldValue: ids[1],
                    displayName: ids[1]
                },
                {
                    fieldValue: ids[2],
                    displayName: ids[2]
                },
                {
                    fieldValue: ids[3],
                    displayName: ids[3]
                }
            ]);
        });
    });

    describe("removePath", () => {
        const element = "val";

        it("should return the element itself if not path is present", () => {
            expect(removePath(element)).to.equal(element);
        });
        it("should remove the path to an element an return the value", () => {
            const path = "path.to.";

            expect(removePath(path + element)).to.equal(element);
        });
    });
});
