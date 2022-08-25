import {generateSimpleMutations} from "../../../../../app-store/utils/generators";
import directionsState from "./stateDirections";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(directionsState)
};

export default mutations;
