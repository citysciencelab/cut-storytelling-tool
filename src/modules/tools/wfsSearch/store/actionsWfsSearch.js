import axios from "axios";
import {WFS} from "ol/format";
import handleAxiosResponse from "../../../../utils/handleAxiosResponse";
import {prepareLiterals} from "../utils/literalFunctions";
import {buildFilter, buildStoredFilter} from "../utils/buildFilter";
import {sendRequest} from "../utils/requests";

// TODO: JSDoc
const actions = {
    instanceChanged ({commit, dispatch}, instanceId) {
        commit("setCurrentInstance", instanceId);
        dispatch("prepareModule");
    },
    prepareModule ({state, commit, dispatch}) {
        const currentInstance = state.instances[state.currentInstance],
            {layerId, restLayerId, storedQueryId} = currentInstance.requestConfig,
            restService = restLayerId
                ? Radio.request("RestReader", "getServiceById", restLayerId)
                : Radio.request("ModelList", "getModelByAttributes", {id: layerId});

        if (restService) {
            const {selectSource} = currentInstance,
                service = {url: restService.get("url")};

            // NOTE: The extra object is sadly needed so that the object is reactive :(
            commit("setRequiredValues", {...prepareLiterals(currentInstance.literals)});

            if (selectSource) {
                dispatch("retrieveData");
            }
            if (!storedQueryId && layerId) {
                service.typeName = restService.get("featureType");
            }
            commit("setService", service);
        }
        else {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.wfsSearch.wrongConfig", {name: this.name}), {root: true});
            // TODO: Module should be reset and closed, if currently open
        }
    },
    resetModule () {
        // TODO: Do something
    },
    retrieveData ({state, commit}) {
        const {currentInstance, instances} = state,
            {selectSource} = instances[currentInstance];

        axios.get(selectSource)
            .then(response => handleAxiosResponse(response, "WfsSearch, retrieveData"))
            .then(data => commit("setParsedSource", data));
    },
    searchFeatures ({state}) {
        // TODO: Move this function somewhere else, if the results of the request are not committed to the store
        const {currentInstance, instances, service} = state,
            {literals, requestConfig: {layerId, maxFeatures, storedQueryId}} = instances[currentInstance],
            fromServicesJson = Boolean(layerId),
            filter = storedQueryId ? buildStoredFilter(literals) : buildFilter(literals);

        sendRequest(service, filter, fromServicesJson, storedQueryId, maxFeatures).then(data => {
            const parser = new WFS({version: storedQueryId ? "2.0.0" : "1.1.0"}),
                features = parser.readFeatures(data);

            console.log("Ladies and Gentlemen, we got 'em!", features);
            // TODO: Add the features to a layer? Or show them in general for the time until the tool is closed or is reset.
        });
    }
};

export default actions;
