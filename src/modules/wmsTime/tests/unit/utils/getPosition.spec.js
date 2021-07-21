import {expect} from "chai";
import getPosition from "../../../utils/getPosition";

describe("src/modules/wmsTime/utils/getPosition.js", () => {
    const keyboardMovement = 5;
    let currentPos,
        event;

    beforeEach(() => {
        currentPos = 750;
        event = {clientX: "", type: "mousemove", key: ""};
    });

    it("should calculate and return the horizontal position according to the event type keydown", () => {
        event.type = "keydown";
        event.key = "ArrowLeft";

        expect(getPosition(event, currentPos, keyboardMovement)).to.eql(745);
    });
    it("should calculate and return the horizontal position according to the event type mousemove", () => {
        event.clientX = 730;

        expect(getPosition(event, currentPos, keyboardMovement)).to.eql(730);
    });
    it("should return 0 if the new position would be further to the left than the window width", () => {
        event.clientX = -10;

        currentPos = 0;

        expect(getPosition(event, currentPos, keyboardMovement)).to.eql(0);
    });
    it("should return the innder width of the window if the new position would be further to the right than the window width", () => {
        event.clientX = 1200;

        currentPos = 0;

        expect(getPosition(event, currentPos, keyboardMovement)).to.eql(window.innerWidth);
    });
});
