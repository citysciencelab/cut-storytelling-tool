import sinon from "sinon";
import {expect} from "chai";
import actions from "../../../store/actionsWfsSearch";

describe("src/modules/tools/wfsSearch/store/actionsWfsSearch.js", () => {
    let commit, dispatch;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
    });

    afterEach(sinon.restore);

    describe("resetResult", () => {
        it("resets the results in the state", () => {
            const state = {
                requiredValues: {Gemarkung: "Waldesch", Flur: 5}
            };

            actions.resetResult({state, commit, dispatch});

            expect(commit.getCall(0).args).to.eql(["setValuesReset", true]);
            expect(commit.getCall(1).args).to.eql(["setSearched", false]);
            expect(commit.getCall(2).args).to.eql(["setResults", []]);
            expect(commit.getCall(3).args).to.eql(["setSelectedOptions", {}]);
            expect(commit.callCount).to.equal(4);
            expect(dispatch.firstCall.args).to.eql(["MapMarker/removePointMarker", null, {root: true}]);
            expect(state.requiredValues).to.eql({Gemarkung: "", Flur: ""});
        });
    });
});
