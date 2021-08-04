import sinon from "sinon";
import {expect} from "chai";
import actions from "../../../store/actionsCompareFeatures";

const {
    isFeatureOnCompareList,
    removeFeature,
    prepareFeatureListToShow
} = actions;

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

            isFeatureOnCompareList({state, dispatch, commit, getters}, state.gfiFeature);
            expect(commit.firstCall.args[0]).to.equal("setShowAlert");
            expect(commit.secondCall.args[0]).to.equal("setListFull");
            expect(commit.secondCall.args[1]).to.equal(false);
            expect(commit.thirdCall.args[0]).to.equal("addFeatureToLayer");
            expect(dispatch.firstCall.args[0]).to.equal("prepareFeatureListToShow");
        });
    });

    describe("removeFeature", () => {
        it("removes the feature from the layer", () => {
            const state = {
                gfiFeature: {layerId: "1711", featureId: "1234"},
                preparedList: {"1711": [{featureId: "feature1", layerId: "1711"}]}
            };

            removeFeature({state, commit}, state.gfiFeature);
            expect(commit.firstCall.args[0]).to.equal("removeFeatureFromPreparedList");
            expect(commit.firstCall.args[1]).to.eql({
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
                gfiAttributes: {layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}},
                layerId: 1711,
                layerFeatures: {"1711": [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}}]},
                featureList: {"1711": [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}}]},
                preparedList: {}
            };

            prepareFeatureListToShow({state, commit}, state.gfiAttributes);
            expect(commit.firstCall.args[0]).to.equal("setHasFeatures");
            expect(commit.secondCall.args[0]).to.equal("setList");
        });
    });
});
