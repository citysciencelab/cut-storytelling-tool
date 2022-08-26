import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actions/actionsMapAttributesMapper.js";
import testAction from "../../../../../../test/unittests/VueTestUtils";

describe("src/core/maps/store/actions/actionsMapAttributesMapper.js", () => {
    describe("updateClick: Listener for click on the map", () => {
        it("commits setClickCoord in MODE_2D", () => {
            const getters = {
                    mode: "2D"
                },
                rootGetters = {
                    "controls/orientation/poiModeCurrentPositionEnabled": true
                },
                commit = sinon.spy(),
                obj = {
                    coordinate: [4, 56]
                };

            actions.updateClick({commit, getters, rootGetters}, obj);
            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args).to.deep.equal([
                "setClickCoordinate", [4, 56]
            ]);
        });

        it("commits setClickCoord in MODE 3D", () => {
            const getters = {
                    mode: "3D"
                },
                rootGetters = {
                    "controls/orientation/poiModeCurrentPositionEnabled": true
                },
                commit = sinon.spy(),
                obj = {
                    pickedPosition: [4, 56],
                    position: {
                        x: 12,
                        y: 99
                    }
                };

            actions.updateClick({commit, getters, rootGetters}, obj);
            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args).to.deep.equal([
                "setClickCoordinate", [4, 56]
            ]);
            expect(commit.secondCall.args).to.deep.equal([
                "setClickCartesianCoordinate", [12, 99]
            ]);
        });
    });

    describe("updatePointer: Listener for pointermove on the map", () => {
        it("set mouse coordinate in 3D mode", done => {
            const event = {
                    coordinate: [1, 2]
                },
                getters = {
                    mode: "2D"
                };

            testAction(actions.updatePointer, event, {}, {}, [
                {type: "setMouseCoordinate", payload: event.coordinate}
            ], getters, done);
        });
    });
});
