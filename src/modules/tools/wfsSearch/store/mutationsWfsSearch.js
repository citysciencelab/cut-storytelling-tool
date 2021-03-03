import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsSearch";

const mutations = {
    ...generateSimpleMutations(initialState),
    addRemoteOptions: (state, val) => {
        if (state.remoteOptions.includes(val)) {
            console.warn(`WfsSearch: The value ${val} is added multiple times to the formular. This entry will be skipped.`);
        }
        else {
            state.remoteOptions.push(val);
        }
    }
};

export default mutations;
