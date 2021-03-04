import sinon from "sinon";
import {expect} from "chai";
import actions from "../../store/actionsCompareFeatures";

describe("src/modules/tools/compareFeatures/store/actionsCompareFeatures.js", () => {
    let commit, dispatch, getters;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        getters = sinon.spy();
    });

    afterEach(sinon.restore);

    describe("removeFeature", () => {
        it("removes the feature from the layer", () => {
            const state = {
                gfiFeature: {layerId: "1711", featureId: "1234"},
                preparedList: {"1711": [{featureId: "feature1", layerId: "1711"}]}
            };

            actions.removeFeature({state, dispatch}, state.gfiFeature);
            expect(dispatch.firstCall.args[0]).to.equal("removeFeatureFromPreparedList");
            expect(dispatch.firstCall.args[1]).to.eql({
                features: [{featureId: "feature1", layerId: "1711"}],
                featureId: "1234",
                selectedLayer: "1711"
            });
        });
    });
    describe("prepareFeatureListToShow", () => {
        it("prepares the feature list", () => {
            const state = {
                list: [],
                gfiAttributes: {layerId: "1711", featureId: "APP_KRANKENHAEUSER_HH_27", properties: {name: "ATOS Klinik Fleetinsel Hamburg", id: "APP_KRANKENHAEUSER_HH_27", Ort: "Hamburg"}},
                layerId: 1711,
                layerFeatures: {"1711": [{layerId: "1711", featureId: "APP_KRANKENHAEUSER_HH_27", properties: {name: "ATOS Klinik Fleetinsel Hamburg", id: "APP_KRANKENHAEUSER_HH_27", Ort: "Hamburg"}}]},
                featureList: {"1711": [{layerId: "1711", featureId: "APP_KRANKENHAEUSER_HH_27", properties: {name: "ATOS Klinik Fleetinsel Hamburg", id: "APP_KRANKENHAEUSER_HH_27", Ort: "Hamburg"}}]},
                preparedList: {}
            };

            actions.prepareFeatureListToShow({state, commit}, state.gfiAttributes);
            expect(commit.firstCall.args[0]).to.equal("setHasFeatures");
            expect(state.preparedList).to.eql({
                "1711": [
                    {"APP_KRANKENHAEUSER_HH_27": "ATOS Klinik Fleetinsel Hamburg", "col-1": "name"},
                    {"APP_KRANKENHAEUSER_HH_27": "APP_KRANKENHAEUSER_HH_27", "col-1": "id"},
                    {"APP_KRANKENHAEUSER_HH_27": "Hamburg", "col-1": "Ort"}
                ]
            });
        });
    });
});
