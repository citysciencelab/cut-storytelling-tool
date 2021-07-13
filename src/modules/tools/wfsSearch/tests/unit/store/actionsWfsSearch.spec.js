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

    describe("instanceChanged", () => {
        it("should update the currently set search instance", () => {
            const instanceIndex = 1;

            actions.instanceChanged({commit, dispatch}, instanceIndex);

            expect(commit.getCall(0).args).to.eql(["setCurrentInstanceIndex", instanceIndex]);
            expect(dispatch.firstCall.args).to.eql(["prepareModule"]);
        });
    });

    describe("prepareModule", () => {
        it("should prepare the module if the WFS is given", () => {
            const getters = {
                    currentInstance: {
                        selectSource: 122,
                        requestConfig: {
                            layerId: 123,
                            likeFilter: "equal",
                            restLayerId: 456,
                            storedQueryId: 5
                        }
                    }
                },
                name = "wfsName";

            actions.prepareModule({commit, dispatch, getters});

            expect(dispatch.firstCall.args).to.eql(["resetModule", false]);
            expect(dispatch.secondCall.args).to.eql(["resetModule", true]);
            expect(dispatch.thirdCall.args[0]).to.eql("Alerting/addSingleAlert");
            expect(dispatch.thirdCall.args[1]).to.eql(i18next.t("common:modules.tools.wfsSearch.wrongConfig", {name: name}));
            expect(dispatch.thirdCall.args[2]).to.eql({root: true});

            expect(dispatch.callCount).to.equal(3);
            // TODO: If ist noch nicht abgedeckt
        });
    });

    describe("resetModule", () => {
        it("should reset state parameters to their initial state", () => {
            const closeTool = false;

            actions.resetModule({commit, dispatch}, closeTool);

            expect(commit.getCall(0).args).to.eql(["setRequiredValues", null]);
            expect(commit.getCall(1).args).to.eql(["setSearched", false]);
            expect(commit.getCall(2).args).to.eql(["setService", null]);
            expect(commit.getCall(3).args).to.eql(["setUserHelp", ""]);
            expect(commit.callCount).to.equal(4);
            expect(dispatch.firstCall.args).to.eql(["resetResult"]);
        });
        it("should reset state parameters to their initial state and reset the tool completely", () => {
            const closeTool = true;

            actions.resetModule({commit, dispatch}, closeTool);

            expect(commit.getCall(0).args).to.eql(["setRequiredValues", null]);
            expect(commit.getCall(1).args).to.eql(["setSearched", false]);
            expect(commit.getCall(2).args).to.eql(["setService", null]);
            expect(commit.getCall(3).args).to.eql(["setUserHelp", ""]);
            expect(dispatch.firstCall.args).to.eql(["resetResult"]);

            expect(commit.getCall(4).args).to.eql(["setCurrentInstanceIndex", 0]);
            expect(commit.getCall(5).args).to.eql(["setParsedSource", null]);
            expect(commit.getCall(6).args).to.eql(["setActive", false]);

            expect(commit.callCount).to.equal(7);
        });
    });

    describe("retrieveData", () => {
        it("should retrieve information from the external file", () => {
            const getters = {
                currentInstance: {
                    selectSource: 122
                }
            };

            actions.retrieveData({commit, getters});
        });
    });

    describe("resetResult", () => {
        it("should reset the results in the state", () => {
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
