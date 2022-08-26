import {expect} from "chai";
import deepCopy from "../../deepCopy";

describe("src/utils/deepCopy.js", () => {
    describe("deepCopy", () => {
        const obj = {a: "foo", b: "bar", c: "baz"},
            date = new Date("December 17, 2020 03:24:00"),
            objectWithDate = {a: date, b: "bar"},
            objectBoolean = {true: {x: "foo", y: "bar"}},
            objectNumber = {1: "foo", 2: "bar", 3: "baz"},
            array = [1, 2, "foo", objectNumber],
            nestedObject = {"nested": obj},
            nestedArrayObject = {"nestedArray": array};

        it("should handle undefined", function () {
            expect(deepCopy(undefined)).to.deep.equal(undefined);
        });
        it("should handle null", function () {
            expect(deepCopy(null)).to.deep.equal(null);
        });
        it("should return a clone of object", function () {
            expect(deepCopy(obj)).to.deep.equal(obj);
        });
        it("should return a clone of objectBoolean", function () {
            expect(deepCopy(objectBoolean)).to.deep.equal(objectBoolean);
        });
        it("should return a clone of objectNumber", function () {
            expect(deepCopy(objectNumber)).to.deep.equal(objectNumber);
        });
        it("should return a clone of nestedObject", function () {
            expect(deepCopy(nestedObject)).to.deep.equal(nestedObject);
        });
        it("should return a clone of array", function () {
            expect(deepCopy(array)).to.deep.equal(array);
        });
        it("should return a clone of nestedArrayObject", function () {
            expect(deepCopy(nestedArrayObject)).to.deep.equal(nestedArrayObject);
        });
        it("should return a clone of objectWithDate", function () {
            expect(deepCopy(objectWithDate)).to.deep.equal(objectWithDate);
        });

    });
});
