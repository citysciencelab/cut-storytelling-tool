import {expect} from "chai";
import getPosition from "../../../utils/getPosition";

describe("src/modules/wmsTime/utils/getPosition.js", () => {


    it("should calculate and return the horizontal position according to the event type keydown", () => {
        const event = {
                clientX: "",
                type: "keydown",
                key: "ArrowLeft"
            },
            currentPos = 750,
            keyboardMovement = 5;

        expect(getPosition(event, currentPos, keyboardMovement)).to.eql(745);
    });
    it("should calculate and return the horizontal position according to the event type mousemove", () => {
        const event = {
                clientX: 730,
                type: "mousemove",
                key: ""
            },
            currentPos = 750,
            keyboardMovement = 5;

        expect(getPosition(event, currentPos, keyboardMovement)).to.eql(730);
    });
    it("should return 0 if the new position would be further to the left than the window width", () => {
        const event = {
                clientX: -10,
                type: "mousemove",
                key: ""
            },
            currentPos = 0,
            keyboardMovement = 5;

        expect(getPosition(event, currentPos, keyboardMovement)).to.eql(0);
    });
    it("should return the innder width of the window if the new position would be further to the right than the window width", () => {
        const event = {
                clientX: 1200,
                type: "mousemove",
                key: ""
            },
            currentPos = 0,
            keyboardMovement = 5;

        expect(getPosition(event, currentPos, keyboardMovement)).to.eql(window.innerWidth);
    });
});
