import {MapMode, toMapMode} from "../../../store/enums";
import {expect} from "chai";

describe("src/modules/map/store/enums.js", () => {

    describe("check toMapMode", () => {
        it("shall deliver right mode", () => {
            expect(toMapMode(null)).to.be.equals(MapMode.MODE_2D);
            expect(toMapMode(undefined)).to.be.equals(MapMode.MODE_2D);
            expect(toMapMode(2)).to.be.equals(MapMode.MODE_2D);
            expect(toMapMode("0")).to.be.equals(MapMode.MODE_2D);
            expect(toMapMode("2d")).to.be.equals(MapMode.MODE_2D);
            expect(toMapMode("1")).to.be.equals(MapMode.MODE_3D);
            expect(toMapMode("3d")).to.be.equals(MapMode.MODE_3D);
            expect(toMapMode("2")).to.be.equals(MapMode.MODE_OB);
            expect(toMapMode("oblique")).to.be.equals(MapMode.MODE_OB);
        });


    });
});
