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
                        "addedOptions": [
                            "",
                            "flur",
                            "zaehler",
                            "nenner"
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
