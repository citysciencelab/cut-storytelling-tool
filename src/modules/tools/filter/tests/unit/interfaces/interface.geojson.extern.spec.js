import {expect} from "chai";
import InterfaceGeojsonExtern from "../../../interfaces/interface.geojson.extern.js";
import hash from "object-hash";

describe("src/modules/tools/filter/interfaces/utils/interface.geojson.extern.js", () => {
    let interfaceGeojsonExtern = null,
        lastSuccess = null,
        lastError = null,
        lastAxiosCall = null,
        geojsonPayload = {payload: "payload"};
    const dummyCalls = {
            onsuccess: result => {
                lastSuccess = result;
            },
            onerror: error => {
                lastError = error;
            }
        },
        axiosMock = {
            get: (url) => {
                lastAxiosCall = url;
                return new Promise(resolve => {
                    resolve({
                        data: geojsonPayload
                    });
                });
            }
        };

    beforeEach(() => {
        lastError = null;
        lastSuccess = null;
        lastAxiosCall = null;
        geojsonPayload = {payload: "payload"};
        interfaceGeojsonExtern = new InterfaceGeojsonExtern();
    });

    describe("handleGeojsonRequest", () => {
        it("should call an error if service is anything but an object", async () => {
            await interfaceGeojsonExtern.handleGeojsonRequest(undefined, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.be.null;
            expect(lastError).to.be.instanceOf(Error);

            lastError = null;
            lastSuccess = null;
            await interfaceGeojsonExtern.handleGeojsonRequest(null, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.be.null;
            expect(lastError).to.be.instanceOf(Error);

            lastError = null;
            lastSuccess = null;
            await interfaceGeojsonExtern.handleGeojsonRequest(1234, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.be.null;
            expect(lastError).to.be.instanceOf(Error);

            lastError = null;
            lastSuccess = null;
            await interfaceGeojsonExtern.handleGeojsonRequest("string", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.be.null;
            expect(lastError).to.be.instanceOf(Error);

            lastError = null;
            lastSuccess = null;
            await interfaceGeojsonExtern.handleGeojsonRequest(true, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.be.null;
            expect(lastError).to.be.instanceOf(Error);

            lastError = null;
            lastSuccess = null;
            await interfaceGeojsonExtern.handleGeojsonRequest(false, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.be.null;
            expect(lastError).to.be.instanceOf(Error);

            lastError = null;
            lastSuccess = null;
            await interfaceGeojsonExtern.handleGeojsonRequest([], dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.be.null;
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call onsuccess right away if for this service there is data already known to the interface", async () => {
            const service = {url: "url"},
                hashKey = hash.sha1(JSON.stringify(service));

            interfaceGeojsonExtern.cache[hashKey] = "payload";
            await interfaceGeojsonExtern.handleGeojsonRequest(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.equal("payload");
            expect(lastAxiosCall).to.be.null;
            expect(lastError).to.be.null;
        });
        it("should call axios and start the waitinglist if there is no data known for the given service", async () => {
            const service = {url: "url"},
                hashKey = hash.sha1(JSON.stringify(service));

            expect(interfaceGeojsonExtern.waitinglist[hashKey]).to.be.undefined;
            await interfaceGeojsonExtern.handleGeojsonRequest(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);

            expect(interfaceGeojsonExtern.waitinglist[hashKey]).to.be.an("array").and.to.be.empty;
            expect(interfaceGeojsonExtern.cache[hashKey]).to.deep.equal({payload: "payload"});
            expect(lastSuccess).to.deep.equal({payload: "payload"});
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.null;
        });
        it("should add onsuccess to the waitinglist if waitinglist is an array already", async () => {
            const service = {url: "url"},
                hashKey = hash.sha1(JSON.stringify(service));

            interfaceGeojsonExtern.waitinglist[hashKey] = [];
            await interfaceGeojsonExtern.handleGeojsonRequest(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(interfaceGeojsonExtern.waitinglist[hashKey]).to.be.an("array").and.not.to.be.empty;
            expect(interfaceGeojsonExtern.waitinglist[hashKey][0]).to.be.a("function");
        });
    });
    describe("getAttrTypes", () => {
        it("should call an error if the received geojson is not an object", async () => {
            const service = {url: "url"};

            geojsonPayload = undefined;
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = null;
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = 1234;
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = "string";
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = true;
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = false;
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = [];
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call an error if the received geojson is not of type FeatureCollection", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "not a FeatureCollection",
                features: [{
                    properties: {}
                }]
            };
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call an error if the received geojson has no features", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "FeatureCollection",
                features: []
            };
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call an error if the received geojson has features without properties", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "FeatureCollection",
                features: [{
                    properties: undefined
                }]
            };
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call onsuccess with key value pairs of attrName and type of attrName", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "FeatureCollection",
                features: [{
                    properties: {
                        attrA: "string",
                        attrB: 1234,
                        attrC: true
                    }
                }]
            };
            await interfaceGeojsonExtern.getAttrTypes(service, dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.deep.equal({attrA: "string", attrB: "number", attrC: "boolean"});
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.null;
        });
    });
    describe("getMinMax", () => {
        it("should call an error if the received geojson is not an object", async () => {
            const service = {url: "url"};

            geojsonPayload = undefined;
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = null;
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = 1234;
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = "string";
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = true;
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = false;
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = [];
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call an error if the received geojson is not of type FeatureCollection", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "not a FeatureCollection",
                features: [{
                    properties: {}
                }]
            };
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call an error if the received geojson has no features", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "FeatureCollection",
                features: undefined
            };
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call onsuccess with an object min max", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "FeatureCollection",
                features: [{
                    properties: {
                        attrName: 1
                    }
                }, {
                    properties: {
                        attrName: 10
                    }
                }]
            };
            await interfaceGeojsonExtern.getMinMax(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, false, false, axiosMock);
            expect(lastError).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastSuccess).to.deep.equal({min: 1, max: 10});
        });
    });
    describe("getUniqueValues", () => {
        it("should call an error if the received geojson is not an object", async () => {
            const service = {url: "url"};

            geojsonPayload = undefined;
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = null;
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = 1234;
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = "string";
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = true;
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = false;
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);

            geojsonPayload = [];
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call an error if the received geojson is not of type FeatureCollection", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "not a FeatureCollection",
                features: [{
                    properties: {}
                }]
            };
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call an error if the received geojson has no features", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "FeatureCollection",
                features: undefined
            };
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.be.null;
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.instanceOf(Error);
        });
        it("should call onsuccess with an object of unique value", async () => {
            const service = {url: "url"};

            geojsonPayload = {
                type: "FeatureCollection",
                features: [{
                    properties: {
                        attrName: 1
                    }
                }, {
                    properties: {
                        attrName: 10
                    }
                }]
            };
            await interfaceGeojsonExtern.getUniqueValues(service, "attrName", dummyCalls.onsuccess, dummyCalls.onerror, axiosMock);
            expect(lastSuccess).to.deep.equal(["1", "10"]);
            expect(lastAxiosCall).to.equal("url");
            expect(lastError).to.be.null;
        });
    });
});
