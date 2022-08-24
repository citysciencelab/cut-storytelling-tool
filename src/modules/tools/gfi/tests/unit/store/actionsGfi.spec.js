import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actionsGfi.js";

describe("src/modules/tools/gfi/store/actions/actionsGfi.js", () => {
    describe("updateClick: Listener for click on the map", () => {
        it("commits setGfiFeatures and start collectGfiFeatures", () => {
            const dispatch = sinon.spy(),
                commit = sinon.spy();

            actions.updateClick({commit, dispatch});
            expect(commit.calledOnce).to.be.true;
            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equal("MapMarker/removePolygonMarker");
            expect(dispatch.secondCall.args[0]).to.equal("collectGfiFeatures");
        });
    });
});
