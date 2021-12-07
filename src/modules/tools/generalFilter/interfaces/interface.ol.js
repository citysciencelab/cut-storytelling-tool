import isObject from "../../../../utils/isObject.js";
import deepAssign from "../../../../utils/deepAssign.js";
import InterfaceWFS from "./interface.wfs.js";

/**
 * InterfaceOL is the filter interface for OpenLayers
 * @class
 */
export default class InterfaceOL {
    /**
     * @constructor
     * @param {IntervalRegister} intervalRegister the object to register and unregister intervals with
     * @param {Function} handlers.getFeaturesByLayerId a function(layerId) to receive the features from ol with - only used for filter function
     * @param {Function} handlers.isFeatureInMapExtent a function(feature) to check if the feature is in the current map extent
     */
    constructor (intervalRegister, {getFeaturesByLayerId, isFeatureInMapExtent}) {
        this.intervalRegister = intervalRegister;
        this.getFeaturesByLayerId = getFeaturesByLayerId;
        this.isFeatureInMapExtent = isFeatureInMapExtent;
        this.interfaceWFS = new InterfaceWFS();
    }

    /**
     * Returns an object {attrName: Type} with all attributes and their types.
     * @param {Object} service the service to call, identical to filterQuestion.service
     * @param {Function} onsuccess a function({attrName: Type}[])
     * @param {Function} onerror a function(errorMsg)
     * @returns {void}
     */
    getAttrTypes (service, onsuccess, onerror) {
        return this.interfaceWFS.getAttrTypes(service, onsuccess, onerror);
    }

    /**
     * Returns the min and max values of the given service and attrName.
     * @param {Object} service the service to call, identical to filterQuestion.service
     * @param {String} attrName the attribute to receive the min and max value from
     * @param {Function} onsuccess a function({min, max}) with the received values
     * @param {Function} onerror a function(errorMsg)
     * @param {Boolean} [minOnly=false] if only min is of interest
     * @param {Boolean} [maxOnly=false] if only max is of interest
     * @returns {void}
     */
    getMinMax (service, attrName, onsuccess, onerror, minOnly, maxOnly) {
        return this.interfaceWFS.getMinMax(service, attrName, onsuccess, onerror, minOnly, maxOnly);
    }

    /**
     * Returns a list of unique values (unsorted) of the given service and attrName.
     * @param {Object} service the service to call, identical to filterQuestion.service
     * @param {String} attrName the attribute to receive unique values from
     * @param {Function} onsuccess a function([]) with the received unique values as Array of values
     * @param {Function} onerror a function(errorMsg)
     * @returns {void}
     */
    getUniqueValues (service, attrName, onsuccess, onerror) {
        return this.interfaceWFS.getUniqueValues(service, attrName, onsuccess, onerror);
    }

    /**
     * Filters the given filterQuestion and returns the resulting filterAnswer.
     * @param {Object} filterQuestion an object with filterId, service and rules
     * @param {Function} onsuccess a function(filterAnswer)
     * @param {Function} onerror a function(errorMsg)
     * @param {Boolean} [refreshed=false] internal parameter to flag filter by refresh
     * @returns {void}
     */
    filter (filterQuestion, onsuccess, onerror, refreshed = false) {
        if (
            typeof this.intervalRegister?.startPagingInterval !== "function"
            || typeof this.intervalRegister?.stopPagingInterval !== "function"
            || typeof this.intervalRegister?.startAutoRefreshing !== "function"
            || typeof this.intervalRegister?.stopAutoRefreshing !== "function"
        ) {
            if (typeof onerror === "function") {
                onerror(new Error("filter: unvalid intervalRegister"));
            }
            return;
        }
        else if (typeof this.getFeaturesByLayerId !== "function") {
            if (typeof onerror === "function") {
                onerror(new Error("filter: getFeaturesByLayerId must be a function"));
            }
            return;
        }
        else if (typeof this.isFeatureInMapExtent !== "function") {
            if (typeof onerror === "function") {
                onerror(new Error("filter: isFeatureInMapExtent must be a function"));
            }
            return;
        }
        else if (!isObject(filterQuestion)) {
            if (typeof onerror === "function") {
                onerror(new Error("filter: filterQuestion must be an object"));
            }
            return;
        }
        const clonedQuestion = JSON.parse(JSON.stringify(filterQuestion)),
            service = clonedQuestion?.service,
            filterId = clonedQuestion?.filterId,
            snippetId = clonedQuestion?.snippetId,
            commands = clonedQuestion?.commands,
            rules = clonedQuestion?.rules,
            searchInMapExtent = commands?.searchInMapExtent,
            autoRefreshing = commands?.autoRefreshing,
            paging = commands?.paging > 0 ? commands.paging : 1000,
            features = this.getFeaturesByLayerId(service?.layerId),
            len = Array.isArray(features) ? features.length : 0;
        let idx = 0;

        this.intervalRegister.startPagingInterval(filterId, () => {
            const items = [];

            while (idx < len && (idx === 0 || idx % paging > 0)) {
                if (
                    (!searchInMapExtent || this.isFeatureInMapExtent(features[idx]))
                    && this.checkRules(features[idx], rules)
                ) {
                    items.push(features[idx]);
                }
                idx++;
            }
            if (idx >= len) {
                this.intervalRegister.stopPagingInterval(filterId);
            }

            if (typeof onsuccess === "function") {
                onsuccess({
                    service,
                    filterId,
                    snippetId,
                    paging: {
                        page: Math.ceil(idx / paging),
                        total: Math.ceil(len / paging)
                    },
                    items,
                    refreshed
                });
            }
        }, 1);

        if (autoRefreshing > 0) {
            // set autoRefreshing to 0 to avoid cycles
            deepAssign(clonedQuestion, {commands: {autoRefreshing: 0}});

            this.intervalRegister.stopAutoRefreshing(filterId);
            this.intervalRegister.startAutoRefreshing(filterId, () => {
                this.intervalRegister.stopPagingInterval(filterId);
                this.filter(clonedQuestion, this.intervalRegister, onsuccess, onerror, true);
            }, autoRefreshing * 1000);
        }
    }

