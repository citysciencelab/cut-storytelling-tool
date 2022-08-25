import sinon from "sinon";
import {expect} from "chai";
import testAction from "../../../../../../../test/unittests/VueTestUtils";
import actions from "../../../store/actionsLayerSlider";

const {
    addIndexToLayerIds,
    addLayerModel,
    checkIfAllLayersAvailable,
    sendModification,
    setActiveIndex,
    toggleLayerVisibility
} = actions;


describe("src/modules/tools/layerSlider/store/actionsLayerSlider.js", () => {
    let request,
        trigger;

    beforeEach(() => {
        request = sinon.spy(() => ({}));
        trigger = sinon.spy();

        sinon.stub(Radio, "request").callsFake(request);
        sinon.stub(Radio, "trigger").callsFake(trigger);
    });

    afterEach(sinon.restore);

    describe("addIndexToLayerIds", () => {
        it("addIndexToLayerIds", done => {
            const layerIds = [
                    {
                        layerId: "123",
                        title: "Pommes"
                    },
                    {
                        layerId: "456",
                        title: "Ketchup"
                    },
                    {
                        layerId: "789",
                        title: "Myonnaise"
                    }
                ],
                layerIdsWithIndex = [
                    {
                        layerId: "123",
                        title: "Pommes",
                        index: 0
                    },
                    {
                        layerId: "456",
                        title: "Ketchup",
                        index: 1
                    },
                    {
                        layerId: "789",
                        title: "Myonnaise",
                        index: 2
                    }
                ];

            testAction(addIndexToLayerIds, layerIds, {}, {}, [
                {type: "setLayerIds", payload: layerIdsWithIndex}
            ], {}, done);
        });
    });
    describe("addLayerModel", () => {
        it("addLayerModel", () => {
            const layerId = {
                layerId: "123",
                title: "Pommes",
                index: 0
            };

            addLayerModel({}, layerId);
            expect(trigger.calledOnce).to.be.true;
            expect(trigger.firstCall.args).to.eql(["ModelList", "addModelsByAttributes", {id: layerId}]);
        });
    });
    describe("checkIfAllLayersAvailable", () => {
        it("checkIfAllLayersAvailable", done => {
            const layerIds = [
                {
                    layerId: "123",
                    title: "Pommes",
                    index: 0
                }
            ];

            testAction(checkIfAllLayersAvailable, layerIds, {}, {}, [
                {type: "setLayerIds", payload: layerIds}
            ], {}, done);
        });
    });
    describe("sendModification", () => {
        it("sendModification", () => {
            const layerId = {
                    layerId: "123",
                    title: "Pommes",
                    index: 0
                },
                status = true,
                transparency = 0.5;

            sendModification({}, {layerId, status, transparency});

            expect(trigger.calledOnce).to.be.true;
            expect(trigger.firstCall.args).to.eql(["ModelList", "setModelAttributesById", layerId, {
                isSelected: status,
                isVisibleInMap: status,
                transparency: transparency
            }]);
        });
    });
    describe("setActiveIndex", () => {
        it("setActiveIndex", done => {
            const activeLayer = {
                    layerId: "123",
                    title: "Pommes",
                    index: 0
                },
                layerIds = [
                    {
                        layerId: "123",
                        title: "Pommes",
                        index: 0
                    },
                    {
                        layerId: "456",
                        title: "Ketchup",
                        index: 1
                    },
                    {
                        layerId: "789",
                        title: "Myonnaise",
                        index: 2
                    }
                ],
                state = {
                    activeLayer,
                    layerIds
                };

            testAction(setActiveIndex, 0, state, {}, [
                {type: "setActiveLayer", payload: layerIds[0]},
                {type: "toggleLayerVisibility", payload: activeLayer.layerId, dispatch: true}
            ], {}, done);
        });
    });
    describe("toggleLayerVisibility", () => {
        it("toggleLayerVisibility", done => {
            const activeLayerId = "123",
                state = {
                    layerIds: [
                        {
                            layerId: "123",
                            title: "Pommes",
                            index: 0
                        },
                        {
                            layerId: "456",
                            title: "Ketchup",
                            index: 1
                        },
                        {
                            layerId: "789",
                            title: "Myonnaise",
                            index: 2
                        }
                    ]
                };

            testAction(toggleLayerVisibility, activeLayerId, state, {}, [
                {type: "sendModification", payload: {layerId: "123", status: true}, dispatch: true},
                {type: "sendModification", payload: {layerId: "456", status: false}, dispatch: true},
                {type: "sendModification", payload: {layerId: "789", status: false}, dispatch: true}
            ], {}, done);
        });
    });
});
