import getComponent from "../../../../utils/getComponent";

export default {
    /**
     * Gets the capabilities for a specific print configuration
     * @param {Object} param.dispatch the dispatch
     * @param {Boolean} value - is this tool activated or not
     * @param {Backbone.Model} model - the Backbone Model
     * @returns {void}
     */
    retrieveCapabilites: function ({state, dispatch, commit}) {
        debugger;
        let serviceUrl;
        const model = getComponent(state.id);

        if (state.mapfishServiceId !== undefined) {
            serviceUrl = Radio.request("RestReader", "getServiceById", state.mapfishServiceId).get("url");
            commit("setMapfishServiceUrl", serviceUrl);
            model.sendRequest(serviceUrl + state.printAppId + "/capabilities.json", "GET", dispatch("parseMapfishCapabilities"));
        }
    },
    /**
     * Sets the capabilities from mapfish resonse.
     * @param {Object[]} response - config.yaml from mapfish.
     * @fires Core#RadioRequestMapViewGetOptions
     * @returns {void}
     */
    parseMapfishCapabilities: function ({commit, dispatch}, response) {
        commit("setLayoutList", response.layouts);
        commit("setCurrentLayout", dispatch("chooseCurrentLayout", response.layouts));
        commit("setIsMetaDataAvailable", dispatch("getAttributeInLayoutByName", "metadata") !== undefined);
        commit("setIsGfiAvailable", dispatch("getAttributeInLayoutByName", "gfi") !== undefined);
        commit("setIsLegendAvailable", dispatch("getAttributeInLayoutByName", "legend") !== undefined);
        commit("setIsScaleAvailable", dispatch("getAttributeInLayoutByName", "scale") !== undefined);
        commit("setFormatList", response.formats);
        commit("setCurrentScale", Radio.request("MapView", "getOptions").scale);
        this.togglePostrenderListener(true);
    },
    /**
     * returns a capabilities attribute object of the current layout, corresponding to the given name
     * @param {String} name - name of the attribute to get
     * @returns {Object|undefined} corresponding attribute or null
     */
    getAttributeInLayoutByName: function ({state}, name) {
        return state.currentLayout.attributes.find(function (attribute) {
            return attribute.name === name;
        });
    },
    /**
     * Choose the layout which is configured as currentlayout
     * @param {Object[]} [layouts=[]] - All Layouts
     * @returns {Object} The choosen current layout
     */
    chooseCurrentLayout: function ({state}, layouts) {
        const currentLayout = layouts.filter(layout => layout.name === state.currentLayoutName);

        return currentLayout.length === 1 ? currentLayout[0] : layouts[0];
    },
    /**
     * if the tool is activated and there is a layout,
     * a callback function is registered to the postrender event of the map
     * @param {Backbone.Model} model - this
     * @param {Boolean} value - is this tool activated or not
     * @returns {void}
     */
    togglePostrenderListener: function ({state, dispatch, commit}) {
        const canvasModel = new BuildCanvasModel(),
            foundVectorTileLayers = [],
            visibleLayerList = dispatch("getVisibleLayer");

        /*
         * Since MapFish 3 does not yet support VTL (see https://github.com/mapfish/mapfish-print/issues/659),
         * they are filtered in the following code and an alert is shown to the user informing him about which
         * layers will not be printed.
         */
        if (foundVectorTileLayers.length && state.active) {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.print.vtlWarning"), {root: true});
        }

        commit("setVisibleLayer", visibleLayerList);

        if (state.active && state.layoutList.length !== 0 && visibleLayerList.length >= 1) {
            const canvasLayer = canvasModel.getCanvasLayer(visibleLayerList);

            // TODO
            this.setEventListener(canvasLayer.on("postrender", this.createPrintMask.bind(this)));
        }
        else {
            Radio.trigger("Map", "unregisterListener", state.eventListener);
            this.setEventListener(undefined);
            if (state.invisibleLayer.length) {
                this.setOriginalPrintLayer();
                this.setHintInfo("");
            }
        }
        Radio.trigger("Map", "render");
    },
    /**
     * returns the visible layers and set into variable
     * @returns {Number[]} scale list
     */
    getVisibleLayer: function ({dispatch}) {
        let visibleLayerList = Radio.request("Map", "getLayers").getArray().filter(layer => {
            return layer.getVisible() === true && layer.get("name") !== "markerPoint";
        });

        visibleLayerList = dispatch("sortVisibleLayerListByZindex", visibleLayerList);

        return visibleLayerList;
    },
    /**
     * sorts the visible layer list by zIndex from layer
     * layers with undefined zIndex come to the beginning of array
     * @param {array} visibleLayerList with visble layer
     * @returns {array} sorted visibleLayerList
     */
    sortVisibleLayerListByZindex: function (visibleLayerList) {
        const visibleLayerListWithZIndex = visibleLayerList.filter(layer => {
                return layer.getZIndex() !== undefined;
            }),
            visibleLayerListWithoutZIndex = Radio.request("Util", "differenceJs", visibleLayerList, visibleLayerListWithZIndex);

        visibleLayerListWithoutZIndex.push(Radio.request("Util", "sortBy", visibleLayerListWithZIndex, (layer) => layer.getZIndex()));

        return [].concat(...visibleLayerListWithoutZIndex);
    }
};
