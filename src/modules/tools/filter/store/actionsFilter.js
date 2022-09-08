import {isRule} from "../utils/isRule.js";
import FilterConfigConverter from "../utils/filterConfigConverter.js";

export default {
    /**
     * Converts the current config to a new version if the current config is of an older version.
     * @param {Object} context the context Vue instance
     * @param {Object} payload the payload Vue instance
     * @param {Object} payload.snippetInfos an object with key value pairs as attrName and text content
     * @returns {void}
     */
    convertConfig: (context, {snippetInfos}) => {
        const converter = new FilterConfigConverter(context.state);

        if (!converter.isOldConfig()) {
            return;
        }
        if (converter.checkboxClassicExists()) {
            context.commit("setActive", true);
        }
        context.commit("setSaveTo", converter.getSaveTo());
        context.commit("setLayerSelectorVisible", converter.getLayerSelectorVisible());
        context.commit("setLayers", converter.getLayers(snippetInfos));
    },
    /**
     * Sets the rulesOfFilters array with the given payload.
     * @param {Object} context the context Vue instance
     * @param {Object} payload the payload
     * @param {Oject[]} payload.rulesOfFilters the array of rules for each filter
     * @returns {void}
     */
    setRulesArray: (context, {rulesOfFilters}) => {
        if (!Array.isArray(rulesOfFilters)) {
            return;
        }

        context.commit("setRulesOfFilters", {
            rulesOfFilters
        });
    },
    /**
     * Update rules depending on given rule.
     * @param {Object} context the context Vue instance
     * @param {Object} payload the payload Vue instance
     * @param {Number} payload.filterId the filterId to match
     * @param {Number} payload.snippetId the snippetId to change the rules for
     * @param {Object|Boolean} payload.rule the rule - can be false to reset the rule for given snippetId
     * @returns {void}
     */
    updateRules: (context, {filterId, snippetId, rule}) => {
        if (typeof filterId !== "number" || typeof snippetId !== "number") {
            return;
        }
        let rules;

        if (!Array.isArray(context.state.rulesOfFilters[filterId])) {
            context.commit("addSpotForRule", {
                filterId
            });
            rules = [];
        }
        else {
            try {
                rules = JSON.parse(JSON.stringify(context.state.rulesOfFilters[filterId]));
            }
            catch (error) {
                console.warn("Cannot parse rules in action updateRules", error);
                return;
            }
        }

        rules[snippetId] = rule;
        context.commit("updateRules", {
            filterId,
            rules
        });
    },
    /**
     * Delete all rules (set them to false).
     * @param {Object} context the context Vue instance
     * @param {Object} payload the payload Vue instance
     * @param {Number} payload.filterId the filterId to delete rules for
     * @returns {void}
     */
    deleteAllRules: (context, {filterId}) => {
        if (typeof filterId !== "number") {
            return;
        }
        let rules;

        try {
            rules = JSON.parse(JSON.stringify(context.state.rulesOfFilters[filterId]));
        }
        catch (error) {
            console.warn("Cannot parse rules in action updateRules", error);
            return;
        }

        rules.forEach((rule, idx) => {
            if (isRule(rule) && rule?.fixed) {
                return;
            }
            rules[idx] = false;
        });
        context.commit("updateRules", {
            filterId,
            rules
        });
    },
    /**
     * Updates the hits for given filterId.
     * @param {Object} context the context Vue instance
     * @param {Object} payload the payload Vue instance
     * @param {Number} payload.filterId the filterId to change the hits for
     * @param {Number} payload.hits the hits
     * @returns {void}
     */
    updateFilterHits: (context, {filterId, hits}) => {
        if (typeof filterId !== "number") {
            return;
        }
        context.commit("updateFilterHits", {
            filterId,
            hits
        });
    },
    /**
     * Serialize the state (includes rules, filterHits, selectedAccordions).
     * @param {Object} context the context Vue instance
     * @returns {void}
     */
    serializeState: (context) => {
        const rulesOfFilters = context.state.rulesOfFilters,
            selectedCategories = context.state.selectedCategories,
            selectedAccordions = context.state.selectedAccordions,
            result = {
                rulesOfFilters,
                selectedCategories,
                selectedAccordions
            };
        let resultString = "";

        try {
            resultString = JSON.stringify(result);
        }
        catch (error) {
            resultString = "";
        }
        context.commit("setSerializedString", {
            serializiedString: resultString
        });
    },
    /**
     * Deserialize the state.
     * @param {Object} context the context Vue instance
     * @param {Object} payload The payload
     * @param {Object[]} payload.rulesOfFilters The rules of the filters
     * @param {Object[]} payload.selectedCategories The selected accordions
     * @param {Object[]} payload.selectedAccordions The selected accordions
     * @return {void}
     */
    deserializeState: (context, payload) => {
        const rulesOfFilters = payload?.rulesOfFilters,
            selectedCategories = payload?.selectedCategories,
            selectedAccordions = payload?.selectedAccordions;
        let rulesOfFiltersCopy;

        if (Array.isArray(rulesOfFilters) && Array.isArray(selectedAccordions)) {
            rulesOfFiltersCopy = JSON.parse(JSON.stringify(payload.rulesOfFilters));

            rulesOfFilters.forEach((ruleOfFilter, idx) => {
                if (ruleOfFilter === null) {
                    rulesOfFiltersCopy[idx] = undefined;
                }
            });
            context.dispatch("setRulesArray", {rulesOfFilters: rulesOfFiltersCopy});
            context.commit("setSelectedCategories", selectedCategories);
            context.commit("setSelectedAccordions", selectedAccordions);
            context.commit("setActive", true);
        }
    }
};
