import {expect} from "chai";
import {translate} from "../../urlParamsTranslator.js";

describe("src/utils/urlParamsTranslator.js", () => {
    describe("translate", () => {
        it("translate kmlimport to Tools/FileImport/active", () => {
            const key = "isinitopen",
                value = "kmlimport",

                entry = translate(key, value);

            expect(entry.key).to.be.equals("Tools/FileImport/active");
            expect(entry.value).to.be.equals(true);
        });
        it("translate isinitopen=fileimport to Tools/Fileimport/active", () => {
            const key = "isinitopen",
                value = "fileimport",

                entry = translate(key, value);

            expect(entry.key).to.be.equals("Tools/fileimport/active");
            expect(entry.value).to.be.equals(true);
        });
        it("translate startupmodul=draw to Tools/draw/active", () => {
            const key = "startupmodul",
                value = "draw",

                entry = translate(key, value);

            expect(entry.key).to.be.equals("Tools/draw/active");
            expect(entry.value).to.be.equals(true);
        });

    });
});
