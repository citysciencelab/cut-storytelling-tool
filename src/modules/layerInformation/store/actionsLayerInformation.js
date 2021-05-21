import {getRecordById} from "../../../api/csw/getRecordById";
import getProxyUrl from "../../../utils/getProxyUrl";

const actions = {

    /**
     * This will set the Layer Information
     * @param {Object} param.commit the commit
     * @param {Object} layerInformation the layerInformation that we get from the module
     * @returns {void}
     */
    layerInfo: function ({commit}, layerInformation) {
        commit("setLayerInfo", layerInformation);
        Radio.trigger("LayerInformation", "unhighlightLayerInformationIcon");
    },

    // This sets additional layerInformations in case of group layers
    setAdditionalLayer: function ({commit}, additionalLayer) {
        commit("setAdditionalLayer", additionalLayer);
    },

    activate: function ({commit}, active) {
        commit("setActive", active);
    },

    // get the layer Infos that aren't in the store but saved in the object
    additionalSingleLayerInfo: async function ({dispatch, state}) {
        let metaId;

        if (typeof state.layerInfo.metaID === "string") {
            metaId = state.layerInfo.metaID;
        }
        else {
            metaId = state.layerInfo.metaID[0];
        }
        const cswUrl = state.layerInfo.cswUrl,
            metaInfo = {metaId, cswUrl};

        dispatch("getAbstractInfo", metaInfo);

    },

    // if the user changes the layerInfo Abstract Text via the dropdown for the group layers
    changeLayerInfo: async function ({dispatch, state}, chosenElementTitle) {
        let metaId = "",
            cswUrl = "",
            metaInfo = {},
            layer = "";
        const additionalLayer = state.additionalLayer;

        layer = additionalLayer.find(({layerName}) => layerName === chosenElementTitle);

        metaId = layer.metaID;
        cswUrl = layer.cswUrl;

        metaInfo = {metaId, cswUrl};

        dispatch("getAbstractInfo", metaInfo);

        dispatch("setMetadataURL", metaId);

    },

    // set all the abstract Infos for the layer
    getAbstractInfo: async function ({commit, dispatch, state, rootGetters}, metaInfo) {
        let metadata;

        /**
         * @deprecated in the next major-release!
         * useProxy
         * getProxyUrl()
         */
        if (rootGetters.metadata.useProxy.includes(metaInfo.cswUrl)) {
            metadata = await getRecordById(getProxyUrl(metaInfo.cswUrl), metaInfo.metaId);
        }
        else {
            metadata = await getRecordById(metaInfo.cswUrl, metaInfo.metaId);
        }


        if (typeof metadata === "undefined") {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.layerInformation.errorMessage", {cswObjCswUrl: state.layerInfo.cswUrl}));
            commit("setLayerInfo.title", "");
            commit("setAbstractText", i18next.t("common:modules.layerInformation.noMetadataLoaded"));
            commit("noMetadataLoaded", i18next.t("common:modules.layerInformation.noMetadataLoaded"));
        }
        else {
            commit("setTitle", metadata?.getTitle());
            commit("setAbstractText", metadata?.getAbstract());
            commit("setPeriodicityKey", metadata?.getFrequenzy());
            commit("setDateRevision", metadata?.getRevisionDate());
            commit("setDownloadLinks", metadata?.getDownloadLinks());
            commit("setDatePublication", metadata?.getPublicationDate() || metadata?.getCreationDate());
        }

        // necessary?
        if (state.downloadLinks) {
            const downloadLinks = [];

            state.downloadLinks.forEach(link => {
                downloadLinks.push(link);
            });
            commit("setDownloadLinks", Radio.request("Util", "sortBy", downloadLinks, "linkName"));
        }
        else {
            // nothing?
        }
    },

    /**
     * Checks the array of metaIDs and creates array metaURL with complete URL for template. Does not allow duplicated entries
     * @param {Object} metaId the given metaId for one layer
     * @returns {void}
     */
    setMetadataURL: function ({state, commit}, metaId) {
        const metaURLs = [],
            metaDataCatalogueId = state.metaDataCatalogueId;
        let metaURL = "",
            service = null;

        service = Radio.request("RestReader", "getServiceById", metaDataCatalogueId);
        if (service === undefined) {
            console.warn("Rest Service with the ID " + metaDataCatalogueId + " is not configured in rest-services.json!");
        }
        else if (typeof state.layerInfo.showDocUrl !== "undefined" && state.layerInfo.showDocUrl !== null) {
            metaURL = state.layerInfo.showDocUrl + metaId;
        }
        else {
            metaURL = service.get("url") + metaId;
        }

        if (metaId !== null && metaId !== "" && metaURLs.indexOf(metaURL) === -1) {
            metaURLs.push(metaURL);
        }
        commit("setMetaURLs", metaURLs);
    }

};

export default actions;
