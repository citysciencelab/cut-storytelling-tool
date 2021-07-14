import sinon from "sinon";
import {expect} from "chai";
import mutations from "../../../store/mutationsWfsSearch";

describe("src/modules/tools/wfsSearch/store/mutationsWfsSearch.js", () => {

    afterEach(sinon.restore);

    describe("addOptions", () => {
        it("should add a value if it has not already been added as an option", () => {
            const currentInstanceIndex = 0,
                instances = [
                    {
                        "title": "Flurstücke RLP Dropdowns",
                        "requestConfig": {
                            "layerId": "rlp_wfs"
                        },
                        "resultList": "showAll",
                        "selectSource": "./resources/externalSource.json",
                        "literals": [
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
                        ],
                        "addedOptions": [
                            "",
                            "flur",
                            "zaehler",
                            "nenner"
                        ]
                    },
                    {
                        "title": "Flurstücke RLP",
                        "requestConfig": {
                            "layerId": "rlp_wfs",
                            "likeFilter": {
                                "wildCard": "*",
                                "singleChar": ".",
                                "escape": "!"
                            }
                        },
                        "resultList": {
                            "land": "Land",
                            "gmknr": "Gemarkungsnummer",
                            "gemname": "Gemarkungsname",
                            "flur": "Flur",
                            "zaehler": "Zähler",
                            "nenner": "Nenner",
                            "kennzeichen": "Kennzeichen",
                            "flurflst": "Flurstück",
                            "katasteramt": "Katasteramt",
                            "the_geom": "Geometrie"
                        },
                        "suggestions": {
                            "length": 0
                        },
                        "literals": [
                            {
                                "clause": {
                                    "type": "and",
                                    "literals": [
                                        {
                                            "field": {
                                                "type": "equal",
                                                "inputLabel": "Gemarkungsname",
                                                "fieldName": "gemname",
                                                "required": true
                                            }
                                        },
                                        {
                                            "field": {
                                                "type": "equal",
                                                "inputLabel": "Flurnummer",
                                                "fieldName": "flur"
                                            }
                                        },
                                        {
                                            "field": {
                                                "type": "equal",
                                                "inputLabel": "Zähler",
                                                "fieldName": "zaehler",
                                                "required": true
                                            }
                                        },
                                        {
                                            "field": {
                                                "type": "equal",
                                                "inputLabel": "Nenner",
                                                "fieldName": "nenner"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ],
                currentInstance = instances[currentInstanceIndex],
                option = "weitere Option";

            mutations.addOptions({currentInstanceIndex, instances}, option);
            expect(currentInstance.addedOptions).to.eql(["", "flur", "zaehler", "nenner", "weitere Option"]);
        });
    });
    describe("setSelectedOptions", () => {
        it("should update the state parameter to the currently selected options", () => {
            const state = {
                    selectedOptions: {}
                },
                payload = {index: 0, options: "flur", value: 1};

            mutations.setSelectedOptions(state, payload);
            expect(state.selectedOptions).to.eql({flur: {index: 0, value: 1}});
        });
        it("should return an empty object for the selected options if the payload is an empty object", () => {
            const state = {
                    selectedOptions: {}
                },
                payload = {};

            mutations.setSelectedOptions(state, payload);
            expect(state.selectedOptions).to.eql({});
        });
    });

});
