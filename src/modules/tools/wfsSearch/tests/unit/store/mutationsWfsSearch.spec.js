import sinon from "sinon";
import {expect} from "chai";
import mutations from "../../../store/mutationsWfsSearch";

describe("src/modules/tools/wfsSearch/store/mutationsWfsSearch.js", () => {

    afterEach(sinon.restore);

    describe("addOptions", () => {
        const addedOptions = [
                "",
                "flur",
                "zaehler",
                "nenner"
            ],
            currentInstanceIndex = 0,
            option = "additional option";
        let instances;

        beforeEach(() => {
            instances = [
                {
                    addedOptions: [...addedOptions]
                }
            ];
        });

        it("should add a value if it has not already been added as an option and addedOptions is not an array (yet)", () => {
            delete instances[currentInstanceIndex].addedOptions;

            mutations.addOptions({currentInstanceIndex, instances}, option);

            expect(instances[currentInstanceIndex].addedOptions).to.eql([option]);
        });
        it("should add a value if it has not already been added as an option", () => {
            mutations.addOptions({currentInstanceIndex, instances}, option);

            expect(instances[currentInstanceIndex].addedOptions).to.eql([...addedOptions, option]);
        });
        it("should log a warning on the console if the value is already present in the addedOptions", () => {
            const warn = sinon.spy(),
                zaehler = "zaehler";

            sinon.stub(console, "warn").callsFake(warn);

            mutations.addOptions({currentInstanceIndex, instances}, zaehler);

            expect(warn.calledOnce).to.be.true;
            expect(warn.firstCall.args).to.eql([`WfsSearch: The option ${zaehler} is added multiple times to the formular. This entry will be skipped.`]);
        });
    });

    describe("setSelectedOptions", () => {
        let payload,
            state;

        beforeEach(() => {
            payload = null;
            state = {
                selectedOptions: {}
            };
        });

        it("should set the selected options to the payload if the payload is falsy", () => {
            mutations.setSelectedOptions(state, payload);

            expect(state.selectedOptions).to.equal(null);
        });
        it("should set the selected options to the payload if the payload is an empty object", () => {
            payload = {};

            mutations.setSelectedOptions(state, payload);

            expect(state.selectedOptions).to.eql({});
        });
        it("should remove the state parameter of the currently selected options if the value is an empty String", () => {
            payload = {index: 0, options: "flur.zaehler", value: ""};

            mutations.setSelectedOptions(state, payload);

            expect(state.selectedOptions).to.eql({});
        });
        it("should update the state parameter to the currently selected options", () => {
            payload = {index: 0, options: "flur.zaehler", value: 1};

            mutations.setSelectedOptions(state, payload);

            expect(state.selectedOptions).to.eql({zaehler: {index: 0, value: 1}});
        });
    });

});
