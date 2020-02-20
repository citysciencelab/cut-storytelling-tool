import Model from "@modules/core/util.js";
import {expect} from "chai";

describe("core/Util", function () {
    let model;

    describe("punctuate", function () {
        before(function () {
            model = new Model();
        });
        it("should set two points for 7 digit number with decimals", function () {
            expect(model.punctuate(1234567.890)).to.equal("1.234.567,89");
        });
        it("should set two  points for 7 digit number", function () {
            expect(model.punctuate(3456789)).to.equal("3.456.789");
        });
        it("should set point for 4 digit number", function () {
            expect(model.punctuate(1000)).to.equal("1.000");
        });
        it("should not set point for 3 digit number", function () {
            expect(model.punctuate(785)).to.equal("785");
        });
        it("should not set point for 2 digit number", function () {
            expect(model.punctuate(85)).to.equal("85");
        });
        it("should not set point for 1 digit number", function () {
            expect(model.punctuate(1)).to.equal("1");
        });
        it("should work with 1 digit number with decimals", function () {
            expect(model.punctuate(5.22)).to.equal("5,22");
        });
    });
    describe("sort", function () {
        before(function () {
            model = new Model();
        });
        // undefined
        it("should return undefined for undefined input", function () {
            expect(model.sort("", undefined)).to.be.undefined;
        });
        // array
        it("should sort array[String] alphanumerically", function () {
            const array = ["Test 11", "Test 1", "Test 2", "Test 5"];

            expect(model.sort("", array)).to.deep.equal(["Test 1", "Test 2", "Test 5", "Test 11"]);
        });
        it("should sort array[int] alphanumerically", function () {
            const array = [11, 1, 2, 5];

            expect(model.sort("", array)).to.deep.equal([1, 2, 5, 11]);
        });
        it("should sort array[float] alphanumerically", function () {
            const array = [11.1, 1.1, 2.1, 5.1];

            expect(model.sort("", array)).to.deep.equal([1.1, 2.1, 5.1, 11.1]);
        });
        // object
        it("should sort array[object] with integers alphanumerically first attr1, then attr2", function () {
            const array = [];

            array.push({attr1: 1, attr2: 11});
            array.push({attr1: 11, attr2: 5});
            array.push({attr1: 5, attr2: 5});
            array.push({attr1: 5, attr2: 1});
            expect(model.sort("", array, "attr1", "attr2")).to.deep.equal([
                {attr1: 1, attr2: 11}, {attr1: 5, attr2: 1}, {attr1: 5, attr2: 5}, {attr1: 11, attr2: 5}
            ]);
        });
        it("should sort array[object] with integers alphanumerically first attr2, then attr1", function () {
            const array = [];

            array.push({attr1: 1, attr2: 11});
            array.push({attr1: 11, attr2: 5});
            array.push({attr1: 5, attr2: 5});
            array.push({attr1: 5, attr2: 1});
            expect(model.sort("", array, "attr2", "attr1")).to.deep.equal([
                {attr1: 5, attr2: 1}, {attr1: 5, attr2: 5}, {attr1: 11, attr2: 5}, {attr1: 1, attr2: 11}
            ]);
        });
        it("should sort array[object] with integers alphanumerically only attr1", function () {
            const array = [];

            array.push({attr1: 1, attr2: 11});
            array.push({attr1: 11, attr2: 5});
            array.push({attr1: 5, attr2: 5});
            array.push({attr1: 5, attr2: 1});
            expect(model.sort("", array, "attr1")).to.deep.equal([
                {attr1: 1, attr2: 11}, {attr1: 5, attr2: 5}, {attr1: 5, attr2: 1}, {attr1: 11, attr2: 5}
            ]);
        });
        it("should sort array[object] with integers alphanumerically only attr2", function () {
            const array = [];

            array.push({attr1: 1, attr2: 11});
            array.push({attr1: 11, attr2: 5});
            array.push({attr1: 5, attr2: 5});
            array.push({attr1: 5, attr2: 1});
            expect(model.sort("", array, "attr2")).to.deep.equal([
                {attr1: 5, attr2: 1}, {attr1: 11, attr2: 5}, {attr1: 5, attr2: 5}, {attr1: 1, attr2: 11}
            ]);
        });
        it("should sort array[object] with integers alphanumerically attr1 === undefined attr2", function () {
            const array = [];

            array.push({attr1: 1, attr2: 11});
            array.push({attr1: 11, attr2: 5});
            array.push({attr1: 5, attr2: 5});
            array.push({attr1: 5, attr2: 1});
            expect(model.sort("", array, undefined, "attr2")).to.deep.equal([
                {attr1: 5, attr2: 1}, {attr1: 11, attr2: 5}, {attr1: 5, attr2: 5}, {attr1: 1, attr2: 11}
            ]);
        });
        it("should sort array[object] with Strings alphanumerically first attr1, then attr2", function () {
            const array = [];

            array.push({attr1: "1", attr2: ""});
            array.push({attr1: "11", attr2: "a"});
            array.push({attr1: "5", attr2: "b"});
            array.push({attr1: "5", attr2: "c"});

            expect(model.sort("", array, "attr1", "attr2")).to.deep.equal([
                {attr1: "1", attr2: ""}, {attr1: "5", attr2: "b"}, {attr1: "5", attr2: "c"}, {attr1: "11", attr2: "a"}
            ]);
        });
        it("should sort array[object] with Strings alphanumerically first attr2, then attr1", function () {
            const array = [];

            array.push({attr1: "1", attr2: ""});
            array.push({attr1: "11", attr2: "a"});
            array.push({attr1: "5", attr2: "b"});
            array.push({attr1: "5", attr2: "c"});

            expect(model.sort("", array, "attr2", "attr1")).to.deep.equal([
                {attr1: "1", attr2: ""}, {attr1: "11", attr2: "a"}, {attr1: "5", attr2: "b"}, {attr1: "5", attr2: "c"}
            ]);
        });

    });

    describe("convertArrayOfObjectsToCsv", function () {
        const array = [{attr1: "der", attr2: "die"}, {attr1: "das", attr2: "hier"}, {attr1: "dort", attr2: "oben"}];

        before(function () {
            model = new Model();
        });
        it("should return a string with a length of 39", function () {
            expect(model.convertArrayOfObjectsToCsv(array)).to.be.a("string").to.have.lengthOf(39);
        });
        it("should find four commtatas", function () {
            expect(model.convertArrayOfObjectsToCsv(array).match(/,/g)).to.have.lengthOf(4);
        });
        it("should find four linebreaks (\n)", function () {
            expect(model.convertArrayOfObjectsToCsv(array).match(/\n/g)).to.have.lengthOf(4);
        });
        it("should find four dollar signs", function () {
            expect(model.convertArrayOfObjectsToCsv(array, "$").match(/\$/g)).to.have.lengthOf(4);
        });
    });

    describe("generate proxy url", function () {
        it("should generate key without hostname from url", function () {
            let proxyURL = "";

            model = new Model();

            proxyURL = model.getProxyURL("https://dies.ist.ein.test/PFAD_ZU_TEST-QUELLE");
            expect(proxyURL).to.be.equal("/dies_ist_ein_test/PFAD_ZU_TEST-QUELLE");
        });

        it("should generate key with hostname from url", function () {
            let proxyURL = "";

            model = new Model({
                proxyHost: "https://test-proxy.example.com"
            });

            proxyURL = model.getProxyURL("https://dies.ist.ein.test/PFAD_ZU_TEST-QUELLE");
            expect(proxyURL).to.be.equal("https://test-proxy.example.com/dies_ist_ein_test/PFAD_ZU_TEST-QUELLE");
        });
        it("shouldn't transform url for local ressources I", function () {
            let proxyURL = "";

            model = new Model({
                proxyHost: "https://test-proxy.example.com"
            });

            proxyURL = model.getProxyURL("http://localhost/test.json");
            expect(proxyURL).to.be.equal("http://localhost/test.json");
        });
        it("shouldn't transform url for local ressources II", function () {
            let proxyURL = "";

            model = new Model({
                proxyHost: "https://test-proxy.example.com"
            });

            proxyURL = model.getProxyURL("./test.json");
            expect(proxyURL).to.be.equal("./test.json");
        });
    });
    describe("splitAddressString", function () {
        it("should split addressString with streetname without blank", function () {
            expect(model.splitAddressString("Straße 1, PLZ Stadt", ",", " ")).to.deep.equal([
                "Straße",
                "1",
                "PLZ",
                "Stadt"
            ]);
        });
        it("should split addressString with streetname without blank and housenumber with suffix", function () {
            expect(model.splitAddressString("Straße 1a, PLZ Stadt", ",", " ")).to.deep.equal([
                "Straße",
                "1a",
                "PLZ",
                "Stadt"
            ]);
        });
        it("should split addressString with streetname with blank", function () {
            expect(model.splitAddressString("Platz ohne Namen 1, PLZ Stadt", ",", " ")).to.deep.equal([
                "Platz ohne Namen",
                "1",
                "PLZ",
                "Stadt"
            ]);
        });
    });
    describe("sortObjectsAsAddress", function () {
        it("should return sorted objects", function () {
            const array = [];

            array.push({attr1: "aStraße 1b, 12345 Stadt"});
            array.push({attr1: "aStraße 1, 12345 Stadt"});
            array.push({attr1: "cStraße ohne Namen 10, 12345 Stadt"});
            array.push({attr1: "aStraße 10, 12345 Stadt"});
            array.push({attr1: "aStraße 2, 12345 Stadt"});
            array.push({attr1: "aStraße 1a, 12345 Stadt"});
            array.push({attr1: "bStraße 10, 12345 Stadt"});
            array.push({attr1: "12Straße 10, 12345 Stadt"});
            expect(model.sortObjectsAsAddress(array, "attr1")).to.deep.equal([
                {attr1: "12Straße 10, 12345 Stadt"},
                {attr1: "aStraße 1, 12345 Stadt"},
                {attr1: "aStraße 1a, 12345 Stadt"},
                {attr1: "aStraße 1b, 12345 Stadt"},
                {attr1: "aStraße 2, 12345 Stadt"},
                {attr1: "aStraße 10, 12345 Stadt"},
                {attr1: "bStraße 10, 12345 Stadt"},
                {attr1: "cStraße ohne Namen 10, 12345 Stadt"}
            ]);
        });
    });
    describe("isValidAddressString", function () {
        it("should return true for valid address strings", function () {
            expect(model.isValidAddressString("aStraße 1b, 12345 Stadt", ",", " ")).to.be.true;
            expect(model.isValidAddressString("aStraße 1, 12345 Stadt", ",", " ")).to.be.true;
            expect(model.isValidAddressString("cStraße ohne Namen 10, 12345 Stadt", ",", " ")).to.be.true;
        });
        it("should return false for invalid address stringsA", function () {
            expect(model.isValidAddressString("aStraße 1b 12345 Stadt", ",", " ")).to.be.false;
        });
        it("should return false for invalid address stringsB", function () {
            expect(model.isValidAddressString("aStraße, 12345 Stadt", ",", " ")).to.be.false;
        });
    });
});
