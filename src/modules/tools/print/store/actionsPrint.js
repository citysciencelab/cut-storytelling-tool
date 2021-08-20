import axios from "axios";
import getProxyUrl from "../../../../utils/getProxyUrl";
import thousandsSeparator from "../../../../utils/thousandsSeparator.js";
import Canvas from "./../store/utils/buildCanvas";
import SpecModel from "./../store/utils/buildSpec";
import differenceJS from "../../../../utils/differenceJS";
import sortBy from "../../../../utils/sortBy";
import {DEVICE_PIXEL_RATIO} from "ol/has.js";
import {getRecordById} from "../../../../api/csw/getRecordById";
import {omit} from "../../../../utils/objectHelpers";

export default {
    /**
     * Gets the capabilities for a specific print configuration
     * @param {Object} param.state the state
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    retrieveCapabilites: function ({state, dispatch, commit}) {
        let serviceUrl;

        if (state.printSettings.mapfishServiceId !== undefined) {
            serviceUrl = Radio.request("RestReader", "getServiceById", state.printSettings.mapfishServiceId).get("url");
            commit("setMapfishServiceUrl", serviceUrl);
            serviceUrl = serviceUrl + state.printAppId + "/capabilities.json";
            const serviceRequest = {
                "serviceUrl": serviceUrl,
                "requestType": "GET",
                "onSuccess": "parseMapfishCapabilities"
            };

            dispatch("sendRequest", serviceRequest);

        }
    },

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
            type: serviceRequest.requestType,
            timeout: serviceRequest.timeout
        }).then(response => {
            dispatch(String(serviceRequest.onSuccess), response.data);
        });
    },
    /**
     * Sets the capabilities from mapfish resonse.
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object[]} response - config.yaml from mapfish.
     * @returns {void}
     */
    parseMapfishCapabilities: function ({state, commit, dispatch}, response) {
        commit("setLayoutList", response.layouts);
        dispatch("chooseCurrentLayout", response.layouts);
        dispatch("getAttributeInLayoutByName", "metadata");
        dispatch("getAttributeInLayoutByName", "gfi");
        dispatch("getAttributeInLayoutByName", "legend");
        dispatch("getAttributeInLayoutByName", "scale");
        commit("setFormatList", response.formats);
        commit("setCurrentScale", Radio.request("MapView", "getOptions").scale);
        dispatch("togglePostrenderListener");
        if (state.isGfiAvailable) {
            dispatch("getGfiForPrint");
            SpecModel.buildGfi(state.isGfiSelected, state.gfiForPrint);
        }
    },

    /**
     * Choose the layout which is configured as currentlayout
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object[]} [layouts=[]] - All Layouts
     * @returns {void}
     */
    chooseCurrentLayout: function ({state, commit}, layouts) {
        const currentLayout = layouts.filter(layout => layout.name === state.currentLayoutName);

        commit("setCurrentLayout", currentLayout.length === 1 ? currentLayout[0] : layouts[0]);
    },

    getGfiForPrint: function ({rootGetters, commit}) {
        if (rootGetters["Tools/Gfi/currentFeature"] !== null) {
            commit("setGfiForPrint", [rootGetters["Tools/Gfi/currentFeature"].getMappedProperties(), rootGetters["Tools/Gfi/currentFeature"].getTitle(), rootGetters["Tools/Map/clickCoord"]]);
        }
        else {
            commit("setGfiForPrint", []);
        }
    },

    /**
     * sets a capabilities attribute object of the current layout, corresponding to the given name
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {String} name - name of the attribute to get
     * @returns {Object|undefined} corresponding attribute or null
     */
    getAttributeInLayoutByName: function ({state, commit}, name) {
        state.currentLayout.attributes.find(function (attribute) {
            return attribute.name === name;
        });
        state.currentLayout.attributes.forEach(attribute => {
            if (attribute.name === name) {
                const capName = name.charAt(0).toUpperCase() + name.slice(1);

                commit("setIs" + capName + "Available", true);
                commit("set" + capName + "Attribute", attribute);
            }
        });
    },


    /**
     * if the tool is activated and there is a layout,
     * a callback function is registered to the postrender event of the map
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    togglePostrenderListener: function ({state, dispatch, commit}) {
        const foundVectorTileLayers = [];

        dispatch("getVisibleLayer");

        /*
        * Since MapFish 3 does not yet support VTL (see https://github.com/mapfish/mapfish-print/issues/659),
        * they are filtered in the following code and an alert is shown to the user informing him about which
        * layers will not be printed.
        */
        if (foundVectorTileLayers.length && state.active) {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.print.vtlWarning"), {root: true});
        }

        commit("setVisibleLayer", state.visibleLayerList);

        if (state.active && state.layoutList.length !== 0 && state.visibleLayerList.length >= 1 && state.eventListener === undefined) {
            const canvasLayer = Canvas.getCanvasLayer(state.visibleLayerList);

            commit("setEventListener", canvasLayer.on("postrender", evt => dispatch("createPrintMask", evt)));
        }
        else {
            Radio.trigger("Map", "unregisterListener", state.eventListener);
            commit("setEventListener", undefined);
            if (state.invisibleLayer) {
                dispatch("setOriginalPrintLayer");
                commit("setHintInfo", "");
            }
        }
        Radio.trigger("Map", "render");
    },

    /**
     * Getting und showing the layer which is visible in map scale
     * @param {Object} param.state the state
     * @returns {void} -
     */
    setOriginalPrintLayer: function ({state}) {
        const invisibleLayer = state.invisibleLayer,
            mapScale = state.currentMapScale,
            resoByMaxScale = Radio.request("MapView", "getResoByScale", mapScale, "max"),
            resoByMinScale = Radio.request("MapView", "getResoByScale", mapScale, "min");

        invisibleLayer.forEach(layer => {
            const layerModel = Radio.request("ModelList", "getModelByAttributes", {"id": layer.get("id")});

            if (resoByMaxScale <= layer.getMaxResolution() && resoByMinScale > layer.getMinResolution()) {
                layerModel.setIsOutOfRange(false);
            }
            else {
                layerModel.setIsOutOfRange(true);
            }
            layer.setVisible(true);

        });
    },

    /**
     * Getting und showing the layer which is visible in print scale
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {String} scale - the current print scale
     * @returns {void} -
     */
    setPrintLayers: function ({state, dispatch, commit}, scale) {
        const visibleLayer = state.visibleLayerList,
            resoByMaxScale = Radio.request("MapView", "getResoByScale", scale, "max"),
            resoByMinScale = Radio.request("MapView", "getResoByScale", scale, "min"),
            invisibleLayer = [];

        let invisibleLayerNames = "",
            hintInfo = "";

        visibleLayer.forEach(layer => {
            const layerModel = Radio.request("ModelList", "getModelByAttributes", {"id": layer.id});

            if (resoByMaxScale > layer.getMaxResolution() || resoByMinScale < layer.getMinResolution()) {
                invisibleLayer.push(layer);
                invisibleLayerNames += "- " + layer.get("name") + "<br>";
                if (layerModel !== undefined) {
                    layerModel.setIsOutOfRange(true);
                }
            }
            else {
                layer.setVisible(true);
                if (layerModel !== undefined) {
                    layerModel.setIsOutOfRange(false);
                }
            }
        });

        hintInfo = i18next.t("common:modules.tools.print.invisibleLayer", {scale: "1: " + thousandsSeparator(scale, " ")});
        hintInfo = hintInfo + "<br>" + invisibleLayerNames;

        if (invisibleLayer.length && hintInfo !== state.hintInfo) {
            dispatch("Alerting/addSingleAlert", hintInfo);
            commit("setHintInfo", hintInfo);
        }

        if (!invisibleLayer.length) {
            commit("setHintInfo", "");
        }

        commit("setInvisibleLayer", invisibleLayer);
        dispatch("updateCanvasLayer");
    },

    /**
     * update to draw the print page rectangle onto the canvas when the map changes
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    updateCanvasLayer: function ({state, commit, dispatch}) {
        const visibleLayerList = state.visibleLayerList;
        let canvasLayer = {};

        Radio.trigger("Map", "unregisterListener", state.eventListener);
        canvasLayer = Canvas.getCanvasLayer(visibleLayerList);
        // commit("setCurrentMapScale", state.Map.scale);
        if (Object.keys(canvasLayer).length) {
            commit("setEventListener", canvasLayer.on("postrender", (evt) => {
                dispatch("createPrintMask", evt);
            }));
        }
    },

    /**
     * sets the visible layers and set into variable
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    getVisibleLayer: function ({dispatch}) {
        const visibleLayerList = Radio.request("Map", "getLayers").getArray().filter(layer => {
            return layer.getVisible() === true && layer.get("name") !== "markerPoint";
        });

        dispatch("sortVisibleLayerListByZindex", visibleLayerList);
    },
    /**
     * sorts the visible layer list by zIndex from layer
     * layers with undefined zIndex come to the beginning of array
     * @param {array} visibleLayerList with visble layer
     * @param {Object} param.commit the commit
     * @returns {array} sorted visibleLayerList
     */
    sortVisibleLayerListByZindex: function ({commit}, visibleLayerList) {
        const visibleLayerListWithZIndex = visibleLayerList.filter(layer => {
                return layer.getZIndex() !== undefined;
            }),
            visibleLayerListWithoutZIndex = differenceJS(visibleLayerList, visibleLayerListWithZIndex);

        visibleLayerListWithoutZIndex.push(sortBy(visibleLayerListWithZIndex, (layer) => layer.getZIndex()));

        commit("setVisibleLayerList", [].concat(...visibleLayerListWithoutZIndex));
    },
    /**
     * draws the print page rectangle onto the canvas
     * @param {Object} param.state the state
     * @param {Object} param.dispatch the dispatch
     * @param {ol.render.Event} evt - postrender
     * @returns {void}
     */
    createPrintMask: function ({dispatch, state}, evt) {
        dispatch("getPrintMapSize");
        dispatch("getPrintMapScales");
        const frameState = evt.frameState,
            context = evt.context,
            drawMaskOpt = {
                "frameState": evt.frameState,
                "context": evt.context
            },
            canvasPrintOptions = {
                "mapSize": frameState.size,
                "resolution": frameState.viewState.resolution,
                "printMapSize": state.layoutMapInfo,
                "scale": "",
                "context": context
            };

        let scale;

        // scale was selected by the user over the view
        // don't think we need this
        if (state.isScaleSelectedManually) {
            scale = state.currentScale;
        }
        else {
            const canvasOptions = {
                "mapSize": frameState.size,
                "resolution": frameState.viewState.resolution,
                "printMapSize": state.layoutMapInfo,
                "scaleList": state.scaleList
            };

            dispatch("getOptimalScale", canvasOptions);
            scale = state.optimalScale;
        }

        canvasPrintOptions.scale = scale;
        dispatch("drawMask", drawMaskOpt);
        dispatch("drawPrintPage", canvasPrintOptions);
        context.fillStyle = "rgba(0, 5, 25, 0.55)";
        context.fill();

        dispatch("setPrintLayers", scale);
    },
    /**
     * gets the optimal print scale for a map
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} canvasOptions the canvas measurements
     * @returns {void}
     */
    getOptimalScale: function ({commit, state}, canvasOptions) {
        const mapWidth = canvasOptions.mapSize[0] * canvasOptions.resolution,
            mapHeight = canvasOptions.mapSize[1] * canvasOptions.resolution,
            scaleWidth = mapWidth * state.INCHES_PER_METER * state.DOTS_PER_INCH / canvasOptions.printMapSize[0],
            scaleHeight = mapHeight * state.INCHES_PER_METER * state.DOTS_PER_INCH / canvasOptions.printMapSize[1],
            scale = Math.min(scaleWidth, scaleHeight);

        let optimalScale = canvasOptions.scaleList[0];

        canvasOptions.scaleList.forEach(function (printMapScale) {
            if (scale > printMapScale) {
                optimalScale = printMapScale;
            }
        });
        commit("setOptimalScale", optimalScale);
    },

    /**
     * draws a mask on the whole map
     * @param {Object} param.state the state
     * @param {Object} drawMaskOpt - context of the postrender event
     * @returns {void}
     */
    drawMask: function ({state}, drawMaskOpt) {
        const mapSize = drawMaskOpt.frameState.size,
            context = drawMaskOpt.context,
            ration = drawMaskOpt.context.canvas.width > mapSize[0] ? DEVICE_PIXEL_RATIO : 1,
            mapWidth = mapSize[0] * ration,
            mapHeight = mapSize[1] * ration;

        context.beginPath();
        // Outside polygon, must be clockwise
        context.moveTo(0, 0);
        context.lineTo(mapWidth, 0);
        context.lineTo(mapWidth, mapHeight);
        context.lineTo(0, mapHeight);
        context.lineTo(0, 0);
        context.closePath();
    },
    /**
     * draws the print page
     * @param {Object} param.state the state
     * @param {Object} canvasPrintOptions - mapsize, resolution, printmapsize and scale
     * @returns {void}
     */
    drawPrintPage: function ({state}, canvasPrintOptions) {
        const ration = canvasPrintOptions.context.canvas.width > canvasPrintOptions.mapSize[0] ? DEVICE_PIXEL_RATIO : 1,
            center = [canvasPrintOptions.mapSize[0] * ration / 2, canvasPrintOptions.mapSize[1] * ration / 2],
            boundWidth = canvasPrintOptions.printMapSize[0] / state.DOTS_PER_INCH / state.INCHES_PER_METER * canvasPrintOptions.scale / canvasPrintOptions.resolution * ration,
            boundHeight = canvasPrintOptions.printMapSize[1] / state.DOTS_PER_INCH / state.INCHES_PER_METER * canvasPrintOptions.scale / canvasPrintOptions.resolution * ration,
            minx = center[0] - (boundWidth / 2),
            miny = center[1] - (boundHeight / 2),
            maxx = center[0] + (boundWidth / 2),
            maxy = center[1] + (boundHeight / 2);

        // Inner polygon,must be counter-clockwise
        canvasPrintOptions.context.moveTo(minx, miny);
        canvasPrintOptions.context.lineTo(minx, maxy);
        canvasPrintOptions.context.lineTo(maxx, maxy);
        canvasPrintOptions.context.lineTo(maxx, miny);
        canvasPrintOptions.context.lineTo(minx, miny);
        canvasPrintOptions.context.closePath();
    },

    /**
     * gets the optimal map resolution for a print scale and a map size
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} resolution - scale, mapSize and printMapSize
     * @returns {void}
     */
    getOptimalResolution: function ({commit, state}, resolution) {
        const dotsPerMeter = state.INCHES_PER_METER * state.DOTS_PER_INCH,
            resolutionX = resolution.printMapSize[0] * resolution.scale / (dotsPerMeter * resolution.mapSize[0]),
            resolutiony = resolution.printMapSize[1] * resolution.scale / (dotsPerMeter * resolution.mapSize[1]);

        commit("setOptimalResolution", Math.max(resolutionX, resolutiony));
    },

    /**
     * sets the size of the map on the report
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    getPrintMapSize: function ({state, commit, dispatch}) {
        dispatch("getAttributeInLayoutByName", "map");
        const layoutMapInfo = state.mapAttribute.clientInfo;

        commit("setLayoutMapInfo", [layoutMapInfo.width, layoutMapInfo.height]);
    },

    /**
     * sets the supported scales of the map in the report
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    getPrintMapScales: function ({state, dispatch, commit}) {
        dispatch("getAttributeInLayoutByName", "map");
        const layoutMapInfo = state.mapAttribute.clientInfo;

        commit("setScaleList", layoutMapInfo.scales.sort((a, b) => a - b));
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

        let spec = SpecModel;

        spec.setAttributes(attr);

        if (state.isMetaDataAvailable) {
            spec.setMetadata(true);
        }

        if (state.isScaleAvailable) {
            spec.buildScale(state.currentScale);
        }
        spec.buildLayers(visibleLayerList);

        if (state.isGfiAvailable) {
            spec.buildGfi(state.isGfiSelected, Radio.request("GFI", "getGfiForPrint"));
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

        SpecModel.fetchedMetaData();
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
            console.log("Error: " + response.error);
        }
        else if (response.done) {
            commit("setProgressWidth", "width: 100%");
            const subUrl = response.downloadURL.replace("/mapfish_print_internet/print/report/", ""),
                fileSpecs = {
                    "fileUrl": state.mapfishServiceUrl + state.printAppId + "/report/" + subUrl,
                    "filename": state.filename
                };

            dispatch("downloadFile", fileSpecs);
        }
        else {
            commit("setProgressWidth", "width: 80%");
            // The report is not ready yet. Check again in 1s.
            setTimeout(function () {
                const subUrl = response.downloadURL.replace("/mapfish_print_internet/print/report/", ""),
                    url = state.mapfishServiceUrl + state.printAppId + "/status/" + subUrl + ".json",
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
