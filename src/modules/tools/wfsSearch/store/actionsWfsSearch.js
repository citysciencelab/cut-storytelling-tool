import axios from "axios";
import handleAxiosResponse from "../../../../utils/handleAxiosResponse";
import {setLikeFilterProperties} from "../utils/buildFilter";
import {prepareLiterals} from "../utils/literalFunctions";

// TODO: JSDoc
const actions = {
    instanceChanged ({commit, dispatch}, instanceId) {
        commit("setCurrentInstanceId", instanceId);
        dispatch("prepareModule");
    },
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
    resetModule ({commit, dispatch}, closedTool) {
        commit("setAddedOptions", []);
        commit("setRequiredValues", null);
        commit("setSelectedOptions", {});
        commit("setService", null);
        dispatch("resetResult");

        if (closedTool) {
            commit("setCurrentInstance", 0);
            commit("setParsedSource", null);
            commit("setActive", false);
        }
    },
    retrieveData ({commit, getters}) {
        const {currentInstance: {selectSource}} = getters;

        axios.get(selectSource)
            .then(response => handleAxiosResponse(response, "WfsSearch, retrieveData"))
            .then(data => commit("setParsedSource", data));
    },
    /**
     * Takes the selected coordinates and centers the map to the new position.
     * @param {String[]} feature clicked feature to zoom to
     * @returns {void}
     */
    setCenter ({commit, dispatch}, feature) {
        const coords = feature.getGeometry().flatCoordinates,
            // coordinates come as string and have to be changed to numbers for setCenter from mutations to work.
            transformedCoords = [parseFloat(coords[0]), parseFloat(coords[1])];

        commit("Map/setCenter", transformedCoords, {root: true});
        dispatch("Map/setZoomLevel", 6, {root: true});
        dispatch("MapMarker/placingPointMarker", transformedCoords, {root: true});
    },
    /**
     * Resets the results in the state as well as the inputs/dropdowns in the UI.
     * Also removes the map marker.
     * @returns {void}
     */
    resetResult ({commit, dispatch}) {
        // Beim Reset des Moduls bedenken, dass der Marker auch weg müsste!
        commit("setResults", []);
        dispatch("MapMarker/removePointMarker", null, {root: true});
        commit("setSelectedOptions", {});
    }
};

export default actions;
