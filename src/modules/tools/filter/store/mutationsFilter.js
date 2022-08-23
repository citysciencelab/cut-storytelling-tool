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
        Vue.set(state.rulesOfFilters, payload.filterId, []);
    },
    updateRules (state, payload) {
        Vue.set(state.rulesOfFilters, payload.filterId, payload.rules);
    },
    deleteFilter (state, payload) {
        Vue.set(state.rulesOfFilters, payload.filterId, []);
    },
    updateFilterHits (state, payload) {
        Vue.set(state.filtersHits, payload.filterId, payload.hits);
    },
    setSerializedString (state, payload) {
        state.serializedString = payload.serializiedString;
    },
    setRulesOfFilters (state, payload) {
        state.rulesOfFilters = payload.rulesOfFilters;
    }
};

export default mutations;
