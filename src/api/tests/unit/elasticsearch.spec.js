import {initializeSearch, sendRequest} from "../../elasticsearch";
import {expect} from "chai";
import axios from "axios";
import sinon from "sinon";
import * as elasticsearch from "../../elasticsearch";

describe("api/elasticsearch", () => {
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

            expect(sendRequestMock.called).to.be.true;
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

            expect(
                axiosStub.called
            ).to.be.true;

            axiosStub.restore();
        });
    });
});
