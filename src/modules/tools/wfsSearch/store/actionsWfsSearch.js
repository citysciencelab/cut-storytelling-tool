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
        dispatch("resetModule", false);

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
            dispatch("resetModule", true);
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.wfsSearch.wrongConfig", {name: this.name}), {root: true});
        }
    },
    resetModule ({commit}, closedTool) {
        commit("setAddedOptions", []);
        commit("setRequiredValues", null);
        commit("setSelectedOptions", {});
        commit("setService", null);

        if (closedTool) {
            commit("setCurrentInstance", 0);
            commit("setParsedSource", null);
            commit("setActive", false);
        }
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

            /*
            TODO
            Creation of the result elements for the list:
            - Iterate over all the features
            - For each feature
            -- Put the 'values_' parameter in a new object
            -- Remove the parameter that is described by 'geometryName_' from the object --> RLP: geometryName_: "the_geom" -> remove 'the_geom' from the object
            -- Idea: Don't remove it, just don't display it in the list
            - Return the value array in the list
            - Make it possible that when clicking on an element of the list, it is zoomed towards the geometry
             */
            console.log("Ladies and Gentlemen, we got 'em!", features);
            // TODO: Add the features to a layer? Or show them in general for the time until the tool is closed or is reset.
        });
    }
};

export default actions;
