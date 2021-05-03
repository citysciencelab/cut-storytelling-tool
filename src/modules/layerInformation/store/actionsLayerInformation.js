import {getMetadata, getRecordById} from "../../../api/csw/getRecordById";
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
    },

    setActive: function ({commit}, active) {
        commit("setActive", active);
    },

    // get the layer Infos that aren't in the store but saved in the object
    additionalLayerInfo: async function ({commit, dispatch, state, rootGetters}) {
        debugger;
        let metadata;

        /**
         * @deprecated in the next major-release!
         * useProxy
         * getProxyUrl()
         */
        if (rootGetters["metadata"].useProxy.includes(state.layerInfo.cswUrl)) {
            metadata = await getRecordById(getProxyUrl(state.layerInfo.cswUrl), state.layerInfo.metaID);
        }
        else {
            metadata = await getRecordById(state.layerInfo.cswUrl, state.layerInfo.metaID);
        }


        if (typeof metadata === "undefined") {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.layerInformation.errorMessage", {cswObjCswUrl: state.layerInfo.cswUrl}));
            commit("setLayerInfo.title", "");
            commit("setAbstractText", i18next.t("common:modules.layerInformation.noMetadataLoaded"));
            commit("noMetadataLoaded", i18next.t("common:modules.layerInformation.noMetadataLoaded"));
        }
        else {
            debugger;
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
     * @returns {void}
     */
    setMetadataURL: function ({state, commit, rootGetters}) {
        debugger;
        const metaURLs = [];
        let metaURL = "",
            service,
            metaDataCatalogueId = rootGetters.metaDataCatalogueId;

        // todo: set in vue
        if (metaDataCatalogueId === "") {
            metaDataCatalogueId = state.metaDataCatalogueId;
        }

        state.layerInfo.metaIdArray.forEach(metaID => {
            service = Radio.request("RestReader", "getServiceById", metaDataCatalogueId);
            if (service === undefined) {
                console.warn("Rest Service mit der ID " + metaDataCatalogueId + " ist rest-services.json nicht konfiguriert!");
            }
            else if (typeof state.layerInfo.showDocUrl !== "undefined" && state.layerInfo.showDocUrl !== null) {
                metaURL = state.layerInfo.showDocUrl + metaID;
            }
            else {
                metaURL = Radio.request("RestReader", "getServiceById", metaDataCatalogueId).get("url") + metaID;
            }

            if (metaID !== null && metaID !== "" && metaURLs.indexOf(metaURL) === -1) {
                metaURLs.push(metaURL);
            }
        });
        commit("setMetaURLs", metaURLs);
    }

};

export default actions;
