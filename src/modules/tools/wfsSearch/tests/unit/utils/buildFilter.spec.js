import {expect} from "chai";
import {buildFilter, buildXmlFilter, buildStoredFilter} from "../../../utils/buildFilter";

describe("src/modules/tools/wfsSearch/utils/buildFilter.js", () => {
    const values = [
        {
            "clause": {
                "type": "and",
                "literals": [
                    {
                        "field": {
                            "type": "equal",
                            "inputLabel": "Gemarkungsname*",
                            "fieldName": "gemname",
                            "options": "",
                            "required": true,
                            "id": "wfsSearch-clause-0+field-0",
                            "value": "Waldesch"
                        }
                    },
                    {
                        "field": {
                            "type": "equal",
                            "inputLabel": "Flurnummer",
                            "fieldName": "flur",
                            "options": "flur",
                            "id": "wfsSearch-clause-0+field-1",
                            "value": "1"
                        }
                    },
                    {
                        "field": {
                            "type": "equal",
                            "inputLabel": "Zähler*",
                            "fieldName": "zaehler",
                            "options": "flur.zaehler",
                            "required": true,
                            "id": "wfsSearch-clause-0+field-2",
                            "value": "741"
                        }
                    },
                    {
                        "field": {
                            "type": "equal",
                            "inputLabel": "Nenner",
                            "fieldName": "nenner",
                            "options": "flur.zaehler.nenner",
                            "id": "wfsSearch-clause-0+field-3",
                            "value": "0"
                        }
                    }
                ],
                "id": "wfsSearch-clause-0"
            }
        }
    ];

    describe("buildFilter", () => {
        it("should build a XML filter based upon the literal structure defined in the config and given user inputs", () => {
            expect(buildFilter(values)).to.eql([
                "<And><PropertyIsEqualTo matchCase=\"false\"><PropertyName>gemname</PropertyName><Literal>Waldesch</Literal></PropertyIsEqualTo><PropertyIsEqualTo matchCase=\"false\"><PropertyName>flur</PropertyName><Literal>1</Literal></PropertyIsEqualTo><PropertyIsEqualTo matchCase=\"false\"><PropertyName>zaehler</PropertyName><Literal>741</Literal></PropertyIsEqualTo><PropertyIsEqualTo matchCase=\"false\"><PropertyName>nenner</PropertyName><Literal>0</Literal></PropertyIsEqualTo></And>"
            ]);
        });
    });

    describe("buildStoredFilter", () => {
        it("should build a filter based upon the literal structure defined in the config and given user inputs", () => {
            expect(buildStoredFilter(values)).to.equal("&gemname=Waldesch&flur=1&zaehler=741&nenner=0");
        });
    });

    describe("buildXmlFilter", () => {
        it("should build the XML filter for the given fieldName and value", () => {
            const field = {
                "type": "equal",
                "inputLabel": "Gemarkungsname*",
                "fieldName": "gemname",
                "options": "",
                "required": true,
                "id": "wfsSearch-clause-0+field-0",
                "value": "Waldesch"
            };

            expect(buildXmlFilter(field)).to.equal("<PropertyIsEqualTo matchCase=\"false\"><PropertyName>gemname</PropertyName><Literal>Waldesch</Literal></PropertyIsEqualTo>");
        });
    });
});