    /* private */
    /**
     * Checks if the given feature matches with the given rules.
     * @param {ol/Feature} feature the feature to check
     * @param {Object} rules the rules from the filter question
     * @returns {Boolean} true if the feature matches, false if not
     */
    checkRules (feature, rules) {
        if (typeof feature?.get !== "function" || !Array.isArray(rules)) {
            return false;
        }
        const len = rules.length;

        for (let i = 0; i < len; i++) {
            if (!isObject(rules[i])) {
                continue;
            }
            else if (
                !this.checkRule(
                    rules[i],
                    Array.isArray(rules[i]?.attrName) ? feature.get(rules[i].attrName[0]) : feature.get(rules[i].attrName),
                    Array.isArray(rules[i]?.attrName) ? feature.get(rules[i].attrName[1]) : undefined
                )
            ) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks if the given feature values match with the given rule.
     * @param {Object} rule the rule object
     * @param {String} rule.operator the operator to use
     * @param {*} [rule.value] a single value
     * @param {*} [rule.values] an array of values
     * @param {*} featureValue the value of the feature to check
     * @param {*} [featureValue2] the second value to check for ranges with
     * @returns {Boolean} true if the rule matches the given feature values, false if not
     */
    checkRule (rule, featureValue, featureValue2) {
        if (
            !isObject(rule)
            || !Object.prototype.hasOwnProperty.call(rule, "operator")
            || !Object.prototype.hasOwnProperty.call(rule, "value") && !Object.prototype.hasOwnProperty.call(rule, "values")
        ) {
            return false;
        }
        return typeof rule.value !== "undefined" && (
            rule.operator === "BETWEEN" && featureValue <= rule.value && featureValue2 >= rule.value
            || rule.operator === "EQ" && featureValue === rule.value
            || rule.operator === "NE" && featureValue !== rule.value
            || rule.operator === "GT" && featureValue > rule.value
            || rule.operator === "GE" && featureValue >= rule.value
            || rule.operator === "LT" && featureValue < rule.value
            || rule.operator === "LE" && featureValue <= rule.value
            || rule.operator === "IN" && featureValue.includes(rule.value)
            || rule.operator === "STARTSWITH" && featureValue.startsWith(rule.value)
            || rule.operator === "ENDSWITH" && featureValue.endsWith(rule.value)
        )
        || Array.isArray(rule.values) && (
            rule.operator === "INTERSECTS" && featureValue <= rule.values[1] && featureValue2 >= rule.values[0]
            || rule.operator === "BETWEEN" && featureValue >= rule.values[0] && featureValue2 <= rule.values[1]
            || rule.operator === "EQ" && typeof rule.values.find(v => featureValue === v) !== "undefined"
            || rule.operator === "IN" && typeof rule.values.find(v => featureValue.includes(v)) !== "undefined"
            || rule.operator === "STARTSWITH" && typeof rule.values.find(v => featureValue.startsWith(v)) !== "undefined"
            || rule.operator === "ENDSWITH" && typeof rule.values.find(v => featureValue.endsWith(v)) !== "undefined"
        );
    }
}
