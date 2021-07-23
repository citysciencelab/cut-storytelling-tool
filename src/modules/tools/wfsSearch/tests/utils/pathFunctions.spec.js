import {expect} from "chai";
import {removePath} from "../../utils/pathFunctions";

describe("src/modules/tools/wfsSearch/utils/pathFunctions.js", () => {
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
