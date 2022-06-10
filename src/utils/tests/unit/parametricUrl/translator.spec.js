import {expect} from "chai";
import {translate} from "../../../parametricUrl/translator";

describe("src/utils/parametricUrl/urlParamsTranslator.js", () => {
    describe("translate", () => {
        it("translate kmlimport to Tools/FileImport/active", async () => {
            const key = "isinitopen",
                value = "kmlimport",

                entry = await translate(key, value);

            expect(entry.key).to.be.equals("Tools/FileImport/active");
            expect(entry.value).to.be.equals(true);
        });
        it("translate isinitopen=fileimport to Tools/Fileimport/active", async () => {
            const key = "isinitopen",
                value = "fileimport",

                entry = await translate(key, value);

            expect(entry.key).to.be.equals("Tools/fileimport/active");
            expect(entry.value).to.be.equals(true);
        });
        it("translate startupmodul=draw to Tools/draw/active", async () => {
            const key = "startupmodul",
                value = "draw",

                entry = await translate(key, value);

            expect(entry.key).to.be.equals("Tools/draw/active");
            expect(entry.value).to.be.equals(true);
        });

    });
});
