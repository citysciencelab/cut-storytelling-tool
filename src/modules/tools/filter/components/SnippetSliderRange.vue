<script>
import isObject from "../../../../utils/isObject";
import {translateKeyWithPlausibilityCheck} from "../../../../utils/translateKeyWithPlausibilityCheck.js";
import {getDefaultOperatorBySnippetType} from "../utils/compileSnippets.js";
import SnippetInfo from "./SnippetInfo.vue";

export default {
    name: "SnippetSliderRange",
    components: {
        SnippetInfo
    },
    props: {
        adjustment: {
            type: [Object, Boolean],
            required: false,
            default: false
        },
        api: {
            type: Object,
            required: false,
            default: null
        },
        attrName: {
            type: [String, Array],
            required: false,
            default: ""
        },
        decimalPlaces: {
            type: Number,
            required: false,
            default: 0
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        filterId: {
            type: Number,
            required: false,
            default: 0
        },
        fixedRules: {
            type: Array,
            required: false,
            default: () => {
                return [];
            }
        },
        info: {
            type: [String, Boolean],
            required: false,
            default: false
        },
        isParent: {
            type: Boolean,
            required: false,
            default: false
        },
        operator: {
            type: String,
            required: false,
            default: undefined
        },
        prechecked: {
            type: Array,
            required: false,
            default: undefined
        },
        snippetId: {
            type: Number,
            required: false,
            default: 0
        },
        title: {
            type: [String, Boolean],
            required: false,
            default: true
        },
        value: {
            type: Array,
            required: false,
            default: undefined
        },
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data () {
        return {
            inputFrom: 0,
            inputUntil: 100,
            sliderFrom: 0,
            sliderUntil: 100,
            currentSliderMin: 0,
            currentSliderMax: 100
        };
    },
    watch: {
        adjustment (adjusting) {
            if (!isObject(adjusting) || this.visible === false || this.isParent) {
                return;
            }

            if (adjusting?.start) {
                this.isAdjusting = true;
                this.adjustMinMax = [];
            }

            if (adjusting?.adjust?.min && (typeof this.adjustMinMax[0] === "undefined" || adjusting.adjust.min < this.adjustMinMax[0])) {
                this.adjustMinMax[0] = adjusting.adjust.min;
            }
            if (adjusting?.adjust?.max && (typeof this.adjustMinMax[1] === "undefined" || adjusting.adjust.max < this.adjustMinMax[1])) {
                this.adjustMinMax[1] = adjusting.adjust.max;
            }

            if (adjusting?.finish) {
                if (!this.isSelfSnippetId(adjusting?.snippetId)) {
                    if (typeof this.adjustMinMax[0] !== "undefined") {
                        this.currentSliderMin = this.adjustMinMax[0];
                    }
                    if (typeof this.adjustMinMax[1] !== "undefined") {
                        this.currentSliderMax = this.adjustMinMax[1];
                    }
                    if (!this.hasRuleSet || this.currentSliderMin > this.sliderFrom) {
                        this.sliderFrom = this.currentSliderMin;
                    }
                    if (!this.hasRuleSet || this.currentSliderMax < this.sliderUntil) {
                        this.sliderUntil = this.currentSliderMax;
                    }
                }

                this.$nextTick(() => {
                    this.isAdjusting = false;
                });
            }
        },
        sliderFrom (val) {
            const value = parseFloat(val);

            if (value > this.sliderUntil) {
                this.sliderUntil = value;
            }
            else if (!this.isInitializing && !this.isAdjusting) {
                this.emitCurrentRule([value, this.sliderUntil]);
            }
            this.setInputFrom(value);
            this.setInputUntil(this.sliderUntil);
        },
        sliderUntil (val) {
            const value = parseFloat(val);

            if (value < this.sliderFrom) {
                this.sliderFrom = value;
            }
            else if (!this.isInitializing && !this.isAdjusting) {
                this.emitCurrentRule([this.sliderFrom, value]);
            }
            this.setInputFrom(this.sliderFrom);
            this.setInputUntil(value);
        },
        inputFrom (val) {
            if (this.currentSource === "slider" || this.currentSource === "init") {
                return;
            }
            const value = parseFloat(val);

            if (isNaN(value)) {
                return;
            }
            else if (value > this.sliderUntil) {
                this.setInputFrom(this.sliderUntil);
                return;
            }
            else if (value < this.sliderFrom) {
                this.setInputFrom(this.sliderFrom);
                return;
            }
            this.setInputFrom(value);
        },
        inputUntil (val) {
            if (this.currentSource === "slider" || this.currentSource === "init") {
                return;
            }
            const value = parseFloat(val);

            if (isNaN(value)) {
                return;
            }
            else if (value < this.sliderFrom) {
                this.setInputFrom(this.sliderFrom);
                return;
            }
            else if (value > this.sliderUntil) {
                this.setInputFrom(this.sliderUntil);
                return;
            }
            this.setInputUntil(value);
        }
    },
    created () {
        this.isInitializing = true;
        this.isAdjusting = false;
        this.hasRuleSet = false;
        this.adjustMinMax = [];
        this.intvEmitCurrentRule = -1;
        this.intvInputReaction = -1;
        this.currentSource = "init";
        this.sliderMouseDown = false;
        this.timeouts = {
            slider: 800,
            input: 1600
        };
        this.operatorWhitelist = [
            "BETWEEN",
            "INTERSECTS"
        ];
    },
    mounted () {
        if (this.isPrecheckedValid()) {
            this.emitCurrentRule(this.prechecked, true);
            this.$emit("setSnippetPrechecked", this.visible);
        }
        else {
            this.$emit("setSnippetPrechecked", false);
        }

        this.getInitialSliderMin(this.getAttrNameFrom(), min => {
            this.getInitialSliderMax(this.getAttrNameUntil(), max => {
                this.initSlider(parseFloat(min), parseFloat(max));
                this.$nextTick(() => {
                    this.isInitializing = false;
                });
            }, error => {
                this.isInitializing = false;
                console.error(error);
            });
        }, error => {
            this.isInitializing = false;
            console.error(error);
        });
    },
    methods: {
        translateKeyWithPlausibilityCheck,

        /**
         * Initializes the slider with the given min/max value.
         * @param {Number} min The min value.
         * @param {Number} max The max value.
         * @returns {void}
         */
        initSlider (min, max) {
            this.currentSliderMin = min;
            this.currentSliderMax = max;
            if (this.isPrecheckedValid()) {
                this.sliderFrom = this.prechecked[0];
                this.sliderUntil = this.prechecked[1];
            }
            else {
                this.sliderFrom = this.currentSliderMin;
                this.sliderUntil = this.currentSliderMax;
            }
        },
        /**
         * Receives the initial min by props or api.
         * @param {String} attrName The attrName to get the value from.
         * @param {Function} onsuccess A function(min) to receive the min value with.
         * @param {Function} onerror A function(error) to call on error.
         * @returns {void}
         */
        getInitialSliderMin (attrName, onsuccess, onerror) {
            if (Array.isArray(this.value) && this.value.length >= 1) {
                if (typeof onsuccess === "function") {
                    onsuccess(this.value[0]);
                }
                return;
            }
            else if (typeof this.api?.getMinMax !== "function") {
                onsuccess(this.currentSliderMin);
                return;
            }
            this.api.getMinMax(
                attrName,
                minMaxObj => {
                    if (!isObject(minMaxObj)) {
                        return;
                    }
                    if (typeof onsuccess === "function") {
                        onsuccess(minMaxObj.min);
                    }
                },
                onerror,
                true,
                false,
                false,
                {rules: this.fixedRules, filterId: this.filterId}
            );
        },
        /**
         * Receives the initial max by props or api.
         * @param {String} attrName The attrName to get the value from.
         * @param {Function} onsuccess A function(max) to receive the max value with.
         * @param {Function} onerror A function(error) to call on error.
         * @returns {void}
         */
        getInitialSliderMax (attrName, onsuccess, onerror) {
            if (Array.isArray(this.value) && this.value.length === 2) {
                if (typeof onsuccess === "function") {
                    onsuccess(this.value[1]);
                }
                return;
            }
            else if (typeof this.api?.getMinMax !== "function") {
                onsuccess(this.currentSliderMax);
                return;
            }
            this.api.getMinMax(
                attrName,
                minMaxObj => {
                    if (!isObject(minMaxObj)) {
                        return;
                    }
                    if (typeof onsuccess === "function") {
                        onsuccess(minMaxObj.max);
                    }
                },
                onerror,
                false,
                true,
                false,
                {rules: this.fixedRules, filterId: this.filterId}
            );
        },
        /**
         * Returns the title to use for this snippet.
         * @returns {String} The title to use.
         */
        getTitle () {
            if (typeof this.title === "string") {
                return this.title;
            }
            else if (this.title === true) {
                return this.getAttrNameFrom();
            }
            return "";
        },
        /**
         * Returns the riskless attrName to use for from.
         * @returns {String} The attrName to use for from.
         */
        getAttrNameFrom () {
            if (Array.isArray(this.attrName) && this.attrName.length === 2) {
                return this.attrName[0];
            }
            return this.attrName;
        },
        /**
         * Returns the riskless attrName to use for until.
         * @returns {String} The attrName to use for until.
         */
        getAttrNameUntil () {
            if (Array.isArray(this.attrName) && this.attrName.length === 2) {
                return this.attrName[1];
            }
            return this.attrName;
        },
        /**
         * Returns the operator, free of risks.
         * @returns {String} The set operator of if not possible the default operator.
         */
        getOperator () {
            if (!this.operatorWhitelist.includes(this.operator)) {
                return getDefaultOperatorBySnippetType("sliderRange");
            }
            return this.operator;
        },
        /**
         * Checks if the prechecked value is valid.
         * @returns {Boolean} true if the prechecked value is valid, false if not.
         */
        isPrecheckedValid () {
            return Array.isArray(this.prechecked) && this.prechecked.length === 2 && !isNaN(parseFloat(this.prechecked[0])) && !isNaN(parseFloat(this.prechecked[1]));
        },
        /**
         * Returns true if the given snippetId equals - or if an array, holds - the own snippetId.
         * @param {Number|Number[]} snippetId The snippetId to check or an array of snippetIds to search through.
         * @returns {Boolean} true if this is the own snippetId or param contains the own snippetId, false if not.
         */
        isSelfSnippetId (snippetId) {
            if (Array.isArray(snippetId)) {
                return snippetId.includes(this.snippetId);
            }
            return snippetId === this.snippetId;
        },
        /**
         * Calculates the position of the left slider button in percent.
         * @info a 5% offset is calculated in to compensate for button width
         * @returns {String} the percentage to use for css left style
         */
        getMeasureLeft () {
            const range = this.currentSliderMax - this.currentSliderMin,
                left = this.sliderFrom - this.currentSliderMin;

            return String((95 / Math.max(1, range) * left).toFixed(1)) + "%";
        },
        /**
         * Calculates the distance between both slider buttons in percent.
         * @info a 5% offset is calculated in to compensate for button width
         * @returns {String} the percentage to use for css width style
         */
        getMeasureWidth () {
            const range = this.currentSliderMax - this.currentSliderMin,
                measure = this.sliderUntil - this.sliderFrom;

            return String((95 / Math.max(1, range) * measure + 5).toFixed(1)) + "%";
        },
        /**
         * Emits the current rule to whoever is listening.
         * @param {*} value the value to put into the rule
         * @param {Boolean} [startup=false] true if the call comes on startup, false if a user actively changed a snippet
         * @returns {void}
         */
        emitCurrentRule (value, startup = false) {
            if (this.currentSource !== "slider") {
                this.changeRule(value, startup);
                return;
            }
            clearInterval(this.intvEmitCurrentRule);
            this.intvEmitCurrentRule = setInterval(() => {
                clearInterval(this.intvEmitCurrentRule);
                if (!this.sliderMouseDown) {
                    this.changeRule(value, startup);
                }
            }, this.timeouts.slider);
        },
        /**
         * Emits the current rule to whoever is listening.
         * @param {*} value the value to put into the rule
         * @param {Boolean} [startup=false] true if the call comes on startup, false if a user actively changed a snippet
         * @returns {void}
         */
        changeRule (value, startup = false) {
            this.hasRuleSet = true;
            this.$emit("changeRule", {
                snippetId: this.snippetId,
                startup,
                fixed: !this.visible,
                attrName: this.attrName,
                operator: this.getOperator(),
                value
            });
        },
        /**
         * Emits the delete rule function to whoever is listening.
         * @returns {void}
         */
        deleteCurrentRule () {
            this.hasRuleSet = false;
            this.$emit("deleteRule", this.snippetId);
        },
        /**
         * Resets the values of this snippet.
         * @param {Function} onsuccess the function to call on success
         * @returns {void}
         */
        resetSnippet (onsuccess) {
            this.isAdjusting = true;
            if (this.visible) {
                this.hasRuleSet = false;
                this.sliderFrom = this.currentSliderMin;
                this.sliderUntil = this.currentSliderMax;
            }
            this.$nextTick(() => {
                if (typeof onsuccess === "function") {
                    onsuccess();
                }
                this.isAdjusting = false;
            });
        },
        /**
         * Returns the steps the slider will make over the number range.
         * @param {Number} decimalPlaces the amount of decimal places
         * @returns {Number} the steps
         */
        getSliderSteps (decimalPlaces) {
            return 1 / Math.pow(10, decimalPlaces);
        },
        /**
         * Sets flag if mouse is down on slider.
         * @returns {void}
         */
        setSliderMouseDown () {
            this.setCurrentSource("slider");
            this.sliderMouseDown = true;
        },
        /**
         * Sets flag if mouse is up after down on slider.
         * @returns {void}
         */
        setSliderMouseUp () {
            this.sliderMouseDown = false;
            if (!this.isInitializing && !this.isAdjusting) {
                this.emitCurrentRule([this.sliderFrom, this.sliderUntil]);
            }
        },
        /**
         * Sets the current source for input data.
         * @param {String} value The type of source 'init', 'slider' or 'input'.
         * @returns {void}
         */
        setCurrentSource (value) {
            this.currentSource = value;
        },
        /**
         * Setter for inputFrom, behavior varies by currentSource.
         * @param {String} value The input value to handle.
         * @returns {void}
         */
        setInputFrom (value) {
            if (this.currentSource === "slider" || this.currentSource === "init") {
                this.inputFrom = value;
                return;
            }
            clearInterval(this.intvInputReaction);
            this.intvInputReaction = setInterval(() => {
                clearInterval(this.intvInputReaction);
                this.sliderFrom = value;
            }, this.timeouts.input);
        },
        /**
         * Setter for inputUntil, behavior varies by currentSource.
         * @param {String} value The input value to handle.
         * @returns {void}
         */
        setInputUntil (value) {
            if (this.currentSource === "slider" || this.currentSource === "init") {
                this.inputUntil = value;
                return;
            }
            clearInterval(this.intvInputReaction);
            this.intvInputReaction = setInterval(() => {
                clearInterval(this.intvInputReaction);
                this.sliderUntil = value;
            }, this.timeouts.input);
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        class="snippetSliderRangeContainer"
    >
        <div
            v-if="title || info"
            class="titleWrapper"
        >
            <div
                v-if="title"
                class="title"
            >
                {{ translateKeyWithPlausibilityCheck(getTitle(), key => $t(key)) }}
            </div>
            <div
                v-if="info"
                class="info"
            >
                <SnippetInfo
                    :info="info"
                    translation-key="snippetSliderRange"
                />
            </div>
        </div>
        <div class="inputWrapper">
            <div class="from">
                <input
                    v-model="inputFrom"
                    type="number"
                    :step="getSliderSteps(decimalPlaces)"
                    :min="currentSliderMin"
                    :max="currentSliderMax"
                    :aria-label="$t('common:modules.tools.filter.ariaLabel.slider.from', {param: getAttrNameFrom()})"
                    :disabled="disabled"
                    @input="setCurrentSource('input')"
                >
            </div>
            <div class="until">
                <input
                    v-model="inputUntil"
                    type="number"
                    :step="getSliderSteps(decimalPlaces)"
                    :min="currentSliderMin"
                    :max="currentSliderMax"
                    :aria-label="$t('common:modules.tools.filter.ariaLabel.slider.to', {param: getAttrNameUntil()})"
                    :disabled="disabled"
                    @input="setCurrentSource('input')"
                >
            </div>
        </div>
        <div class="sliderWrapper">
            <div class="track">
                <div
                    class="measure"
                    :style="{ left: getMeasureLeft(), width: getMeasureWidth() }"
                />
            </div>
            <input
                v-model="sliderFrom"
                type="range"
                :aria-label="$t('common:modules.tools.filter.ariaLabel.slider.from', {param: getAttrNameFrom()})"
                class="from"
                :disabled="disabled"
                :step="getSliderSteps(decimalPlaces)"
                :min="currentSliderMin"
                :max="currentSliderMax"
                @mousedown="setSliderMouseDown"
                @mouseup="setSliderMouseUp"
            >
            <input
                v-model="sliderUntil"
                type="range"
                :aria-label="$t('common:modules.tools.filter.ariaLabel.slider.to', {param: getAttrNameUntil()})"
                class="until"
                :disabled="disabled"
                :step="getSliderSteps(decimalPlaces)"
                :min="currentSliderMin"
                :max="currentSliderMax"
                @mousedown="setSliderMouseDown"
                @mouseup="setSliderMouseUp"
            >
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";

    .category-layer .right {
        right: 30px;
    }

    .snippetSliderRangeContainer {
        height: auto;

        .titleWrapper {
            position: relative;
            height: 16px;
            .title {
                position: absolute;
                left: 0;
                width: 90%;
            }
            .info {
                position: absolute;
                right: 0;
            }
        }
        .inputWrapper {
            position: relative;
            margin-top: 5px;
            height: 24px;
            .from {
                position: absolute;
                left: 0;
                width: 50%;

                label {
                    display: block;
                    height: 18px;
                }
                input {
                    width: 90%;
                }
            }
            .until {
                position: absolute;
                right: 0;
                width: 50%;
                text-align: right;

                label {
                    display: block;
                    height: 18px;
                }
                input {
                    width: 90%;
                    text-align: right;
                }
            }
        }
        .sliderWrapper {
            position: relative;
            margin-top: 5px;
            height: 28px;
            .track {
                width: 100%;
                height: 15px;
                background-color: $light_grey;
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 0;
                border-radius: 10px;
            }
            .measure {
                height: 15px;
                background-color: $light_blue;
                position: absolute;
                top: 0;
                bottom: 0;
                border-radius: 10px;
            }

            input[type="range"] {
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                width: 100%;
                outline: none;
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 1px;
                left: 0;
                background-color: transparent;
                pointer-events: none;
            }
            input[type=range]:focus {
                outline: none;
            }
            input[type="range"]::-webkit-slider-runnable-track {
                -webkit-appearance: none;
                height: 3px;
                width: 100%;
                cursor: pointer;
                border-radius: 1px;
                box-shadow: none;
            }
            input[type="range"]::-moz-range-track {
                -moz-appearance: none;
                height: 3px;
            }
            input[type="range"]::-ms-track {
                appearance: none;
                height: 3px;
            }
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                height: 15px;
                width: 15px;
                background-color: $white;
                cursor: pointer;
                border-radius: 10px;
                pointer-events: auto;
                margin-top: -5px;
                z-index: 2;
            }
            input[type="range"]::-moz-range-thumb {
                -webkit-appearance: none;
                height: 15px;
                width: 15px;
                background-color: $white;
                cursor: pointer;
                border-radius: 50%;
                pointer-events: auto;
            }
            input[type="range"]::-ms-thumb {
                -appearance: none;
                height: 15px;
                width: 15px;
                background-color: $white;
                cursor: pointer;
                border-radius: 50%;
                pointer-events: auto;
            }
            input[type="range"]:active::-ms-thumb {
                background-color: $white;
                border: 1px solid $light_blue;
            }
            input[type="range"]:active::-moz-range-thumb {
                background-color: $white;
                border: 1px solid $light_blue;
            }
            input[type="range"]:active::-webkit-slider-thumb {
                background-color: $white;
                border: 1px solid $light_blue;
            }
            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            span {
                &.min {
                    float: left;
                    position: absolute;
                    left: 0;
                    top: 48px;
                }
                &.max {
                    float: right;
                    position: absolute;
                    right: 0;
                    top: 48px;
                }
            }
            input[type="range"].disabled::-webkit-slider-thumb {
                background-color: $light_grey;
            }
        }
    }
</style>
