import {expect} from "chai";
import sinon from "sinon";
import Map from "ol/Map";
import View from "ol/View";
import {doSpecialBackboneHandling, handleUrlParamsBeforeVueMount, translateToBackbone, updateQueryStringParam} from "../../../parametricUrl/ParametricUrlBridge";
import store from "../../../../app-store";


describe("src/utils/parametricUrl/ParametricUrlBridge.js", () => {
    const originLocation = location,
        originWindow = window;
    let map,
        mapView;

    before(() => {
        i18next.init({
            lng: "cimode",
            debug: false
        });
    });

    beforeEach(() => {
        mapCollection.clear();
        map = new Map({
            id: "ol",
            mode: "2D",
            view: new View({
                extent: [510000.0, 5850000.0, 625000.4, 6000000.0],
                center: [565874, 5934140],
                zoom: 2,
                options: [
                    {resolution: 66.14579761460263, scale: 250000, zoomLevel: 0},
                    {resolution: 26.458319045841044, scale: 100000, zoomLevel: 1},
                    {resolution: 15.874991427504629, scale: 60000, zoomLevel: 2},
                    {resolution: 10.583327618336419, scale: 40000, zoomLevel: 3},
                    {resolution: 5.2916638091682096, scale: 20000, zoomLevel: 4},
                    {resolution: 2.6458319045841048, scale: 10000, zoomLevel: 5},
                    {resolution: 1.3229159522920524, scale: 5000, zoomLevel: 6},
                    {resolution: 0.6614579761460262, scale: 2500, zoomLevel: 7},
                    {resolution: 0.2645831904584105, scale: 1000, zoomLevel: 8},
                    {resolution: 0.1322915952292052, scale: 500, zoomLevel: 9}
                ],
                resolution: 15.874991427504629,
                resolutions: [66.14579761460263, 26.458319045841044, 15.874991427504629, 10.583327618336419, 5.2916638091682096, 2.6458319045841048, 1.3229159522920524, 0.6614579761460262, 0.2645831904584105, 0.13229159522920522]
            })
        });

        map.setSize([1059, 887]);

        mapCollection.addMap(map, "2D");
        mapView = mapCollection.getMapView("2D");
    });

    after(() => {
        mapCollection.clear();
    });
    /**
     * Resets global.window and global.location to inital content.
     * @returns {void}
     */
    function afterUpdateQueryStringParam () {
        global.window = originWindow;
        global.location = originLocation;
    }
    /**
     * Sets global variables for test.
     * @returns {void}
     */
    async function beforeUpdateQueryStringParam () {
        let state = {query: "foo"};

        global.window = {navigator: {userAgent: "test"}};
        global.window.top = global.window;
        global.window.history = {
            state: state,
            replaceState: (stateObj, title, url) => {
                state = stateObj;
                if (location.search !== "") {
                    location.search = location.search + "&" + url.substring(url.indexOf("?") + 1);
                }
                else {
                    location.search = url.substring(url.indexOf("?"));
                }

            }};
        global.location = {
            search: "",
            protocol: "https:",
            host: "localhost:8080",
            pathname: "/foo"
        };
        global.window.location = location;
        await updateQueryStringParam("key", "value");
    }
    afterEach(sinon.restore);

    describe("updateQueryStringParam", function () {
        it("should be a string", async function () {
            beforeUpdateQueryStringParam();
            expect(location.search).to.be.a("string");
            afterUpdateQueryStringParam();
        });
        it("should be a string with one key value pair", async function () {
            beforeUpdateQueryStringParam();
            expect(location.search).to.equal("?key=value");
            expect(store.state.urlParams.key).to.equal("value");
            afterUpdateQueryStringParam();
        });
        it("should be a string with two key value pairs", async function () {
            beforeUpdateQueryStringParam();
            await updateQueryStringParam("newKey", "newValue");
            expect(location.search).to.equal("?key=value&newKey=newValue");
            expect(store.state.urlParams.key).to.equal("value");
            expect(store.state.urlParams.newKey).to.equal("newValue");
            afterUpdateQueryStringParam();
        });
        it("should be updated the first key value pair", async function () {
            beforeUpdateQueryStringParam();
            await updateQueryStringParam("key", "der_beste_String_aller_Zeiten");
            expect(location.search).to.include("key=der_beste_String_aller_Zeiten");
            expect(store.state.urlParams.key).to.equal("der_beste_String_aller_Zeiten");
            expect(store.state.urlParams.newKey).to.equal("newValue");
            afterUpdateQueryStringParam();
        });

    });

    describe("handleUrlParamsBeforeVueMount", function () {
        it("test url param key query", () => {
            const value = "Neuenfelder Straße,19";
            let query = "?query=Neuenfelder%20Stra%C3%9Fe,19";

            handleUrlParamsBeforeVueMount(query);
            expect(store.state.urlParams["Search/query"]).to.be.equals(value);

            store.state.urlParams["Search/query"] = null;
            query = "?Search/query=Neuenfelder%20Stra%C3%9Fe,19";
            handleUrlParamsBeforeVueMount(query);
            expect(store.state.urlParams["Search/query"]).to.be.equals(value);
        });
        it("test url param key map/layerids", () => {
            let query = "?layerids=123,456";
            const value = [{
                "id": "123",
                "transparency": 0,
                "visibility": true
            },
            {
                "id": "456",
                "transparency": 0,
                "visibility": true
            }];

            handleUrlParamsBeforeVueMount(query);
            expect(store.state.urlParams["Map/layerIds"]).to.be.deep.equals(value);

            store.state.urlParams["Map/layerIds"] = null;
            query = "?layerids=123,456";
            handleUrlParamsBeforeVueMount(query);
            expect(store.state.urlParams["Map/layerIds"]).to.be.deep.equals(value);
        });
    });
    describe("translateToBackbone", function () {
        it("test url param key containing tools", () => {
            const value = "true";
            let key = "tools/draw/active",
                result = translateToBackbone(key, value);

            expect(result).to.be.deep.equals({key: "isinitopen", value: "draw"});

            key = "tools/draw";
            result = translateToBackbone(key, value);
            expect(result).to.be.deep.equals({key: "isinitopen", value: "draw"});

            key = "draw/active";
            result = translateToBackbone(key, value);
            expect(result).to.be.deep.equals({key: "isinitopen", value: "draw"});
        });
    });
    describe("doSpecialBackboneHandling", function () {
        it("test url param key 'Map/mapMode'", () => {
            const radioTrigger = sinon.spy(Radio, "trigger"),
                key = "Maps/mapMode";

            doSpecialBackboneHandling(key, "3D");
            expect(radioTrigger.calledOnceWithExactly("Map", "mapChangeTo3d")).to.be.true;
        });
        it("test url param key 'Map/mdId'", () => {
            const radioTrigger = sinon.stub(Radio, "trigger").callsFake(),
                baseLayer = {
                    id: "idBaseLayer",
                    setIsSelected: sinon.stub()
                },
                layer = {
                    id: "idLayer",
                    setIsSelected: sinon.stub()
                },
                key = "Maps/mdId",
                value = "6E28E698-F4FA-4231-A8C5-CC44441FF2A7";
            let getItemsByMetaIDCallCount = 0,
                metaIdAsParam = false;

            sinon.stub(Radio, "request").callsFake((...args) => {
                let ret = null;

                args.forEach(arg => {
                    if (arg === value) {
                        metaIdAsParam = true;
                    }
                    if (arg === "getItemsByAttributes") {
                        ret = [baseLayer];
                    }
                    else if (arg === "getModelByAttributes") {
                        ret = layer;
                    }
                    else if (arg === "getItemsByMetaID") {
                        getItemsByMetaIDCallCount++;
                        ret = [layer];
                    }
                });
                return ret;
            });
            doSpecialBackboneHandling(key, value);
            expect(radioTrigger.calledWithExactly("Util", "refreshTree")).to.be.true;
            expect(getItemsByMetaIDCallCount).to.be.equals(1);
            expect(metaIdAsParam).to.be.true;
        });
        it("test url param key 'Map/zoomToExtent'", () => {
            store.state.urlParams.projection = undefined;
            store.state.Maps.projection = undefined;

            const key = "Maps/zoomToExtent",
                value = [510000, 5850000, 625000, 6000000],
                valueAsString = value.join(",");

            doSpecialBackboneHandling(key, valueAsString);

            expect(mapView.getCenter()).to.deep.equal([565874, 5934140]);
            expect(Math.round(mapView.getZoom())).equals(2);
        });
        it("test url param key 'style'", () => {
            const radioTrigger = sinon.spy(Radio, "trigger"),
                key = "style",
                value = "simple";

            doSpecialBackboneHandling(key, value);
            expect(radioTrigger.calledOnceWithExactly("Util", "setUiStyle", value.toUpperCase())).to.be.true;
        });
    });
});
