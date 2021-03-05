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
    describe("prepareTableBody", () => {
        it("prepares the table body for the pdf file", () => {
            const state = {
                tableBody: [],
                rowsToShow: 12,
                features: [{layerId: "1711", featureId: "APP_KRANKENHAEUSER_HH_27", properties: {name: "ATOS Klinik Fleetinsel Hamburg", id: "APP_KRANKENHAEUSER_HH_27", Ort: "Hamburg"}}, {layerId: "1711", featureId: "APP_KRANKENHAEUSER_HH_28", properties: {name: "ATOS Klinik Fleetinsel Hamburg2", id: "APP_KRANKENHAEUSER_HH_27", Ort: "Hamburg"}}]
            };

            actions.prepareTableBody({state}, state.features); // läuft nicht richtig
        });
    });
    describe("removeFeatureFromPreparedList", () => {
        it("removes feature from prepared list if only one layer is on comparison list", () => {
            const state = {
                tableBody: [],
                rowsToShow: 12,
                layerFeatures: {"1711": [{layerId: "1711", featureId: "APP_KRANKENHAEUSER_HH_27", properties: {name: "ATOS Klinik Fleetinsel Hamburg", id: "APP_KRANKENHAEUSER_HH_27", Ort: "Hamburg"}}]},
                hasMultipleLayers: false,
                payload: {featureId: "APP_KRANKENHAEUSER_HH_27", features: [{"APP_KRANKENHAEUSER_HH_27": "ATOS Klinik Fleetinsel Hamburg", "col-1": "name"},
                    {"APP_KRANKENHAEUSER_HH_27": "APP_KRANKENHAEUSER_HH_27", "col-1": "id"},
                    {"APP_KRANKENHAEUSER_HH_27": "Hamburg", "col-1": "Ort"}]}
            };

            actions.removeFeatureFromPreparedList({state, commit}, state.payload);
            expect(state.preparedList).to.eql({});
            expect(state.layerFeatures).to.eql({});
        });
        it("removes  specific feature from prepared list if multiple layers are on comparison list", () => {
            const state = {
                tableBody: [],
                rowsToShow: 12,
                layerFeatures: {1711: [{layerId: "1711", featureId: "APP_KRANKENHAEUSER_HH_27", properties: {name: "ATOS Klinik Fleetinsel Hamburg", id: "APP_KRANKENHAEUSER_HH_27", Ort: "Hamburg"}}],
                    8123: [{layerId: "8123", featureId: "APP_SCHULE_HH_20", properties: {name: "Schule Hamburg", id: "APP_SCHULE_HH_20", Ort: "Hamburg"}}]},
                hasMultipleLayers: true,
                payload: {featureId: "APP_KRANKENHAEUSER_HH_27", features: [{"APP_KRANKENHAEUSER_HH_27": "ATOS Klinik Fleetinsel Hamburg", "col-1": "name"},
                    {"APP_KRANKENHAEUSER_HH_27": "APP_KRANKENHAEUSER_HH_27", "col-1": "id"},
                    {"APP_KRANKENHAEUSER_HH_27": "Hamburg", "col-1": "Ort"}], selectedLayer: "1711"},
                preparedList: {
                    "1711": [
                        {"APP_KRANKENHAEUSER_HH_27": "ATOS Klinik Fleetinsel Hamburg", "col-1": "name"},
                        {"APP_KRANKENHAEUSER_HH_27": "APP_KRANKENHAEUSER_HH_27", "col-1": "id"},
                        {"APP_KRANKENHAEUSER_HH_27": "Hamburg", "col-1": "Ort"}
                    ],
                    "8123": [
                        {"APP_SCHULE_HH_20": "Schule Hamburg", "col-1": "name"},
                        {"APP_SCHULE_HH_20": "APP_SCHULE_HH_20", "col-1": "id"},
                        {"APP_SCHULE_HH_20": "Hamburg", "col-1": "Ort"}
                    ]
                }
            };

            actions.removeFeatureFromPreparedList({state, commit}, state.payload);
            expect(state.preparedList).to.eql({"8123": [
                {"APP_SCHULE_HH_20": "Schule Hamburg", "col-1": "name"},
                {"APP_SCHULE_HH_20": "APP_SCHULE_HH_20", "col-1": "id"},
                {"APP_SCHULE_HH_20": "Hamburg", "col-1": "Ort"}
            ]});
            expect(state.layerFeatures).to.eql({"8123": [
                {
                    "featureId": "APP_SCHULE_HH_20",
                    "layerId": "8123",
                    "properties": {
                        "Ort": "Hamburg",
                        "id": "APP_SCHULE_HH_20",
                        "name": "Schule Hamburg"
                    }
                }
            ]});
        });
    });
});
