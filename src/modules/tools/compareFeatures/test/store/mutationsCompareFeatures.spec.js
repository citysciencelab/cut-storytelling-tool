import {expect} from "chai";
import mutations from "../../store/mutationsCompareFeatures";

const {resetLayerSelection, selectLayerWithFeatures, addFeatureToLayer, removeFeatureFromLayer} = mutations;

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
    describe("removeFeatureFromLayer", () => {
        it("removes feature from the related layer", () => {
            const state = {
                layerFeatures: {"1711": [{featureId: "feature1", layerId: "1711"}]},
                feature: {featureId: "feature1", layerId: "1711"}
            };

            removeFeatureFromLayer(state, state.feature);
            expect(state.layerFeatures).to.eql({});
        });
    });
});
