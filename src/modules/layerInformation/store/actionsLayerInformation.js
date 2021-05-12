import {getRecordById} from "../../../api/csw/getRecordById";
import getProxyUrl from "../../../utils/getProxyUrl";

const actions = {

    /**
     * This will check the Layer Information
     * @param {Object} param.commit the commit
     * @param {Object} layerInformation the layerInformation that we get from the module
     * @returns {void}
     */
    layerInfo: function ({commit}, layerInformation) {
        commit("setLayerInfo", layerInformation);
        Radio.trigger("LayerInformation", "unhighlightLayerInformationIcon");
    },

    additionalLayer_1: function ({commit}, additionalLayer) {
        commit("setAdditionalLayer_1", additionalLayer);
    },
    additionalLayer_2: function ({commit}, additionalLayer) {
        commit("setAdditionalLayer_2", additionalLayer);
    },
    additionalLayer_3: function ({commit}, additionalLayer) {
        commit("setAdditionalLayer_3", additionalLayer);
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
    changeLayerInfo: async function ({dispatch, state}, chosenElementTitle) {
        let metaId,
            cswUrl;

        if (state.additionalLayer_1.layerName === chosenElementTitle) {
            metaId = state.additionalLayer_1.metaID;
            cswUrl = state.additionalLayer_1.cswUrl;
        }
        else if (state.additionalLayer_2.layerName === chosenElementTitle) {
            metaId = state.additionalLayer_2.metaID;
            cswUrl = state.additionalLayer_2.cswUrl;
        }
        else if (state.additionalLayer_3.layerName === chosenElementTitle) {
            metaId = state.additionalLayer_3.metaID;
            cswUrl = state.additionalLayer_3.cswUrl;
        }

        const metaInfo = {metaId, cswUrl};

        dispatch("getAbstractInfo", metaInfo);

        dispatch("setMetadataURL", metaId);

    },

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
    setMetadataURL: function ({state, commit, rootGetters}, metaId) {
        const metaURLs = [];
        let metaURL = "",
            service = null,
            metaDataCatalogueId = rootGetters.metaDataCatalogueId;

        // todo: set in vue
        if (metaDataCatalogueId === "") {
            metaDataCatalogueId = state.metaDataCatalogueId;
        }

        service = Radio.request("RestReader", "getServiceById", metaDataCatalogueId);
        if (service === undefined) {
            console.warn("Rest Service mit der ID " + metaDataCatalogueId + " ist rest-services.json nicht konfiguriert!");
        }
        else if (typeof state.layerInfo.showDocUrl !== "undefined" && state.layerInfo.showDocUrl !== null) {
            metaURL = state.layerInfo.showDocUrl + metaId;
        }
        else {
            metaURL = Radio.request("RestReader", "getServiceById", metaDataCatalogueId).get("url") + metaId;
        }

        if (metaId !== null && metaId !== "" && metaURLs.indexOf(metaURL) === -1) {
            metaURLs.push(metaURL);
        }
        commit("setMetaURLs", metaURLs);
    }

};

export default actions;
