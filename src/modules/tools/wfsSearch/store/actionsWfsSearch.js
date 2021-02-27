import axios from "axios";
import handleAxiosResponse from "../../../../utils/handleAxiosResponse";

const actions = {
    retrieveData ({state, commit}) {
        const {selectSource} = state;

        axios.get(selectSource)
            .then(response => handleAxiosResponse(response, "WfsSearch, retrieveData"))
            .then(data => commit("setParsedSource", data));
    }
};

export default actions;
