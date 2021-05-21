import testAction from "../../../../../../test/unittests/VueTestUtils";
import actions from "../../../store/actionsLayerInformation";

const {activate, layerInfo, additionalSingleLayerInfo, setMetadataURL} = actions;

describe("src/modules/layerInformation/store/actionsLayerInformation.js", () => {
    describe("setActive", () => {

        it("should set active to true", done => {
            const payload = true,
                state = {
                    active: false
                };

            testAction(activate, payload, state, {}, [
                {type: "setActive", payload: payload}
            ], {}, done);
        });

        it("should set active to false", done => {
            const payload = false,
                state = {
                    active: true
                };

            testAction(activate, payload, state, {}, [
                {type: "setActive", payload: payload}
            ], {}, done);
        });
    });

    describe("initialize the store", () => {

        it("should initialize the LayerInformation", done => {
            const state = {
                    info: {}
                },
                info = {
                    "id": "123",
                    "metaID": "layerMetaId",
                    "layername": "name",
                    "url": "google.de",
                    "urlIsVisible": true
                };

            testAction(layerInfo, info, state, {}, [
                {type: "setLayerInfo", payload: info}
            ], {}, done);
        });

        it("should initialize the other abstract layer infos", done => {
            const state = {
                layerInfo: {
                    cswUrl: "https://metaver.de/csw",
                    metaID: "73A344E9-CDB5-4A17-89C1-05E202989755"
                }
            };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done
            testAction(additionalSingleLayerInfo, null, state, {}, [
                {type: "getAbstractInfo", payload: {metaId: state.layerInfo.metaID, cswUrl: state.layerInfo.cswUrl}, dispatch: true}
            ], {}, done);

        });

        it("should set the Meta Data URLs", done => {
            const metaId = "73A344E9-CDB5-4A17-89C1-05E202989755",
                state = {
                    layerInfo: {
                        "id": "123",
                        "metaID": "layerMetaId",
                        "layername": "name",
                        "url": "google.de",
                        "urlIsVisible": true
                    },
                    metaDataCatalogueId: "2"
                };
                // metaURLs = ["https://metaver.de/trefferanzeige?cmd=doShowDocument&docuuid=73A344E9-CDB5-4A17-89C1-05E202989755"];

            // Once the RestReader (Radiorequest) is a vue component change the payload to metaURLs
            testAction(setMetadataURL, metaId, state, {}, [
                {type: "setMetaURLs", payload: [""]}
            ], {}, done);

        });

    });
});
