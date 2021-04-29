import sinon from "sinon";
import {expect} from "chai";
import actions from "../../store/actionsCompareFeatures";

describe("src/modules/tools/compareFeatures/store/actionsCompareFeatures.js", () => {
    let commit, dispatch, getters;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        getters = {
        };
    });

    afterEach(sinon.restore);

    describe("isFeatureOnCompareList", () => {
        const isFeatureSelected = sinon.fake.returns(false);

        beforeEach(() => {
            getters = {
                isFeatureSelected
            };
        });
        it("adds feature", () => {
            const state = {
                gfiFeature: {featureId: "feature2", layerId: "1711", properties: {Name: "Beispielschule"}},
                layerFeatures: {"1711": [{featureId: "feature1", layerId: "1711"}]},
                numberOfFeaturesToShow: 3
            };

            actions.isFeatureOnCompareList({state, dispatch, commit, getters}, state.gfiFeature);
            expect(commit.firstCall.args[0]).to.equal("setShowAlert");
            expect(commit.secondCall.args[0]).to.equal("setListFull");
            expect(commit.secondCall.args[1]).to.equal(false);
            expect(commit.thirdCall.args[0]).to.equal("addFeatureToLayer");
            expect(dispatch.firstCall.args[0]).to.equal("prepareFeatureListToShow");
        });
    });

    // describe("removeFeature", () => {
    //     it("removes the feature from the layer", () => {
    //         const state = {
    //             gfiFeature: {layerId: "1711", featureId: "1234"},
    //             preparedList: {"1711": [{featureId: "feature1", layerId: "1711"}]}
    //         };

    //         actions.removeFeature({state, dispatch}, state.gfiFeature);
    //         expect(dispatch.firstCall.args[0]).to.equal("removeFeatureFromPreparedList");
    //         expect(dispatch.firstCall.args[1]).to.eql({
    //             features: [{featureId: "feature1", layerId: "1711"}],
    //             featureId: "1234",
    //             selectedLayer: "1711"
    //         });
    //     });
    // });
    // describe("prepareFeatureListToShow", () => {
    //     it("prepares the feature list", () => {
    //         const state = {
    //             list: [],
    //             gfiAttributes: {layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}},
    //             layerId: 1711,
    //             layerFeatures: {"1711": [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}}]},
    //             featureList: {"1711": [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}}]},
    //             preparedList: {}
    //         };

    //         actions.prepareFeatureListToShow({state, commit}, state.gfiAttributes);
    //         expect(commit.firstCall.args[0]).to.equal("setHasFeatures");
    //         expect(state.preparedList).to.eql({
    //             "1711": [
    //                 {"Feature-1": "Krankenhaus-1", "col-1": "name"},
    //                 {"Feature-1": "Feature-1", "col-1": "id"},
    //                 {"Feature-1": "Hamburg", "col-1": "Ort"}
    //             ]
    //         });
    //     });
    // });
    // describe("removeFeatureFromPreparedList", () => {
    //     it("removes feature from prepared list if only one layer is on comparison list", () => {
    //         const state = {
    //             tableBody: [],
    //             rowsToShow: 12,
    //             layerFeatures: {"1711": [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}}]},
    //             hasMultipleLayers: false,
    //             payload: {featureId: "Feature-1", features: [{"Feature-1": "Krankenhaus-1", "col-1": "name"},
    //                 {"Feature-1": "Feature-1", "col-1": "id"},
    //                 {"Feature-1": "Hamburg", "col-1": "Ort"}]}
    //         };

    //         actions.removeFeatureFromPreparedList({state, commit}, state.payload);
    //         expect(state.preparedList).to.eql({});
    //         expect(state.layerFeatures).to.eql({});
    //     });
    //     it("removes  specific feature from prepared list if multiple layers are on comparison list", () => {
    //         const state = {
    //             tableBody: [],
    //             rowsToShow: 12,
    //             layerFeatures: {1711: [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}}],
    //                 8123: [{layerId: "8123", featureId: "Feature-2", properties: {name: "Schule-1", id: "Feature-2", Ort: "Hamburg"}}]},
    //             hasMultipleLayers: true,
    //             payload: {featureId: "Feature-1", features: [{"Feature-1": "Krankenhaus-1", "col-1": "name"},
    //                 {"Feature-1": "Feature-1", "col-1": "id"},
    //                 {"Feature-1": "Hamburg", "col-1": "Ort"}], selectedLayer: "1711"},
    //             preparedList: {
    //                 "1711": [
    //                     {"Feature-1": "Krankenhaus-1", "col-1": "name"},
    //                     {"Feature-1": "Feature-1", "col-1": "id"},
    //                     {"Feature-1": "Hamburg", "col-1": "Ort"}
    //                 ],
    //                 "8123": [
    //                     {"Feature-2": "Schule-1", "col-1": "name"},
    //                     {"Feature-2": "Feature-2", "col-1": "id"},
    //                     {"Feature-2": "Hamburg", "col-1": "Ort"}
    //                 ]
    //             }
    //         };

    //         actions.removeFeatureFromPreparedList({state, commit}, state.payload);
    //         expect(state.preparedList).to.eql({"8123": [
    //             {"Feature-2": "Schule-1", "col-1": "name"},
    //             {"Feature-2": "Feature-2", "col-1": "id"},
    //             {"Feature-2": "Hamburg", "col-1": "Ort"}
    //         ]});
    //         expect(state.layerFeatures).to.eql({"8123": [
    //             {
    //                 "featureId": "Feature-2",
    //                 "layerId": "8123",
    //                 "properties": {
    //                     "Ort": "Hamburg",
    //                     "id": "Feature-2",
    //                     "name": "Schule-1"
    //                 }
    //             }
    //         ]});
    //     });
    // });
});
