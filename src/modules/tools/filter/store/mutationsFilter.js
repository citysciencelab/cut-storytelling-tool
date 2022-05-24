import Vue from "vue";
import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import filterState from "./stateFilter";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(filterState),
    addSpotForRule (state, payload) {
        Vue.set(state.filters, payload.filterId, []);
    },
    updateRules (state, payload) {
        Vue.set(state.filters, payload.filterId, payload.rules);
    },
    deleteFilter (state, payload) {
        Vue.set(state.filters, payload.filterId, []);
    },
    updateFilterHits (state, payload) {
        Vue.set(state.filtersHits, payload.filterId, payload.hits);
    }
};

export default mutations;
