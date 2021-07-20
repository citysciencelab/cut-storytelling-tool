import {expect} from "chai";
import {fieldValueChanged, prepareLiterals} from "../../utils/literalFunctions";

describe("src/modules/tools/wfsSearch/utils/literalFunctions.js", () => {

    const stateLiterals = [
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
                            "value": null
                        }
                    },
                    {
                        "field": {
                            "type": "equal",
                            "inputLabel": "Flurnummer",
                            "fieldName": "flur",
                            "options": "flur",
                            "id": "wfsSearch-clause-0+field-1",
                            "value": null
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
                            "value": null
                        }
                    },
                    {
                        "field": {
                            "type": "equal",
                            "inputLabel": "Nenner",
                            "fieldName": "nenner",
                            "options": "flur.zaehler.nenner",
                            "id": "wfsSearch-clause-0+field-3",
                            "value": null
                        }
                    }
                ],
                "id": "wfsSearch-clause-0"
            }
        }
    ];

    // TODO: replaceAll scheint zu neu für Mocha zu sein!

    // describe("createUserHelp", () => {
    //     it("should add unique ids to the clauses and fields", () => {

    //         createUserHelp(stateLiterals);
    //     });
    // });
    describe("prepareLiterals", () => {
        it("should add unique ids to the clauses and fields", () => {

            prepareLiterals(stateLiterals);

            expect(prepareLiterals(stateLiterals)).to.eql({
                "wfsSearch-clause-0+field-0": null,
                "wfsSearch-clause-0+field-2": null
            });
        });
    });
    describe("fieldValueChanged", () => {
        it("should update the required Values and return them", () => {
            const id = "wfsSearch-clause-0+field-0",
                value = "Waldesch",
                requiredValues = {
                    "wfsSearch-clause-0+field-0": "Waldesch",
                    "wfsSearch-clause-0+field-2": null
                },
                parameterIndex = 0;

            fieldValueChanged(id, value, stateLiterals, requiredValues, parameterIndex);

            expect(fieldValueChanged(id, value, stateLiterals, requiredValues, parameterIndex)).to.eql({
                "wfsSearch-clause-0+field-0": "Waldesch",
                "wfsSearch-clause-0+field-2": null
            });
        });
    });
});
