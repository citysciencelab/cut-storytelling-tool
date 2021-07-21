import {expect} from "chai";
import convert from "../../../parametricUrl/converter";

describe("src/utils/converter.js", () => {
    describe("convert", () => {
        it("convert String  to boolean", () => {
            expect(convert("false")).to.be.equals(false);
            expect(convert("FAlse")).to.be.equals(false);
            expect(convert("false   ")).to.be.equals(false);
            expect(convert("  false")).to.be.equals(false);
            expect(convert("0")).to.be.equals(false);
            expect(convert(0)).to.be.equals(false);
            expect(convert(false)).to.be.equals(false);

            expect(convert("true")).to.be.equals(true);
            expect(convert("True")).to.be.equals(true);
            expect(convert("true   ")).to.be.equals(true);
            expect(convert("  true")).to.be.equals(true);
            expect(convert("1")).to.be.equals(true);
            expect(convert("")).to.be.equals(true);
            expect(convert(1)).to.be.equals(true);
            expect(convert(true)).to.be.equals(true);

            expect(convert(null)).to.be.equals(false);
            expect(convert(undefined)).to.be.equals(false);
            expect(convert("nix")).to.be.equals("nix");
        });

    });
    it("convert 2 numbers as String or String[] to Array with numbers", () => {
        expect(convert("[]")).to.be.deep.equals([]);
        expect(convert("[553925,5931898]")).to.be.deep.equals([553925, 5931898]);
        expect(convert("553925,5931898")).to.be.deep.equals([553925, 5931898]);
        expect(convert(",5931898")).to.be.equals(",5931898");
        expect(convert(",")).to.be.equals(",");
    });

});
