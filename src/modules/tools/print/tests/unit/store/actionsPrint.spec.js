import testAction from "../../../../../../../test/unittests/VueTestUtils";
import actions from "../../../store/actionsPrint";
import VectorLayer from "ol/layer/Vector.js";
import sinon from "sinon";
import {expect} from "chai";

const {sendRequest, activatePrintStarted, startPrint, getMetaDataForPrint, createPrintJob, waitForPrintJob, waitForPrintJobSuccess} = actions;

describe("tools/print/actionsPrint", function () {
    describe("sendRequest", function () {
        it("should send a request", done => {
            const state = {
                    useProxy: false
                },
                serviceRequest = {
                    "serviceUrl": "https://geodienste.hamburg.de/mapfish_print_internet/print/master/status/b9feec2f-b012-4e76-9b05-2499a0ae59ee@89c12004-d327-4fb1-88a3-2a3332fa36a0.json",
                    "requestType": "GET",
                    "onSuccess": "waitForPrintJobSuccess"
                },
                response = {
                    "done": true,
                    "downloadURL": "/mapfish_print_internet/print/report/b9feec2f-b012-4e76-9b05-2499a0ae59ee@89c12004-d327-4fb1-88a3-2a3332fa36a0",
                    "elapsedTime": 7699,
                    "status": "finished",
                    "waitingTime": 0
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(sendRequest, serviceRequest, state, {}, [
                {type: "waitForPrintJobSuccess", payload: response, dispatch: true}
            ], {}, done);
        }).timeout(8000);
    });

    describe("activatePrintStarted", function () {
        it("should set activatePrintStarted to true", done => {
            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(activatePrintStarted, undefined, {}, {}, [
                {type: "setPrintStarted", payload: true, commit: true}
            ], {}, done);
        });
    });

    describe("startPrint", function () {
        it("should start the print", done => {
            const TileLayer = {},
                state = {
                    visibleLayerList: [
                        TileLayer,
                        VectorLayer,
                        VectorLayer,
                        VectorLayer,
                        VectorLayer
                    ],
                    currentLayoutName: "A4 Hochformat",
                    filename: "Hamburger Menu",
                    currentFormat: "pdf",
                    title: "Cheeseburger Menu",
                    currentScale: 60000,
                    isMetaDataAvailable: false,
                    isScaleAvailable: true,
                    isGfiAvailable: false,
                    isLegendAvailable: true,
                    isLegendSelected: false
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(startPrint, state, {}, {}, [
                {type: "setProgressWidth", payload: "width: 25%", commit: true},
                {type: "getVisibleLayer", payload: undefined, dispatch: true}
            ], {}, done);
        });
        it("should start the print but with no legend", done => {
            const TileLayer = {},
                state = {
                    visibleLayerList: [
                        TileLayer,
                        VectorLayer,
                        VectorLayer,
                        VectorLayer,
                        VectorLayer
                    ],
                    currentLayoutName: "A4 Hochformat",
                    filename: "Hamburger Menu",
                    currentFormat: "pdf",
                    title: "Cheeseburger Menu",
                    currentScale: 60000,
                    isMetaDataAvailable: false,
                    isScaleAvailable: true,
                    isGfiAvailable: false,
                    isLegendAvailable: false,
                    isLegendSelected: false,
                    printAppId: "master"
                },
                defaults = {
                    attributes: {title: "Mein Titel", scale: "1:60000", showGfi: false},
                    layout: "A3 Hochformat",
                    outputFilename: "Ausdruck",
                    outputFormat: "pdf",
                    uniqueIdList: [],
                    visibleLayerIds: ["453", "8712", "1711"]
                },
                printJob = {
                    "payload": encodeURIComponent(JSON.stringify(defaults)),
                    "printAppId": state.printAppId,
                    "currentFormat": state.currentFormat
                },
                request = sinon.spy(() => ({
                    getCode: () => "EPSG:25832"
                }));

            sinon.stub(Radio, "request").callsFake(request);

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(startPrint, state, {}, {}, [
                {type: "setProgressWidth", payload: "width: 25%", commit: true},
                {type: "getVisibleLayer", payload: undefined, dispatch: true},
                {type: "createPrintJob", payload: printJob, dispatch: true}
            ], {}, done);
        });

    });

    // describe("getMetaDataForPrint", function () {
    //     it("should get metadata", done => {
    //         // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
    //         testAction(getMetaDataForPrint, undefined, {}, {}, [
    //             {type: "setPrintStarted", payload: true, commit: true}
    //         ], {}, done);
    //     });
    // });
    describe("createPrintJob", function () {
        it("should create a printJob", done => {
            const payload = "",
                state = {
                    mapfishServiceUrl: "https://geodienste.hamburg.de/mapfish_print_internet/print/",
                    printAppId: "master",
                    currentFormat: "A4 Hochformat"
                },
                data = {
                    ownloadURL: "/mapfish_print_internet/print/report/2ca7f8ab-24f0-48e1-9fd7-a6fe3349ccd0@89c12004-d327-4fb1-88a3-2a3332fa36a0",
                    ref: "2ca7f8ab-24f0-48e1-9fd7-a6fe3349ccd0@89c12004-d327-4fb1-88a3-2a3332fa36a0",
                    statusURL: "/mapfish_print_internet/print/status/2ca7f8ab-24f0-48e1-9fd7-a6fe3349ccd0@89c12004-d327-4fb1-88a3-2a3332fa36a0.json"
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(createPrintJob, payload, state, {}, [
                {type: "setProgressWidth", payload: "width: 50%", commit: true},
                {type: "waitForPrintJob", payload: data, dispatch: true}
            ], {}, done);
        });
    });
    describe("waitForPrintJob", function () {
        it("should start another print request", done => {
            const state = {
                    mapfishServiceUrl: "https://geodienste.hamburg.de/mapfish_print_internet/print/",
                    printAppId: "master"
                },
                response = {
                    ref: "d023a604-99b0-4a4d-aa40-a1d3b5a0fd5d@5f00580a-5fd4-4579-8d21-1ad07051d09a"
                },
                serviceRequest = {
                    "serviceUrl": "https://geodienste.hamburg.de/mapfish_print_internet/print/master/status/d023a604-99b0-4a4d-aa40-a1d3b5a0fd5d@5f00580a-5fd4-4579-8d21-1ad07051d09a.json",
                    "requestType": "GET",
                    "onSuccess": "waitForPrintJobSuccess"
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(waitForPrintJob, response, state, {}, [
                {type: "setProgressWidth", payload: "width: 75%", commit: true},
                {type: "sendRequest", payload: serviceRequest, dispatch: true}
            ], {}, done);
        });
    });

    describe("waitForPrintJobSuccess", function () {
        it("is not done yet so it should start another print request", done => {
            const state = {
                    mapfishServiceUrl: "https://geodienste.hamburg.de/mapfish_print_internet/print/",
                    printAppId: "master"
                },
                response = {
                    done: false,
                    downloadURL: "/mapfish_print_internet/print/report/5dbc66f1-0ff5-4ba6-8257-640c600150d0@a8cb3d11-7c03-48d3-995e-b7734c564164",
                    elapsedTime: 4278,
                    status: "running",
                    waitingTime: 0
                },
                serviceRequest = {
                    "serviceUrl": "https://geodienste.hamburg.de/mapfish_print_internet/print/master/status/d023a604-99b0-4a4d-aa40-a1d3b5a0fd5d@5f00580a-5fd4-4579-8d21-1ad07051d09a.json",
                    "requestType": "GET",
                    "onSuccess": "waitForPrintJobSuccess"
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(waitForPrintJobSuccess, response, state, {}, [
                {type: "setProgressWidth", payload: "width: 80%", commit: true},
                {type: "sendRequest", payload: serviceRequest, dispatch: true}
            ], {}, done);
        });
        it("is done so it should activate the download", done => {
            const state = {
                    mapfishServiceUrl: "https://geodienste.hamburg.de/mapfish_print_internet/print/",
                    printAppId: "master",
                    filename: "Meine Datey"
                },
                response = {
                    done: true,
                    downloadURL: "/mapfish_print_internet/print/report/d75d96af-63b1-41b0-860c-96333e05e876@a8cb3d11-7c03-48d3-995e-b7734c564164",
                    elapsedTime: 6145,
                    status: "finished",
                    waitingTime: 0
                },
                fileSpecs = {
                    fileUrl: "https://geodienste.hamburg.de/mapfish_print_internet/print/master/report/d75d96af-63b1-41b0-860c-96333e05e876@a8cb3d11-7c03-48d3-995e-b7734c564164",
                    filename: "Meine Datey"
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(waitForPrintJobSuccess, response, state, {}, [
                {type: "setProgressWidth", payload: "width: 100%", commit: true},
                {type: "downloadFile", payload: fileSpecs, dispatch: true}
            ], {}, done);
        });
    });

});
