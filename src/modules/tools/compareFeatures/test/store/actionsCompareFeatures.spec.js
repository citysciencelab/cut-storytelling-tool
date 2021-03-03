// import sinon from "sinon";
// import {expect} from "chai";
// import actions from "../../../store/actionsCompareFeatures";

// describe("src/modules/tools/compareFeatures/store/actionsCompareFeatures.js", () => {
//     let commit, dispatch, getters;

//     beforeEach(() => {
//         commit = sinon.spy();
//         dispatch = sinon.spy();
//         getters = sinon.spy();
//     });

//     afterEach(sinon.restore);

//     describe("validateInput", () => {
//         it("Validates the coordinates according to the ETRS89 coordinate system", () => {
//             const state = {
//                 currentSelection: "ETRS89",
//                 coordinatesEasting: {id: "easting", name: "", value: "564459.13", errorMessage: ""}
//             };

//             actions.validateInput({state, commit, dispatch, getters}, state.coordinatesEasting);

//             expect(commit.firstCall.args[0]).to.equal("resetEastingMessages");
//         });
//     });
// });
