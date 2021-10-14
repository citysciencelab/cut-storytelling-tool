import axios from "axios";
import getProxyUrl from "../../../../utils/getProxyUrl";
import BuildSpec from "./../store/utils/buildSpec";
import {getRecordById} from "../../../../api/csw/getRecordById";
import omit from "../../../../utils/omit";
import actionsPrintInitialization from "./actions/actionsPrintInitialization";

export default {

    ...actionsPrintInitialization,
    /**
     * Performs an asynchronous HTTP request
     * @param {Object} param.state the state
     * @param {Object} param.dispatch the dispatch
     * @param {Object} serviceRequest the request content
     * @returns {void}
     */
    sendRequest: async function ({state, dispatch}, serviceRequest) {
        /**
         * @deprecated in the next major-release!
         * useProxy
         * getProxyUrl()
         */
        const url = state.useProxy ? getProxyUrl(serviceRequest.serviceUrl) : serviceRequest.serviceUrl;

        axios({
            url: url,
            type: serviceRequest.requestType
        }).then(response => {
            dispatch(String(serviceRequest.onSuccess), response.data);
        });
    },

    /**
     * sets the printStarted to activie for the Add Ons
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    activatePrintStarted: function ({commit}) {
        commit("setPrintStarted", true);
    },

    /**
     * starts the printing process
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    startPrint: function ({state, dispatch, commit}) {
        commit("setProgressWidth", "width: 25%");
        dispatch("getVisibleLayer");
        const visibleLayerList = state.visibleLayerList,
            attr = {
                "layout": state.currentLayoutName,
                "outputFilename": state.filename,
                "outputFormat": state.currentFormat,
                "attributes": {
                    "title": state.title,
                    "map": {
                        "dpi": state.dpiForPdf,
                        "projection": Radio.request("MapView", "getProjection").getCode(),
                        "center": Radio.request("MapView", "getCenter"),
                        "scale": state.currentScale
                    }
                }
            };

        let spec = BuildSpec;

        spec.setAttributes(attr);

        if (state.isMetaDataAvailable) {
            spec.setMetadata(true);
        }

        if (state.isScaleAvailable) {
            spec.buildScale(state.currentScale);
        }
        spec.buildLayers(visibleLayerList);

        if (state.isGfiAvailable) {
            dispatch("getGfiForPrint");
            spec.buildGfi(state.isGfiSelected, state.gfiForPrint);
        }

        if (state.isLegendAvailable) {
            spec.buildLegend(state.isLegendSelected, state.isMetaDataAvailable);
        }
        else {
            spec.setLegend({});
            spec.setShowLegend(false);
            spec = omit(spec, ["uniqueIdList"]);
            const printJob = {
                "payload": encodeURIComponent(JSON.stringify(spec.defaults)),
                "printAppId": state.printAppId,
                "currentFormat": state.currentFormat
            };

            dispatch("createPrintJob", printJob);
        }
    },

    /**
     * Gets the Gfi Information
     * @param {Object} param.rootGetters the rootgetters
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    getGfiForPrint: async function ({rootGetters, commit}) {
        if (rootGetters["Tools/Gfi/currentFeature"] !== null) {
            commit("setGfiForPrint", [rootGetters["Tools/Gfi/currentFeature"].getMappedProperties(), rootGetters["Tools/Gfi/currentFeature"].getTitle(), rootGetters["Map/clickCoord"]]);
        }
        else {
            commit("setGfiForPrint", []);
        }
    },

    /**
     * sets the metadata for print NOTE: wurde noch nicht getestet
     * @param {Object} param.rootGetters the rootGetters
     * @param {Object} param.dispatch the dispatch
     * @param {Object} cswObj the object with all the info
     * @returns {void}
     */
    getMetaDataForPrint: async function ({rootGetters, dispatch}, cswObj) {
        let metadata;

        if (cswObj.layer.get("datasets") && Array.isArray(cswObj.layer.get("datasets")) && cswObj.layer.get("datasets")[0] !== null && typeof cswObj.layer.get("datasets")[0] === "object") {
            cswObj.cswUrl = Object.prototype.hasOwnProperty.call(cswObj.layer.get("datasets")[0], "csw_url") ? cswObj.layer.get("datasets")[0].csw_url : null;
        }

        cswObj.parsedData = {};

        if (cswObj.cswUrl === null || typeof cswObj.cswUrl === "undefined") {
            const cswId = Config.cswId || "3",
                cswService = Radio.request("RestReader", "getServiceById", cswId);

            cswObj.cswUrl = cswService.get("url");
        }

        /**
         * @deprecated in the next major-release!
         * useProxy
         * getProxyUrl()
         */
        if (rootGetters.metadata.useProxy.includes(cswObj.cswUrl)) {
            metadata = await getRecordById(getProxyUrl(cswObj.cswUrl), cswObj.metaId);
        }
        else {
            metadata = await getRecordById(cswObj.cswUrl, cswObj.metaId);
        }

        if (typeof metadata === "undefined") {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.layerInformation.errorMessage", {cswObjCswUrl: cswObj.cswUrl}));
        }
        else {
            cswObj.parsedData = {};
            cswObj.parsedData.orgaOwner = metadata.getOwner().name || "n.N.";
            cswObj.parsedData.address = {
                street: metadata.getOwner().street || "",
                housenr: "",
                postalCode: metadata.getOwner().postalCode || "",
                city: metadata.getOwner().city || ""
            };
            cswObj.parsedData.email = metadata.getOwner().email || "n.N.";
            cswObj.parsedData.tel = metadata.getOwner().phone || "n.N.";
            cswObj.parsedData.url = metadata.getOwner().link || "n.N.";

            if (typeof metadata.getRevisionDate() !== "undefined") {
                cswObj.parsedData.date = metadata.getRevisionDate();
            }
            else if (typeof metadata.getPublicationDate() !== "undefined") {
                cswObj.parsedData.date = metadata.getPublicationDate();
            }
            else if (typeof metadata.getCreationDate() !== "undefined") {
                cswObj.parsedData.date = metadata.getCreationDate();
            }
        }

        BuildSpec.fetchedMetaData();
    },

    /**
     * sends an async request to create a print job
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} printJob the content for the printRequest
     * @returns {void}
     */
    createPrintJob: async function ({state, dispatch, commit}, printJob) {
        if (state.mapfishServiceUrl === "") {
            let serviceUrl;

            if (state.printSettings) {
                serviceUrl = Radio.request("RestReader", "getServiceById", state.printSettings.mapfishServiceId).get("url");
            }
            else {
                serviceUrl = Radio.request("RestReader", "getServiceById", "mapfish").get("url");
            }

            commit("setMapfishServiceUrl", serviceUrl);
        }
        const printId = printJob.printAppId || state.printAppId,
            printFormat = printJob.format || state.currentFormat,
            url = state.mapfishServiceUrl + printId + "/report." + printFormat;
        let response = "";

        commit("setProgressWidth", "width: 50%");
        response = await axios.post(url, printJob.payload);

        dispatch("waitForPrintJob", response.data);
    },

    /**
     * Sends a request to get the status for a print job until it is finished.
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {JSON} response - Response of print job.
     * @returns {void}
     */
    waitForPrintJob: async function ({state, dispatch, commit}, response) {
        const printAppId = state.printAppId,
            url = state.mapfishServiceUrl + printAppId + "/status/" + response.ref + ".json",
            serviceRequest = {
                "serviceUrl": url,
                "requestType": "GET",
                "onSuccess": "waitForPrintJobSuccess"
            };

        commit("setProgressWidth", "width: 75%");
        dispatch("sendRequest", serviceRequest);
    },

    waitForPrintJobSuccess: async function ({state, dispatch, commit}, response) {
        // Error processing...
        if (response.status === "error") {
            console.error("Error: " + response.error);
        }
        else if (response.done) {
            commit("setProgressWidth", "width: 100%");
            let subUrl = "";

            if (response.downloadURL.includes("mapfish_print_internet")) {
                subUrl = response.downloadURL.replace("/mapfish_print_internet/print/report/", "");
            }
            else if (response.downloadURL.includes("mapfish_print/")) {
                subUrl = response.downloadURL.replace("/mapfish_print/print/report/", "");
            }
            const fileSpecs = {
                "fileUrl": state.mapfishServiceUrl + state.printAppId + "/report/" + subUrl,
                "filename": state.filename
            };

            dispatch("downloadFile", fileSpecs);
        }
        else {
            commit("setProgressWidth", "width: 80%");
            // The report is not ready yet. Check again in 2s.
            setTimeout(function () {
                let subUrl = "";

                if (response.downloadURL.includes("mapfish_print_internet")) {
                    subUrl = response.downloadURL.replace("/mapfish_print_internet/print/report/", "");
                }
                else if (response.downloadURL.includes("mapfish_print/")) {
                    subUrl = response.downloadURL.replace("/mapfish_print/print/report/", "");
                }
                const url = state.mapfishServiceUrl + state.printAppId + "/status/" + subUrl + ".json",
                    serviceRequest = {
                        "serviceUrl": url,
                        "requestType": "GET",
                        "onSuccess": "waitForPrintJobSuccess"
                    };

                dispatch("sendRequest", serviceRequest);
            }, 2000);
        }
    },
    /**
     * Starts the download from printfile,
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} fileSpecs The url to dwonloadfile and name
     * @returns {void}
     */
    downloadFile: function ({state, commit}, fileSpecs) {
        commit("setPrintStarted", false);
        commit("setPrintFileReady", true);
        /**
         * @deprecated in the next major-release!
         * useProxy
         * getProxyUrl()
         */
        commit("setFileDownloadUrl", state.useProxy ? getProxyUrl(fileSpecs.fileUrl) : fileSpecs.fileUrl);
        commit("setFilename", fileSpecs.filename);
    }
};
