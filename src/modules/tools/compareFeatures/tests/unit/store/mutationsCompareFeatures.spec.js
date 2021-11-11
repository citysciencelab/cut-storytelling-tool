import {expect} from "chai";
import mutations from "../../../store/mutationsCompareFeatures";

const {
    resetLayerSelection,
    selectLayerWithFeatures,
    addFeatureToLayer,
    removeFeatureFromPreparedList
} = mutations;

describe("src/modules/tools/compareFeatures/store/mutationsCompareFeatures.js", () => {

    describe("resetLayerSelection", () => {
        it("Returns false if there is just one layer", () => {
            const state = {
                layerFeatures: {a: 1}
            };

            resetLayerSelection(state);
            expect(state.hasMultipleLayers).to.equal(false);
        });
    });
    describe("selectLayerWithFeatures", () => {
        it("selects the chosen layer and sets selectedLayer in state", () => {
            const state = {
                showMoreInfo: false,
                layerWithFeaturesToShow: [],
                layerFeatures: {1711: [{properties: {name: "abcd", id: "1234"}}]}
            };

            selectLayerWithFeatures(state, 1711);
            expect(state.selectedLayer).to.equal(1711);
        });
    });
    describe("addFeatureToLayer", () => {
        it("selects the chosen layer and sets selectedLayer in state", () => {
            const state = {
                layerFeatures: {},
                feature: {featureId: "feature1", layerId: "1711"}
            };

            addFeatureToLayer(state, state.feature);
            expect(state.layerFeatures).to.eql({"1711": [{featureId: "feature1", layerId: "1711"}]});
        });
    });
    describe("removeFeatureFromPreparedList", () => {
        it("removes feature from prepared list if only one layer is on comparison list", () => {
            const state = {
                tableBody: [],
                rowsToShow: 12,
                layerFeatures: {"1711": [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}}]},
                hasMultipleLayers: false,
                payload: {featureId: "Feature-1", features: [{"Feature-1": "Krankenhaus-1", "col-1": "name"},
                    {"Feature-1": "Feature-1", "col-1": "id"},
                    {"Feature-1": "Hamburg", "col-1": "Ort"}]}
            };

            removeFeatureFromPreparedList(state, state.payload);
            expect(state.preparedList).to.eql({});
            expect(state.layerFeatures).to.eql({});
        });
        it("removes  specific feature from prepared list if multiple layers are on comparison list", () => {
            const state = {
                tableBody: [],
                rowsToShow: 12,
                layerFeatures: {1711: [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}}],
                    8123: [{layerId: "8123", featureId: "Feature-2", properties: {name: "Schule-1", id: "Feature-2", Ort: "Hamburg"}}]},
                hasMultipleLayers: true,
                payload: {featureId: "Feature-1", features: [{"Feature-1": "Krankenhaus-1", "col-1": "name"},
                    {"Feature-1": "Feature-1", "col-1": "id"},
                    {"Feature-1": "Hamburg", "col-1": "Ort"}], selectedLayer: "1711"},
                preparedList: {
                    "1711": [
                        {"Feature-1": "Krankenhaus-1", "col-1": "name"},
                        {"Feature-1": "Feature-1", "col-1": "id"},
                        {"Feature-1": "Hamburg", "col-1": "Ort"}
                    ],
                    "8123": [
                        {"Feature-2": "Schule-1", "col-1": "name"},
                        {"Feature-2": "Feature-2", "col-1": "id"},
                        {"Feature-2": "Hamburg", "col-1": "Ort"}
                    ]
                }
            };

            mutations.removeFeatureFromPreparedList(state, state.payload);
            expect(state.preparedList).to.eql({"8123": [
                {"Feature-2": "Schule-1", "col-1": "name"},
                {"Feature-2": "Feature-2", "col-1": "id"},
                {"Feature-2": "Hamburg", "col-1": "Ort"}
            ]});
            expect(state.layerFeatures).to.eql({"8123": [
                {
                    "featureId": "Feature-2",
                    "layerId": "8123",
                    "properties": {
                        "Ort": "Hamburg",
                        "id": "Feature-2",
                        "name": "Schule-1"
                    }
                }
            ]});
        });
    });
});
