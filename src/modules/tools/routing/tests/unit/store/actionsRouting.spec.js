import sinon from "sinon";
import actionsRouting from "../../../store/actionsRouting";
import {expect} from "chai";

describe("src/modules/tools/routing/store/actionsRouting.js", () => {
    let state, rootState;

    beforeEach(() => {
        state = {
            geosearch: {
                type: null,
                serviceId: null
            },
            geosearchReverse: {
                type: null,
                serviceId: null
            },
            directionsSettings: {
                type: null,
                serviceId: null
            },
            isochronesSettings: {
                type: null,
                serviceId: null
            }
        };
        rootState = {
            configJson: {
                Portalconfig: {
                    menu: {
                        tools: {
                            children: {
                                routing: state
                            }
                        }
                    }
                }
            }
        };
    });

    afterEach(sinon.restore);

    it("should throw error because of missing required config parameter", () => {
        try {
            actionsRouting.checkNonOptionalConfigFields({rootState});
        }
        catch (e) {
            expect(e.message).equal("Routing tool is not configured correctly. The following required fields are missing: geosearch.type, geosearch.serviceId, geosearchReverse.type, geosearchReverse.serviceId, directionsSettings.type, directionsSettings.serviceId, isochronesSettings.type, isochronesSettings.serviceId");
        }
    });

    it("should not throw error because of missing required config parameter", () => {
        state.geosearch.type = "type";
        state.geosearch.serviceId = "serviceId";
        state.geosearchReverse.type = "type";
        state.geosearchReverse.serviceId = "serviceId";
        state.directionsSettings.type = "type";
        state.directionsSettings.serviceId = "serviceId";
        state.isochronesSettings.type = "type";
        state.isochronesSettings.serviceId = "serviceId";
        actionsRouting.checkNonOptionalConfigFields({rootState});
    });
});
