import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import coordState from "./stateLayerSlider";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(coordState),

    /**
     * Setter of the windows interval.
     * @param {Object} state Context state object.
     * @param {Function} func Function to be executed in this.
     * @returns {void}
     */
    setWindowsInterval (state, func) {
        state.windowsInterval = func === null ? null : setInterval(func, state.timeInterval);
    }
};

export default mutations;
