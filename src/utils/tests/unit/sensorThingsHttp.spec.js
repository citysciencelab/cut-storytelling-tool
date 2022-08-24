import {expect} from "chai";
import {SensorThingsHttp} from "../../sensorThingsHttp.js";

describe("src/utils/sensorThingsHttp", () => {
    let http = null,
        lastError = false;

    /**
     * a function to change lastError when an error occurs
     * @param {String} error the error
     * @returns {void}
     */
    function onerror (error) {
        lastError = error;
    }

    beforeEach(() => {
        http = new SensorThingsHttp();
        lastError = false;
    });

    describe("getPolygonQueryWithPoints", () => {
        it("should return an url query with the given points in a correct format with an intersect range", () => {
            const points = [
                    {x: "foo", y: "bar"},
                    {x: "baz", y: "qux"}
                ],
                intersect = true;

            expect(http.getPolygonQueryWithPoints(points, intersect)).to.equal("st_intersects(Locations/location,geography'POLYGON ((foo bar,baz qux))')");
            expect(http.getPolygonQueryWithPoints([{}, {}], intersect)).to.equal("st_intersects(Locations/location,geography'POLYGON (())')");
            expect(http.getPolygonQueryWithPoints([], intersect)).to.equal("st_intersects(Locations/location,geography'POLYGON (())')");
        });
        it("should return an url query with the given points in a correct format with an intersect range if root node is Datastreams", () => {
            const points = [
                    {x: "foo", y: "bar"},
                    {x: "baz", y: "qux"}
                ],
                intersect = true;

            http.setRootNode("Datastreams");
            expect(http.getPolygonQueryWithPoints(points, intersect)).to.equal("st_intersects(Thing/Locations/location,geography'POLYGON ((foo bar,baz qux))')");
            expect(http.getPolygonQueryWithPoints([{}, {}], intersect)).to.equal("st_intersects(Thing/Locations/location,geography'POLYGON (())')");
            expect(http.getPolygonQueryWithPoints([], intersect)).to.equal("st_intersects(Thing/Locations/location,geography'POLYGON (())')");
        });
        it("should return an url query with the given points in a correct format with a within range", () => {
            const points = [
                    {x: "foo", y: "bar"},
                    {x: "baz", y: "qux"}
                ],
                intersect = false;

            expect(http.getPolygonQueryWithPoints(points, intersect)).to.equal("st_within(Locations/location,geography'POLYGON ((foo bar,baz qux))')");
            expect(http.getPolygonQueryWithPoints([{}, {}], intersect)).to.equal("st_within(Locations/location,geography'POLYGON (())')");
            expect(http.getPolygonQueryWithPoints([], intersect)).to.equal("st_within(Locations/location,geography'POLYGON (())')");
        });
        it("should return an url query with the given points in a correct format with a within range if root node is Datastreams", () => {
            const points = [
                    {x: "foo", y: "bar"},
                    {x: "baz", y: "qux"}
                ],
                intersect = false;

            http.setRootNode("Datastreams");
            expect(http.getPolygonQueryWithPoints(points, intersect)).to.equal("st_within(Thing/Locations/location,geography'POLYGON ((foo bar,baz qux))')");
            expect(http.getPolygonQueryWithPoints([{}, {}], intersect)).to.equal("st_within(Thing/Locations/location,geography'POLYGON (())')");
            expect(http.getPolygonQueryWithPoints([], intersect)).to.equal("st_within(Thing/Locations/location,geography'POLYGON (())')");
        });
        it("should return false if some damaged points are given", () => {
            const points = [
                    {x: "foo", y: "bar"},
                    {x: "baz", foobar: "qux"}
                ],
                intersect = true;

            expect(http.getPolygonQueryWithPoints(points, intersect)).to.equal("st_intersects(Locations/location,geography'POLYGON ((foo bar))')");
            expect(http.getPolygonQueryWithPoints(undefined, intersect)).to.be.false;
            expect(http.getPolygonQueryWithPoints(null, intersect)).to.be.false;
            expect(http.getPolygonQueryWithPoints(1, intersect)).to.be.false;
            expect(http.getPolygonQueryWithPoints("foo", intersect)).to.be.false;
            expect(http.getPolygonQueryWithPoints({}, intersect)).to.be.false;
        });
    });

    describe("convertExtentIntoPoints", () => {
        const extent = [557698.8791748052, 5925961.066824824, 573161.1208251948, 5941978.933175176],
            sourceProjection = "EPSG:25832",
            targetProjection = "EPSG:4326",
            expectedOutcome = [
                {x: 9.869432803790303, y: 53.47946522163486, z: 0},
                {x: 10.102382514144907, y: 53.47754336682167, z: 0},
                {x: 10.10613018673993, y: 53.62149474831524, z: 0},
                {x: 9.872388814958066, y: 53.623426671455626, z: 0},
                {x: 9.869432803790303, y: 53.47946522163486, z: 0}
            ];

        it("should convert the given extent into a polygon transforming the projections", () => {
            expect(http.convertExtentIntoPoints(extent, sourceProjection, targetProjection)).to.deep.equal(expectedOutcome);
        });

        it("should return false and sends an error if anything unexpected is given as extent", () => {
            expect(http.convertExtentIntoPoints(false, sourceProjection, targetProjection, onerror)).to.be.false;
            expect(lastError).to.be.a("string");
            expect(http.convertExtentIntoPoints(undefined, sourceProjection, targetProjection, onerror)).to.be.false;
            expect(http.convertExtentIntoPoints(1, sourceProjection, targetProjection, onerror)).to.be.false;
            expect(http.convertExtentIntoPoints("foo", sourceProjection, targetProjection, onerror)).to.be.false;
            expect(http.convertExtentIntoPoints(null, sourceProjection, targetProjection, onerror)).to.be.false;
            expect(http.convertExtentIntoPoints([1, 2, 3], sourceProjection, targetProjection, onerror)).to.be.false;
            expect(http.convertExtentIntoPoints([1, 2, 3, 4, 5], sourceProjection, targetProjection, onerror)).to.be.false;
        });

        it("should return false and send an error if anything unexpected is given as sourceProjection", () => {
            expect(http.convertExtentIntoPoints(extent, false, targetProjection, onerror)).to.be.false;
            expect(lastError).to.be.a("string");
            expect(http.convertExtentIntoPoints(extent, undefined, targetProjection, onerror)).to.be.false;
            expect(http.convertExtentIntoPoints(extent, 1, targetProjection, onerror)).to.be.false;
            expect(http.convertExtentIntoPoints(extent, null, targetProjection, onerror)).to.be.false;
        });

        it("should return false and send an error if anything unexpected is given as targetProjection", () => {
            expect(http.convertExtentIntoPoints(extent, sourceProjection, false, onerror)).to.be.false;
            expect(lastError).to.be.a("string");
            expect(http.convertExtentIntoPoints(extent, sourceProjection, undefined, onerror)).to.be.false;
            expect(http.convertExtentIntoPoints(extent, sourceProjection, 1, onerror)).to.be.false;
            expect(http.convertExtentIntoPoints(extent, sourceProjection, null, onerror)).to.be.false;
        });

        it("should not call the error callback function on error if anything but a function is given as error handler", () => {
            expect(http.convertExtentIntoPoints(false, false, false, undefined)).to.be.false;
            expect(lastError).to.be.false;
        });
    });

    describe("addPointsToUrl", () => {
        const polygon = [
                {x: 9.869432803790303, y: 53.47946522163486},
                {x: 10.102382514144907, y: 53.47754336682167},
                {x: 10.10613018673993, y: 53.62149474831524},
                {x: 9.872388814958066, y: 53.623426671455626},
                {x: 9.869432803790303, y: 53.47946522163486}
            ],
            intersect = false,
            expectedOutcome = "https://iot.hamburg.de/v1.1/Things?%24filter=st_within(Locations%2Flocation%2Cgeography'POLYGON%20((9.869432803790303%2053.47946522163486%2C10.102382514144907%2053.47754336682167%2C10.10613018673993%2053.62149474831524%2C9.872388814958066%2053.623426671455626%2C9.869432803790303%2053.47946522163486))')";

        it("should return the expected url with a well formed input", () => {
            expect(http.addPointsToUrl("https://iot.hamburg.de/v1.1/Things", polygon, intersect)).to.equal(expectedOutcome);
        });

        it("should return false and call an error if a funny url is given", () => {
            expect(http.addPointsToUrl(false, polygon, intersect, onerror)).to.be.false;
            expect(lastError).to.be.a("string");
            expect(http.addPointsToUrl(undefined, polygon, intersect, onerror)).to.be.false;
            expect(http.addPointsToUrl(null, polygon, intersect, onerror)).to.be.false;
            expect(http.addPointsToUrl("foo", polygon, intersect, onerror)).to.be.false;
            expect(http.addPointsToUrl(123456, polygon, intersect, onerror)).to.be.false;
            expect(http.addPointsToUrl([], polygon, intersect, onerror)).to.be.false;
            expect(http.addPointsToUrl({}, polygon, intersect, onerror)).to.be.false;
        });

        it("should return false and call an error if a broken polygon is given", () => {
            const url = "https://iot.hamburg.de/v1.0/Things";

            expect(http.addPointsToUrl(url, false, intersect, onerror)).to.be.false;
            expect(lastError).to.be.a("string");
            expect(http.addPointsToUrl(url, undefined, intersect, onerror)).to.be.false;
            expect(http.addPointsToUrl(url, null, intersect, onerror)).to.be.false;
            expect(http.addPointsToUrl(url, "foo", intersect, onerror)).to.be.false;
            expect(http.addPointsToUrl(url, 123456, intersect, onerror)).to.be.false;
            expect(http.addPointsToUrl(url, {}, intersect, onerror)).to.be.false;
        });

        it("should not call the error callback function on error if anything but a function is given", () => {
            expect(http.addPointsToUrl("foo", "bar", intersect, undefined)).to.be.false;
            expect(lastError).to.be.false;
        });
    });

    describe("fetchTopX", () => {
        it("should return 0 if anything unknown is given", () => {
            expect(http.fetchTopX(undefined)).to.equal(0);
            expect(http.fetchTopX(null)).to.equal(0);
            expect(http.fetchTopX(1234)).to.equal(0);
            expect(http.fetchTopX([])).to.equal(0);
            expect(http.fetchTopX({})).to.equal(0);
        });
        it("should not find $top=X in url notation %24top%3DX", () => {
            const url = "https://iot.hamburg.de/v1.0/Things?%24top%3D1",
                expected = 0;

            expect(http.fetchTopX(url)).to.equal(expected);
        });
        it("should find out the number X in $top=X", () => {
            const url = "https://iot.hamburg.de/v1.0/Things?$top=1",
                expected = 1;

            expect(http.fetchTopX(url)).to.equal(expected);
        });
        it("should find out the number X in %24top=X", () => {
            const url = "https://iot.hamburg.de/v1.0/Things?%24top=1",
                expected = 1;

            expect(http.fetchTopX(url)).to.equal(expected);
        });
    });

    describe("fetchSkipX", () => {
        it("should return 0 if anything unknown is given", () => {
            expect(http.fetchSkipX(undefined)).to.equal(0);
            expect(http.fetchSkipX(null)).to.equal(0);
            expect(http.fetchSkipX(1234)).to.equal(0);
            expect(http.fetchSkipX([])).to.equal(0);
            expect(http.fetchSkipX({})).to.equal(0);
        });
        it("should not find $skip=X in url notation %24skip%3DX", () => {
            const url = "https://iot.hamburg.de/v1.0/Things?%24skip%3D1",
                expected = 0;

            expect(http.fetchSkipX(url)).to.equal(expected);
        });
        it("should find out the number X in $skip=X", () => {
            const url = "https://iot.hamburg.de/v1.0/Things?$skip=1",
                expected = 1;

            expect(http.fetchSkipX(url)).to.equal(expected);
        });
        it("should find out the number X in %24skip=X", () => {
            const url = "https://iot.hamburg.de/v1.0/Things?%24skip=1",
                expected = 1;

            expect(http.fetchSkipX(url)).to.equal(expected);
        });
    });

    describe("callHttpClient", () => {
        it("should call the (via constructor) given http handler - test: onsuccess", () => {
            let lastResponse = "";

            http.setHttpClient((url, onsuccess) => {
                onsuccess(url);
            });
            http.callHttpClient("url", response => {
                lastResponse = response;
            });

            expect(lastResponse).to.equal("url");
        });
        it("should call the (via constructor) given http handler - test: onerror", () => {
            let lastResponse = "";

            http.setHttpClient((url, onsuccess, onerrorShadow) => {
                onerrorShadow(url);
            });
            http.callHttpClient("url", (response) => {
                lastResponse = response;
            }, onerror);

            expect(lastResponse).to.be.empty;
            expect(lastError).to.equal("url");
        });
    });

    describe("getNextFiFoObj", () => {
        it("should return false on any unexpected input", () => {
            expect(http.getNextFiFoObj(undefined)).to.be.false;
            expect(http.getNextFiFoObj(null)).to.be.false;
            expect(http.getNextFiFoObj(123)).to.be.false;
            expect(http.getNextFiFoObj("string")).to.be.false;
            expect(http.getNextFiFoObj({})).to.be.false;
        });
        it("should return false if an empty array is given", () => {
            expect(http.getNextFiFoObj([])).to.be.false;
        });
        it("should return false if the next item in the given list has no key nextLink", () => {
            const nextLinkFiFo = [
                {key: "nextLink"}
            ];

            expect(http.getNextFiFoObj(nextLinkFiFo)).to.be.false;
        });
        it("should shift the first item of an array of objects and reduce the list", () => {
            const nextLinkFiFo = [
                    {nextLink: "nextLinkA"},
                    {nextLink: "nextLinkB"}
                ],
                expectedResult = {nextLink: "nextLinkA"},
                expectedList = [
                    {nextLink: "nextLinkB"}
                ];

            expect(http.getNextFiFoObj(nextLinkFiFo)).to.deep.equal(expectedResult);
            expect(nextLinkFiFo).to.deep.equal(expectedList);
        });
        it("should ignore any item which nextLink has a $top=X value with X in the range of 1 to Y of $skip=Y", () => {
            const nextLinkFiFo = [
                    {nextLink: "nextLinkA?$top=1&$skip=1"},
                    {nextLink: "nextLinkB?$top=1&$skip=2"},
                    {nextLink: "nextLinkB?$top=2&$skip=1"}
                ],
                expectedResult = {nextLink: "nextLinkB?$top=2&$skip=1"};

            expect(http.getNextFiFoObj(nextLinkFiFo)).to.deep.equal(expectedResult);
            expect(nextLinkFiFo).to.be.empty;
        });
    });

    describe("collectNextLinks", () => {
        it("should refuse to walk through anything but an object, but should call onfinish to move on", () => {
            const nextLinkFiFo = [];
            let hasFinished = false;

            http.collectNextLinks(undefined, nextLinkFiFo, () => {
                hasFinished = true;
            });
            expect(hasFinished).to.be.true;
            expect(nextLinkFiFo).to.be.empty;

            hasFinished = false;
            http.collectNextLinks(null, nextLinkFiFo, () => {
                hasFinished = true;
            });
            expect(hasFinished).to.be.true;
            expect(nextLinkFiFo).to.be.empty;

            hasFinished = false;
            http.collectNextLinks(1234, nextLinkFiFo, () => {
                hasFinished = true;
            });
            expect(hasFinished).to.be.true;
            expect(nextLinkFiFo).to.be.empty;

            hasFinished = false;
            http.collectNextLinks("string", nextLinkFiFo, () => {
                hasFinished = true;
            });
            expect(hasFinished).to.be.true;
            expect(nextLinkFiFo).to.be.empty;
        });

        it("should walk through any given object and remove IotLinks if flag removeIotLinks is set via constructor", () => {
            const resultRef = {
                "@iot.navigationLink": true,
                "@iot.selfLink": true,
                "test@iot.navigationLink": true,
                "test@iot.selfLink": true
            };

            http.setRemoveIotLinks(true);
            http.collectNextLinks(resultRef);

            expect(resultRef).to.be.empty;
        });

        it("should walk recursively through multi dimensions", () => {
            const resultRef = {
                    test: {
                        "@iot.navigationLink": true,
                        "@iot.selfLink": true
                    },
                    "test@iot.navigationLink": true,
                    "test@iot.selfLink": true
                },
                expected = {
                    test: {}
                };

            http.setRemoveIotLinks(true);
            http.collectNextLinks(resultRef);

            expect(resultRef).to.deep.equal(expected);
        });

        it("should push any key bound with an @iot.nextLink onto the fifo list", () => {
            const resultRef = {
                    test: {
                        key: "value"
                    },
                    "test@iot.nextLink": "nextLink"
                },
                expected = {
                    test: resultRef.test
                },
                nextLinkFiFo = [],
                nextLinkFiFoExpected = [{
                    nextLink: "nextLink",
                    resultRef: expected.test
                }];

            http.setRemoveIotLinks(true);
            http.collectNextLinks(resultRef, nextLinkFiFo);

            expect(resultRef).to.deep.equal(expected);
            expect(nextLinkFiFo).to.deep.equal(nextLinkFiFoExpected);
        });
    });

    describe("callNextLink", () => {
        describe("check resultRef", () => {
            let resultRef = "";

            it("should not process anything if the given resultRef is anything but an array", () => {
                resultRef = null;
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");

                lastError = false;
                resultRef = undefined;
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");

                lastError = false;
                resultRef = 1234;
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");

                lastError = false;
                resultRef = "string";
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");

                lastError = false;
                resultRef = {};
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");
            });
        });

        describe("httpClient response", () => {
            it("should not process anything if the response from httpClient is anything but an object and not null", () => {
                const resultRef = [];

                http.setHttpClient((url, onsuccess) => {
                    onsuccess(null);
                });
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");

                lastError = false;
                http.setHttpClient((url, onsuccess) => {
                    onsuccess(undefined);
                });
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");

                lastError = false;
                http.setHttpClient((url, onsuccess) => {
                    onsuccess("string");
                });
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");

                lastError = false;
                http.setHttpClient((url, onsuccess) => {
                    onsuccess(1234);
                });
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");

                lastError = false;
                http.setHttpClient((url, onsuccess) => {
                    onsuccess([]);
                });
                http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", onerror, resultRef);
                expect(lastError).to.be.a("string");
            });
        });
    });

    describe("handling of response", () => {
        it("should add response onto resultRef as it is if response is a simple object", () => {
            const resultRef = [],
                response = {
                    test: true
                },
                resultRefExpected = [response];

            http.setHttpClient((url, onsuccess) => {
                onsuccess(response);
            });
            http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", "onerror", resultRef);

            expect(resultRef).to.deep.equal(resultRefExpected);
        });
        it("should add response onto resultRef as it is if response is an object with property value but content of value is no array", () => {
            const resultRef = [],
                response = {
                    value: true
                },
                resultRefExpected = [response];

            http.setHttpClient((url, onsuccess) => {
                onsuccess(response);
            });
            http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", "onerror", resultRef);

            expect(resultRef).to.deep.equal(resultRefExpected);
        });
        it("should add values of response.value onto resultRef if response.value is an array of anything", () => {
            const resultRef = [],
                response = {
                    value: [1, 2, 3, 4]
                },
                resultRefExpected = response.value;

            http.setHttpClient((url, onsuccess) => {
                onsuccess(response);
            });
            http.callNextLink("nextLink", "nextLinkFiFo", "onfinish", "onerror", resultRef);

            expect(resultRef).to.deep.equal(resultRefExpected);
        });

        it("should add a new entry into fifo list if response has a property value and a plain @iot.nextLink", () => {
            const resultRef = [],
                nextLinkFiFo = [],
                response = {
                    "@iot.nextLink": "nextLink2",
                    value: [1, 2, 3, 4]
                },
                nextLinkFiFoExpected = [{
                    nextLink: "nextLink2",
                    resultRef: [1, 2, 3, 4]
                }];

            http.setHttpClient((url, onsuccess) => {
                onsuccess(response);
            });
            http.callNextLink("nextLink", nextLinkFiFo, "onfinish", "onerror", resultRef, () => {
                // stop recursion: do nothing
            });

            expect(nextLinkFiFo).to.deep.equal(nextLinkFiFoExpected);
        });
        it("should leave fifo list as it is if fifo list isn't an array", () => {
            const resultRef = [],
                nextLinkFiFo = {},
                response = {
                    "@iot.nextLink": "nextLink2",
                    value: [1, 2, 3, 4]
                },
                nextLinkFiFoExpected = {};

            http.setHttpClient((url, onsuccess) => {
                onsuccess(response);
            });
            http.callNextLink("nextLink", nextLinkFiFo, "onfinish", "onerror", resultRef, () => {
                // stop recursion: do nothing
            });

            expect(nextLinkFiFo).to.deep.equal(nextLinkFiFoExpected);
        });

        it("should call collectNextLinks with resultRef and nextLinkFiFo", () => {
            const resultRef = [],
                nextLinkFiFo = [],
                response = {
                    value: [1, 2, 3, 4]
                },
                resultRefExpected = [1, 2, 3, 4],
                nextLinkFiFoExpected = [];
            let lastResultRef = null,
                lastNextLinkFiFo = null;

            http.setHttpClient((url, onsuccess) => {
                onsuccess(response);
            });
            http.callNextLink("nextLink", nextLinkFiFo, "onfinish", "onerror", resultRef, (resultRefShadow, nextLinkFiFoShadow) => {
                lastResultRef = resultRefShadow;
                lastNextLinkFiFo = nextLinkFiFoShadow;
            });

            expect(lastResultRef).to.deep.equal(resultRefExpected);
            expect(lastNextLinkFiFo).to.deep.equal(nextLinkFiFoExpected);
        });
        it("should reduce nextLinkFiFo and start a recursion, following @iot.nextLink, adding result onto resultRef, should call onfinish if depth barrier is reached", () => {
            const resultRef = [],
                nextLinkFiFo = [],
                responseA = {
                    "@iot.nextLink": "https://iot.hamburg.de/v1.0/Things2",
                    value: [1, 2, 3, 4]
                },
                responseB = {
                    value: [5, 6, 7, 8]
                },
                resultRefExpected = [1, 2, 3, 4, 5, 6, 7, 8];
            let hasFinished = false;

            http.setHttpClient((url, onsuccess) => {
                if (url === "https://iot.hamburg.de/v1.0/Things") {
                    onsuccess(responseA);
                }
                else if (url === "https://iot.hamburg.de/v1.0/Things2") {
                    onsuccess(responseB);
                }
            });

            http.callNextLink("https://iot.hamburg.de/v1.0/Things", nextLinkFiFo, () => {
                // onfinish
                hasFinished = true;
            }, "onerror", resultRef);

            expect(hasFinished).to.be.true;
            expect(resultRef).to.deep.equal(resultRefExpected);
        });
    });

    describe("get", () => {
        it("should call this.callNextLink with specific parameters", () => {
            const lastNextLinkExpected = "url",
                lastResultRefExpected = [],
                lastNextLinkFiFoExpected = [];
            let lastNextLink = null,
                onstartCalled = false,
                onsuccessCalled = false,
                oncompleteCalled = false,
                lastResultRef = null,
                lastNextLinkFiFo = null;

            http.get("url", () => {
                // onsuccess
                onsuccessCalled = true;
            }, () => {
                // onstart
                onstartCalled = true;
            }, () => {
                // oncomplete
                oncompleteCalled = true;
            }, "onerror", (nextLink, nextLinkFiFo, onfinish, onerrorShadow, resultRef) => {
                lastNextLink = nextLink;
                lastNextLinkFiFo = nextLinkFiFo;
                lastResultRef = resultRef;
                onfinish();
            });

            expect(lastNextLink).to.equal(lastNextLinkExpected);
            expect(lastNextLinkFiFo).to.deep.equal(lastNextLinkFiFoExpected);
            expect(lastResultRef).to.deep.equal(lastResultRefExpected);
            expect(onstartCalled).to.be.true;
            expect(onsuccessCalled).to.be.true;
            expect(oncompleteCalled).to.be.true;
        });
        it("should call oncomplete if an error occurs", () => {
            let oncompleteCalled = false;

            http.get("url", "onsuccess", "onstart", () => {
                // oncomplete
                oncompleteCalled = true;
            }, "onerror", (nextLink, nextLinkFiFo, onfinish, onerrorShadow) => {
                onerrorShadow();
            });

            expect(oncompleteCalled).to.be.true;
        });
    });

    describe("getInExtent", () => {
        it("should add the extent to the url and call this.get", () => {
            const extentObj = {
                    extent: [557698.8791748052, 5925961.066824824, 573161.1208251948, 5941978.933175176],
                    sourceProjection: "EPSG:25832",
                    targetProjection: "EPSG:4326"
                },
                url = "https://iot.hamburg.de/v1.0/Things",
                lastUrlExpected = "https://iot.hamburg.de/v1.0/Things?%24filter=st_within(Locations%2Flocation%2Cgeography'POLYGON%20((9.869432803790303%2053.47946522163486%2C10.102382514144907%2053.47754336682167%2C10.10613018673993%2053.62149474831524%2C9.872388814958066%2053.623426671455626%2C9.869432803790303%2053.47946522163486))')";
            let lastUrl = null;

            http.getInExtent(url, extentObj, false, "onsuccess", "onstart", "oncomplete", "onerror", urlShadow => {
                lastUrl = urlShadow;
            });

            expect(lastUrl).to.equal(lastUrlExpected);
        });
    });
});
