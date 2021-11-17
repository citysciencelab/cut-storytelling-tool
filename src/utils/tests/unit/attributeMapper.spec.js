import {expect} from "chai";
import attributeMapper from "../../attributeMapper.js";
const props = {
    random_text: "foobar",
    random_boolean: true,
    random_int: 12345,
    random_float: 1.23,
    random_date: "2021-11-17 13:02:00",
    random_datastreams: [
        {
            Observations: [
                {
                    result: 123
                }
            ]
        },
        {
            Observations: [
                {
                    result: 456
                }
            ]
        }
    ]
};

before(() => {
    i18next.init({
        lng: "cimode",
        debug: false
    });
});

describe("src/utils/attributeMapper.js", () => {
    describe("attributeMapper", () => {
        it("should map object with single attribute", () => {
            const mappingObj = {
                random_text: "text"
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    text: "foobar"
                });
        });
        it("should map object with single attribute and objectpath", () => {
            const mappingObj = {
                "@random_text": "text"
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    text: "foobar"
                });
        });
        it("should map object with single attribute and nested objectpath", () => {
            const mappingObj = {
                "@random_datastreams.0.Observations.0.result": "result"
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    result: 123
                });
        });
        it("should map object with multiple attributes", () => {
            const mappingObj = {
                random_text: "text",
                random_boolean: "boolean"
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    text: "foobar",
                    boolean: true
                });
        });
        it("should map object with multiple attributes with nested objectpath", () => {
            const mappingObj = {
                random_text: "text",
                random_boolean: "boolean",
                "@random_datastreams.0.Observations.0.result": "result"
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    text: "foobar",
                    boolean: true,
                    result: 123
                });
        });
        it("should map object with mapping object and condition:endsWith", () => {
            const mappingObj = {
                random_text: {
                    name: "text",
                    condition: "endsWith"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    text: "foobar"
                });
        });
        it("should map object with mapping object and condition:startsWith", () => {
            const mappingObj = {
                random_text: {
                    name: "text",
                    condition: "startsWith"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    text: "foobar"
                });
        });
        it("should map object with mapping object and condition:contains", () => {
            const mappingObj = {
                random_text: {
                    name: "text",
                    condition: "contains"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    text: "foobar"
                });
        });
        it("should map object with mapping object and suffix", () => {
            const mappingObj = {
                random_text: {
                    name: "text",
                    condition: "contains",
                    suffix: "barfoo"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    text: "foobar barfoo"
                });
        });
        it("should map object with mapping object and prefix", () => {
            const mappingObj = {
                random_text: {
                    name: "text",
                    condition: "contains",
                    prefix: "barfoo"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    text: "barfoofoobar"
                });
        });
        it("should map object with mapping object and type:date", () => {
            const mappingObj = {
                random_date: {
                    name: "date",
                    condition: "contains",
                    type: "date"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    date: "17.11.2021 13:02:00"
                });
        });
        it("should map object with mapping object and type:date and format:YYYY-MM-DD", () => {
            const mappingObj = {
                random_date: {
                    name: "date",
                    condition: "contains",
                    type: "date",
                    format: "YYYY-MM-DD"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    date: "2021-11-17"
                });
        });
        it("should map object with mapping object and type:number", () => {
            const mappingObj = {
                random_int: {
                    name: "integer",
                    condition: "contains",
                    type: "number"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    integer: "12.345"
                });
        });
        it("should map object with mapping object and type:number", () => {
            const mappingObj = {
                random_float: {
                    name: "float",
                    condition: "contains",
                    type: "number"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    float: "1,23"
                });
        });
        it("should map object with mapping object and type:boolean", () => {
            const mappingObj = {
                random_boolean: {
                    name: "boolean",
                    condition: "contains",
                    type: "boolean"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    boolean: true
                });
        });
        it("should map object with mapping object and type:boolean and format", () => {
            const mappingObj = {
                random_boolean: {
                    name: "boolean",
                    condition: "contains",
                    type: "boolean",
                    format: {
                        true: "Ja",
                        false: "Nein"
                    }
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    boolean: "Ja"
                });
        });
        it("should map object with mapping object and type:boolean and format with i18next", () => {
            const mappingObj = {
                random_boolean: {
                    name: "boolean",
                    condition: "contains",
                    type: "boolean",
                    format: {
                        true: "common:modules.tools.gfi.boolean.yes",
                        false: "common:modules.tools.gfi.boolean.no"
                    }
                }
            };

            // i18next only returns the path.
            // Propably mocking of language-file would get the right translated value?
            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    boolean: "modules.tools.gfi.boolean.yes"
                });
        });
        it("should map object with mapping object and no type (defaults to string)", () => {
            const mappingObj = {
                random_boolean: {
                    name: "boolean",
                    condition: "contains"
                },
                random_int: {
                    name: "int",
                    condition: "contains"
                }
            };

            expect(attributeMapper(props, mappingObj)).to.deep.equal(
                {
                    boolean: "true",
                    int: "12345"
                });
        });
    });
});
