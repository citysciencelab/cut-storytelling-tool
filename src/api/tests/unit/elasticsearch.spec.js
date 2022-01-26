import {initializeSearch, sendRequest} from "../../elasticsearch";
import {expect} from "chai";

describe.only("api/elasticsearch", () => {
    describe("init seach", () => {
        it("should initialize the search", async () => {
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
                    url: "https://geodienste.hamburg.de/layers/_search/template?source_content_type=application/json&source="
                },
                resultRe = await initializeSearch(requestConfig);

            expect(resultRe.hits[0]._source.typ === "WMS").to.be.true;
            expect(resultRe.hits.length).to.be.equal(10);
        });
    });
    describe("send Request", () => {
        it("should return promise after sending a request", async () => {
            const requestConfig = {
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
                url = "https://geodienste.hamburg.de/layers/_search/template?source_content_type=application/json&source=",
                resultRe = await sendRequest(url, requestConfig, result);

            expect(resultRe.hits[0]._source.typ === "WMS").to.be.true;
            expect(resultRe.hits.length).to.be.equal(10);
        });
    });
});
