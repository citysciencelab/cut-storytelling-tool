import {expect} from "chai";
import getters from "../../../store/gettersCompareFeatures";

const {selectableLayers, isFeatureSelected} = getters;

describe("src/modules/tools/compareFeatures/store/gettersCompareFeatures.js", () => {

    describe("selectableLayers", () => {
        it("returns the first features from the layers on the comparison list", () => {
            const state = {
                layerFeatures: {1711: [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}},
                    {layerId: "1711", featureId: "Feature-2", properties: {name: "Krankenhaus-2", id: "Feature-2", Ort: "Hamburg"}}],
                8123: [{layerId: "8123", featureId: "Feature-3", properties: {name: "Schule-1", id: "Feature-3", Ort: "Hamburg"}}]}
            };

            expect(selectableLayers(state)).to.eql([{
                "featureId": "Feature-1",
                "layerId": "1711",
                "properties": {
                    "Ort": "Hamburg",
                    "id": "Feature-1",
                    "name": "Krankenhaus-1"
                }
            },
            {
                "featureId": "Feature-3",
                "layerId": "8123",
                "properties": {
                    "Ort": "Hamburg",
                    "id": "Feature-3",
                    "name": "Schule-1"
                }
            }]);
        });
    });
    describe("isFeatureSelected", () => {
        it("returns true if a feature is already selected and on comparison list", () => {
            const state = {
                gfiFeature: {layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}},
                layerFeatures: {1711: [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}},
                    {layerId: "1711", featureId: "Feature-2", properties: {name: "Krankenhaus-2", id: "Feature-2", Ort: "Hamburg"}}],
                8123: [{layerId: "8123", featureId: "Feature-3", properties: {name: "Schule-1", id: "Feature-3", Ort: "Hamburg"}}]}
            };

            expect(isFeatureSelected(state)(state.gfiFeature)).to.equal(true);
        });
        it("returns false if a feature is not selected", () => {
            const state = {
                gfiFeature: {layerId: "1711", featureId: "APP_KRANKENHAEUSER_NEUES_FEATURE", properties: {name: "NEUES KRANKENHAUS", id: "APP_KRANKENHAEUSER_NEUES_FEATURE", Ort: "Hamburg"}},
                layerFeatures: {1711: [{layerId: "1711", featureId: "Feature-1", properties: {name: "Krankenhaus-1", id: "Feature-1", Ort: "Hamburg"}},
                    {layerId: "1711", featureId: "Feature-2", properties: {name: "Krankenhaus-2", id: "Feature-2", Ort: "Hamburg"}}],
                8123: [{layerId: "8123", featureId: "Feature-3", properties: {name: "Schule-1", id: "Feature-3", Ort: "Hamburg"}}]}
            };

            expect(isFeatureSelected(state)(state.gfiFeature)).to.equal(false);
        });
    });
});
