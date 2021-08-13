import getPropertiesWithFullKeys from "../../../utils/getPropertiesWithFullKeys";
import {expect} from "chai";

describe("src/modules/tools/gfi/utils/getPropertiesWithFullKeys.js", () => {
    describe("getPropertiesWithFullKeys", () => {
        it("should return false if anything but an object or array is given", () => {
            expect(getPropertiesWithFullKeys(undefined)).to.be.false;
            expect(getPropertiesWithFullKeys(null)).to.be.false;
            expect(getPropertiesWithFullKeys("string")).to.be.false;
            expect(getPropertiesWithFullKeys(1234)).to.be.false;
            expect(getPropertiesWithFullKeys(true)).to.be.false;
            expect(getPropertiesWithFullKeys(false)).to.be.false;
        });
        it("should return false if anything but a string is given as path prefix", () => {
            expect(getPropertiesWithFullKeys({}, null)).to.be.false;
            expect(getPropertiesWithFullKeys({}, 1234)).to.be.false;
            expect(getPropertiesWithFullKeys({}, true)).to.be.false;
            expect(getPropertiesWithFullKeys({}, false)).to.be.false;
            expect(getPropertiesWithFullKeys({}, {})).to.be.false;
            expect(getPropertiesWithFullKeys({}, [])).to.be.false;
        });
        it("should return false if anything but a string is given as delimitor", () => {
            expect(getPropertiesWithFullKeys({}, "", null)).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", 1234)).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", true)).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", false)).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", [])).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", {})).to.be.false;
        });
        it("should return false if anything but a number or a number less than zero is given as depthBarrier", () => {
            expect(getPropertiesWithFullKeys({}, "", "", null)).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", "", true)).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", "", false)).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", "", [])).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", "", {})).to.be.false;
            expect(getPropertiesWithFullKeys({}, "", "", -1)).to.be.false;
        });
        it("should return an object with key value pairs if a simple object is given", () => {
            const properties = {
                    a: "value1",
                    b: "value2"
                },
                expected = {
                    a: "value1",
                    b: "value2"
                };

            expect(getPropertiesWithFullKeys(properties)).to.deep.equal(expected);
        });
        it("should return an object with depth keys of an object including another object", () => {
            const properties = {
                    a: {
                        a: "value1"
                    },
                    b: "value2"
                },
                expected = {
                    "@a.a": "value1",
                    b: "value2"
                };

            expect(getPropertiesWithFullKeys(properties)).to.deep.equal(expected);
        });
        it("should use depth barrier of 20 by default if a recursive object is given", () => {
            let result = {};
            const properties = {a: result},
                expected = {"@a.a.a.a.a.a.a.a.a.a.a.a.a.a.a.a.a.a.a.a": 3};

            for (let i = 0; i < 18; i++) {
                result.a = {};
                result = result.a;
            }
            result.a = 3;
            expect(getPropertiesWithFullKeys(properties)).to.deep.equal(expected);
        });
        it("should use the given depth barrier", () => {
            const properties = {
                    a: {
                        a: {
                            a: 0
                        }
                    },
                    b: 1
                },
                expected1 = {
                    b: 1
                },
                expected2 = {
                    "@a.a.a": 0,
                    b: 1
                };

            expect(getPropertiesWithFullKeys(properties, "@", ".", 1)).to.deep.equal(expected1);
            expect(getPropertiesWithFullKeys(properties, "@", ".", 3)).to.deep.equal(expected2);
        });
    });
});
