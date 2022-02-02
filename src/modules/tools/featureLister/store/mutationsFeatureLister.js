import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import stateFeatureLister from "./stateFeatureLister";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(stateFeatureLister)
};

export default mutations;
