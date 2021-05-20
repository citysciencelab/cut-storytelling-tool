import axios from "axios";
import handleAxiosResponse from "../../../../utils/handleAxiosResponse";
import {setLikeFilterProperties} from "../utils/buildFilter";
import {createUserHelp, prepareLiterals} from "../utils/literalFunctions";

const actions = {
    /**
     * Updates the currently set search instance based on the given id and prepares the tool for that instance.
     *
     * @param {Number} instanceIndex The index of the currentInstance.
     * @returns {void}
     */
    instanceChanged ({commit, dispatch}, instanceIndex) {
        commit("setCurrentInstanceIndex", instanceIndex);
        dispatch("prepareModule");
    },
    /**
     * If the WFS is given, the required values are set, information from the external source (dropdowns) is retrieved,
     * like filter values and the service are set.
     *
     * @returns {void}
     */
    prepareModule ({commit, dispatch, getters}) {
        dispatch("resetModule", false);

        const {currentInstance} = getters,
            {requestConfig: {layerId, likeFilter, restLayerId, storedQueryId}} = currentInstance,
            wfs = restLayerId
                ? Radio.request("RestReader", "getServiceById", restLayerId)
                : Radio.request("ModelList", "getModelByAttributes", {id: layerId});

        if (wfs) {
            const {selectSource} = currentInstance,
                service = {url: wfs.get("url")};

            // NOTE: The extra object is sadly needed so that the object is reactive :(
            commit("setRequiredValues", {...prepareLiterals(currentInstance.literals)});
            commit("setUserHelp", currentInstance.userHelp ? currentInstance.userHelp : createUserHelp(currentInstance.literals));

            if (selectSource) {
                dispatch("retrieveData");
            }
            if (likeFilter) {
                setLikeFilterProperties(likeFilter);
            }
            if (!storedQueryId && layerId) {
                service.typeName = wfs.get("featureType");
            }
            commit("setService", service);
        }
        else {
            dispatch("resetModule", true);
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.wfsSearch.wrongConfig", {name: this.name}), {root: true});
        }
    },
    /**
     * Resets state parameters to its initial state.
     * If the tool was closed, the tool is completely reset.
     *
     * @param {Boolean} closeTool Whether the tool was closed or not.
     * @returns {void}
     */
    resetModule ({commit}, closeTool) {
        commit("setAddedOptions", []);
        commit("setRequiredValues", null);
        commit("setSelectedOptions", {});
        commit("setService", null);
        commit("setUserHelp", "");

        if (closeTool) {
            commit("setCurrentInstanceIndex", 0);
            commit("setParsedSource", null);
            commit("setActive", false);
        }
    },
    /**
     * Retrieves information from the external file to the state.
     *
     * @returns {void}
     */
    retrieveData ({commit, getters}) {
        const {currentInstance: {selectSource}} = getters;

        axios.get(selectSource)
            .then(response => handleAxiosResponse(response, "WfsSearch, retrieveData"))
            .then(data => commit("setParsedSource", data));
    }
};

export default actions;
