import {expect} from "chai";
import InterfaceWFS from "../../../interfaces/interface.wfs.js";

describe("src/modules/tools/filterGeneral/interfaces/utils/interface.wfs.js", () => {
    let interfaceWFS = null;

    beforeEach(() => {
        interfaceWFS = new InterfaceWFS();
    });

    describe("constructor", () => {
        it("should set a variable axiosCancelTokenSources as object at the instance", () => {
            expect(interfaceWFS.axiosCancelTokenSources).to.be.an("object").and.to.be.empty;
        });
    });
    describe("callEmptySuccess", () => {
        it("should call onsuccess if onsuccess is a function", () => {
            let called_onsuccess = false;

            interfaceWFS.callEmptySuccess(() => {
                called_onsuccess = true;
            });
            expect(called_onsuccess).to.be.true;
        });
        it("should hand over a filter answer with empty items and the given percentage for paging", () => {
            let called_filterAnswer = false;

            interfaceWFS.callEmptySuccess(filterAnswer => {
                called_filterAnswer = filterAnswer;
            }, {
                service: "service",
                filterId: "filterId",
                snippetId: "snippetId"
            },
            "percentage");

            expect(called_filterAnswer).to.deep.equal({
                service: "service",
                filterId: "filterId",
                snippetId: "snippetId",
                paging: {
                    page: "percentage",
                    total: 100
                },
                items: []
            });
        });
    });
    describe("getLogicalHandlerByOperator", () => {
        it("should return a function returning an empty string if anything unknown is given as operator", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator(undefined),
                result = typeof handler === "function" ? handler() : false;

            expect(handler).to.be.a("function");
            expect(result).to.be.a("string").and.to.be.empty;
        });
        it("should return the betweenFilter if the operator is BETWEEN and this is not a temporal operator", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator("BETWEEN", false);

            expect(handler).to.be.a("function");
            expect(handler.name).to.equal("between");
        });
        it("should return the duringFilter if the operator is BETWEEN and this is a temporal operator", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator("BETWEEN", true);

            expect(handler).to.be.a("function");
            expect(handler.name).to.equal("during");
        });
        it("should return the equalToFilter if the operator is EQ", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator("EQ");

            expect(handler).to.be.a("function");
            expect(handler.name).to.equal("equalTo");
        });
        it("should return the notEqualToFilter if the operator is NE", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator("NE");

            expect(handler).to.be.a("function");
            expect(handler.name).to.equal("notEqualTo");
        });
        it("should return the greaterThanFilter if the operator is GT", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator("GT");

            expect(handler).to.be.a("function");
            expect(handler.name).to.equal("greaterThan");
        });
        it("should return the greaterThanOrEqualToFilter if the operator is GE", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator("GE");

            expect(handler).to.be.a("function");
            expect(handler.name).to.equal("greaterThanOrEqualTo");
        });
        it("should return the lessThanFilter if the operator is LT", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator("LT");

            expect(handler).to.be.a("function");
            expect(handler.name).to.equal("lessThan");
        });
        it("should return the lessThanOrEqualToFilter if the operator is LE", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator("LE");

            expect(handler).to.be.a("function");
            expect(handler.name).to.equal("lessThanOrEqualTo");
        });
        it("should return the likeFilter if the operator is IN", () => {
            const handler = interfaceWFS.getLogicalHandlerByOperator("IN");

            expect(handler).to.be.a("function");
            expect(handler.name).to.equal("like");
        });
    });
    describe("isRangeOperator", () => {
        it("should return false if the given operator id not a range operator", () => {
            expect(interfaceWFS.isRangeOperator("ANYTHING")).to.be.false;
        });
        it("should return true if the given operator is BETWEEN", () => {
            expect(interfaceWFS.isRangeOperator("BETWEEN")).to.be.true;
        });
    });
    describe("isIso8601", () => {
        it("should return false if the given format is anything but iso8601", () => {
            expect(interfaceWFS.isIso8601("ANYTHING")).to.be.false;
        });
        it("should return true if the given format is a iso8601 format", () => {
            expect(interfaceWFS.isIso8601("YYYY-MM-DD")).to.be.true;
        });
    });
    describe("getOrFilter", () => {
        it("should return the result of the logical handler if the given array has a length of 1", () => {
            let called_attrName = false,
                called_entry = false;

            expect(interfaceWFS.getOrFilter("attrName", ["firstEntry"], (attrName, entry) => {
                called_attrName = attrName;
                called_entry = entry;
                return true;
            })).to.be.true;
            expect(called_attrName).to.equal("attrName");
            expect(called_entry).to.equal("firstEntry");
        });
        it("should return the orFilter instance with the given conditions", () => {
            const result = interfaceWFS.getOrFilter("attrName", ["firstEntry", "secondEntry"], (attrName, value) => {
                return value;
            });

            expect(result).to.be.an("object");
            expect(result.conditions).to.deep.equal(["firstEntry", "secondEntry"]);
        });
    });
    describe("getRuleFilter", () => {
        it("should return the result of the logical handler if value is not an array", () => {
            expect(interfaceWFS.getRuleFilter("attrName", "operator", "value", (attrName, value) => {
                return value;
            })).to.equal("value");
        });
        it("should return an or condition if value is an array and operator is not a range operator", () => {
            const result = interfaceWFS.getRuleFilter("attrName", "operator", ["firstValue", "secondValue"], (attrName, value) => {
                return value;
            });

            expect(result).to.be.an("object");
            expect(result.conditions).to.deep.equal(["firstValue", "secondValue"]);
        });
        it("should return the result of the logical handler, called as range operator, if the operator is a range operator", () => {
            expect(interfaceWFS.getRuleFilter("attrName", "BETWEEN", ["firstValue", "secondValue"], (attrName, valueA, valueB) => {
                return [valueA, valueB];
            })).to.deep.equal(["firstValue", "secondValue"]);
        });
    });
    describe("stop", () => {
        it("should call onerror if the given filterId is not currently a cancel token source", () => {
            let called_onerror = false;

            interfaceWFS.stop("filterId", "onsuccess", error => {
                called_onerror = error;
            });
            expect(called_onerror).to.be.an.instanceof(Error);
        });
        it("should call cancel on the cancel token source and onsuccess", () => {
            let called_onerror = false,
                called_cancel = false,
                called_onsuccess = false;

            interfaceWFS.axiosCancelTokenSources.filterId = {
                cancel: () => {
                    called_cancel = true;
                }
            };
            interfaceWFS.stop("filterId", () => {
                called_onsuccess = true;
            }, error => {
                called_onerror = error;
            });
            expect(called_onerror).to.be.false;
            expect(called_cancel).to.be.true;
            expect(called_onsuccess).to.be.true;
        });
    });

    describe("getAttrTypes", () => {
        it("should call an error if the given service is not an object", () => {
            let errorCount = 0;

            interfaceWFS.getAttrTypes(undefined, "onsuccess", () => errorCount++);
            interfaceWFS.getAttrTypes(null, "onsuccess", () => errorCount++);
            interfaceWFS.getAttrTypes("string", "onsuccess", () => errorCount++);
            interfaceWFS.getAttrTypes(1234, "onsuccess", () => errorCount++);
            interfaceWFS.getAttrTypes(true, "onsuccess", () => errorCount++);
            interfaceWFS.getAttrTypes(false, "onsuccess", () => errorCount++);
            interfaceWFS.getAttrTypes([], "onsuccess", () => errorCount++);
            expect(errorCount).to.equal(7);
        });
    });
});
