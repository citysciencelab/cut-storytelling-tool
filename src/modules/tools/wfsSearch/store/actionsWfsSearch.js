import axios from "axios";
import handleAxiosResponse from "../../../../utils/handleAxiosResponse";

const actions = {
    prepareModule ({state, commit, dispatch}) {
        // TODO: The layer currently can only be requested if it is configured in the config.json
        const service = Radio.request("ModelList", "getModelByAttributes", {id: state.requestConfig.layerId});

        if (service) {
            const featureNS = service.get("featureNS"),
                srsName = Radio.request("MapView", "getProjection").code_;

            addIdsToLiterals(state.literals);
            commit("setService", {
                srsName,
                featureNS,
                featurePrefix: featureNS,
                featureTypes: [service.get("featureType")],
                url: service.get("url")
            });

            if (state.selectSource) {
                dispatch("retrieveData");
            }
        }
        else {
            dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.wfsSearch.wrongConfig", {name: this.name}));
        }
    },
    resetModule () {
        // TODO: Do something
    },
    retrieveData ({state, commit}) {
        const {selectSource} = state;

        axios.get(selectSource)
            .then(response => handleAxiosResponse(response, "WfsSearch, retrieveData"))
            .then(data => commit("setParsedSource", data));
    }
};

export default actions;
