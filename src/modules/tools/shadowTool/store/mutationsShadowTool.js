import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateShadowTool";

const mutations = {
    ...generateSimpleMutations(initialState),
    togglePrivacyPolicyAccepted: state => {
        state.privacyPolicyAccepted = !state.privacyPolicyAccepted;
    }
};

export default mutations;
