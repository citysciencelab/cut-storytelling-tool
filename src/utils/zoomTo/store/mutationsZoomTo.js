import {generateSimpleMutations} from "../../../app-store/utils/generators";
import initialState from "./stateZoomTo";

const mutations = {
    ...generateSimpleMutations(initialState),
    setConfig (state, payload) {
        state.config = state.config === null ? payload : {...state.config, ...payload};
    }
};

export default mutations;
