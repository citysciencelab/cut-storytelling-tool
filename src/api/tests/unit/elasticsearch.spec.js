import {initializeSearch, sendRequest} from "../../elasticsearch";
import {expect} from "chai";
import axios from "axios";
import sinon from "sinon";
import * as elasticsearch from "../../elasticsearch";

describe("api/elasticsearch", () => {
    afterEach(() => {
        sinon.restore();
    });
    describe("init seach", () => {
        it("should initialize the search", () => {
            const requestConfig = {
                    payload: {
                        id: "query",
                        params: {
                            query_string: "fer"
                        }
                    },
                    responseEntryPath: "hits.hits",
                    serviceId: "elastic",
                    type: "GET",
                    url: "https://geodienste.hamburg.de/"
                },
                sendRequestMock = sinon.spy(elasticsearch, "sendRequest");

            initializeSearch(requestConfig).returns(["hit", "hit"]);

            expect(sendRequestMock.calledOnce).to.be.true;
        });
    });
    describe("send Request", () => {
        it("should send axios", () => {
            const axiosStub = sinon.stub(axios, "get").returns(Promise.resolve({status: 200, data: {}})),
                requestConfig = {
                    payload: {
                        id: "query",
                        params: {
                            query_string: "fer"
                        }
                    },
                    responseEntryPath: "hits.hits",
                    serviceId: "elastic",
                    type: "GET"
                },
                result = {
                    status: "success",
                    message: "",
                    hits: []
                },
                url = "https://geodienste.hamburg.de";

            sendRequest(url, requestConfig, result);

            expect(axiosStub.calledOnce).to.be.true;

        });
        it("should reject axios", () => {
            const axiosStub = sinon.stub(axios, "get").returns((_g, reject) => {
                    reject({
                        ok: false,
                        status: 404,
                        text: () => {
                            return null;
                        }
                    });
                }),
                requestConfig = {
                    payload: {
                        id: "query",
                        params: {
                            query_string: "fer"
                        }
                    },
                    responseEntryPath: "hits.hits",
                    serviceId: "elastic",
                    type: "GET"
                },
                result = {
                    status: "success",
                    message: "",
                    hits: []
                },
                url = "https://geodienste.hamburg.de";

            sendRequest(url, requestConfig, result);

            expect(axiosStub.calledOnce).to.be.true;

        });
    });
});
