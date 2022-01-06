<script>
import store from "../../../../app-store";
import InterfaceOL from "../interfaces/interface.ol.js";
import IntervalRegister from "../utils/intervalRegister.js";
import isObject from "../../../../utils/isObject";

export default {
    name: "SnippetSliderRange",
    props: {
        attrName: {
            type: String,
            required: false,
            default: ""
        },
        decimalStep: {
            type: Number,
            required: false,
            default: 1
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        info: {
            type: String,
            required: false,
            default: ""
        },
        label: {
            type: String,
            required: false,
            default: ""
        },
        minValue: {
            type: Number,
            required: false,
            default: undefined
        },
        maxValue: {
            type: Number,
            required: false,
            default: undefined
        },
        operator: {
            type: String,
            required: false,
            default: "BETWEEN"
        },
        prechecked: {
            type: Array,
            required: false,
            default: () => {
                return [0, 0];
            }
        },
        snippetId: {
            type: Number,
            required: false,
            default: 0
        },
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data () {
        return {
            disable: true,
            interface: {},
            invalid: false,
            minimumValue: this.minValue,
            maximumValue: this.maxValue,
            minOnly: false,
            maxOnly: false,
            service: {
                type: "WFS",
                url: "https://geodienste.hamburg.de/HH_WFS_Regionaler_Bildungsatlas_Schul_Bezirk",
                typename: "regionaler_bildungsatlas_schullandschaft_bezirke"
            },
            step: this.decimalStep,
            showInfo: false,
            minVal: this.prechecked[0],
            maxVal: this.prechecked[1]
        };
    },
    computed: {
        infoText: function () {
            return this.info ? this.info : this.$t("modules.tools.filterGeneral.sliderRangeInfo");
        }
    },
    watch: {
        minVal (newVal) {
            if (newVal) {
                this.minVal = this.getValueInRange(newVal, true);
                this.regulateMinMax("min");
                this.emitCurrentRule([this.minVal, this.maxVal]);
                if (newVal === this.minVal) {
                    this.$refs.inputMinNumber.value = this.minVal;
                }
            }
        },
        maxVal (newVal) {
            if (newVal) {
                this.maxVal = this.getValueInRange(newVal, true);
                this.regulateMinMax("max");
                this.emitCurrentRule([this.minVal, this.maxVal]);
                if (newVal === this.maxVal) {
                    this.$refs.inputMaxNumber.value = this.maxVal;
                }
            }
        },
        disabled (value) {
            this.disable = typeof value === "boolean" ? value : true;
        }
    },
    mounted () {
        this.$refs.inputMinNumber.value = this.minVal;
        this.$refs.inputMaxNumber.value = this.maxVal;

        this.$nextTick(() => {
            this.emitCurrentRule([this.minVal, this.maxVal]);
        });
    },
    created () {
        this.minVal = this.getValueInRange(this.minVal, false);
        this.maxVal = this.getValueInRange(this.maxVal, false);
        this.step = this.getStep(this.step);
        this.setInvalid(this.minimumValue, this.maximumValue);
        this.setMinOnly(this.minimumValue, this.maximumValue);
        this.setMaxOnly(this.minimumValue, this.maximumValue);
        this.setMinMaxValue(this.minimumValue, this.maximumValue);
        if (!this.invalid) {
            this.disable = false;
        }
    },
    methods: {
        /**
         * Getting valid step
         * @param {Number} value - the step for slider
         * @returns {Number} step the step for slider
         */
        getStep (value) {
            if (!isNaN(value) && Math.sign(value) > 0) {
                return value;
            }

            console.warn("Please check the parameter decimalStep in configuration, it should be a positive number");
            return 1;
        },
        /**
         * Checking if the input field is valid and reset to valid value
         * @param {Event} evt - input event
         * @returns {void}
         */
        checkInput (evt) {
            if (evt?.target?.value === "") {
                this.getAlertRangeText();
                if (evt?.target?.id === "slider-input-max") {
                    this.$refs.inputMaxNumber.value = this.maxVal;
                }
                if (evt?.target?.id === "slider-input-min") {
                    this.$refs.inputMinNumber.value = this.minVal;
                }
            }
            else {
                const value = this.getValueInRange(evt?.target?.value, true);

                if (evt?.target?.value !== value.toString()) {
                    if (evt?.target?.id === "slider-input-max") {
                        this.$refs.inputMaxNumber.value = this.maxVal;
                    }
                    if (evt?.target?.id === "slider-input-min") {
                        this.$refs.inputMinNumber.value = this.minVal;
                    }
                }
                else {
                    this.maxVal = this.$refs.inputMaxNumber.value;
                    this.minVal = this.$refs.inputMinNumber.value;
                    this.$refs.inputMaxNumber.blur();
                    this.$refs.inputMinNumber.blur();
                }
            }
        },
        /**
         * Checking if the input number is in range
         * @param {Number} data the input number
         * @param {Boolean} flag to decide if show the alerting box
         * @returns {Number} the original input number or converted number
         */
        getValueInRange (data, flag) {
            let value = parseFloat(data);

            if (this.invalid) {
                return false;
            }

            if (!Number.isInteger(this.step) && typeof data === "string" && data.slice(-1) === "." || data === "-") {
                value = data;
            }

            if (value < this.minimumValue) {
                if (flag) {
                    this.getAlertRangeText(value);
                }
                value = this.minimumValue;
            }
            else if (value > this.maximumValue) {
                if (flag) {
                    this.getAlertRangeText(value);
                }
                value = this.maximumValue;
            }

            return value;
        },
        /**
         * Regulates the minimum and maximum,
         * when min is greater than max or max is less than min
         * @param {String} type the type of variable to be treated
         * @returns {void}
         */
        regulateMinMax (type) {
            if (type === "min") {
                if (this.minVal > this.maxVal) {
                    this.maxVal = this.minVal;
                }
            }
            if (type === "max") {
                if (this.maxVal < this.minVal) {
                    this.minVal = this.maxVal;
                }
            }
        },
        /**
         * Getting slider range error text in alerting box
         * @param {String} value the input value from input field
         * @returns {void}
         */
        getAlertRangeText (value) {
            store.dispatch("Alerting/addSingleAlert", i18next.t("common:snippets.slider.valueOutOfRangeErrorMessage", {
                inputValue: value,
                minValueSlider: this.minimumValue,
                maxValueSlider: this.maximumValue
            }));
        },
        /**
         * Setting the parameter minOnly
         * @param {Number|undefined} minimumValue the minimum value
         * @param {Number|undefined} maximumValue the maximum value
         * @returns {void}
         */
        setMinOnly (minimumValue, maximumValue) {
            if (minimumValue === undefined && maximumValue !== undefined) {
                this.minOnly = true;
            }
        },

        /**
         * Setting the parameter maxOnly
         * @param {Number|undefined} minimumValue the minimum value
         * @param {Number|undefined} maximumValue the maximum value
         * @returns {void}
         */
        setMaxOnly (minimumValue, maximumValue) {
            if (minimumValue !== undefined && maximumValue === undefined) {
                this.maxOnly = true;
            }
        },

        /**
         * Setting the parameter minimumValue and maximumValue
         * @param {Number|undefined} minimumValue the minimum value
         * @param {Number|undefined} maximumValue the maximum value
         * @returns {void}
         */
        setMinMaxValue (minimumValue, maximumValue) {
            if (minimumValue === undefined || maximumValue === undefined) {
                this.interface = new InterfaceOL(new IntervalRegister(), {
                    getFeaturesByLayerId: false,
                    isFeatureInMapExtent: false
                });

                this.interface.getMinMax(this.service, this.attrName, minMaxObj => {
                    this.minimumValue = minimumValue === undefined && isObject(minMaxObj) && Object.prototype.hasOwnProperty.call(minMaxObj, "min") ? minMaxObj.min : minimumValue;
                    this.maximumValue = maximumValue === undefined && isObject(minMaxObj) && Object.prototype.hasOwnProperty.call(minMaxObj, "max") ? minMaxObj.max : maximumValue;
                    this.setInvalid(this.minimumValue, this.maximumValue);
                    this.minVal = this.getValueInRange(this.minVal, false);
                    this.maxVal = this.getValueInRange(this.maxVal, false);
                }, onerror => {
                    console.warn(onerror);
                }, this.minOnly, this.maxOnly);
            }
        },
        /**
         * Setting the parameter invalid
         * @param {Number|undefined} minimumValue the minimum value
         * @param {Number|undefined} maximumValue the maximum value
         * @returns {void}
         */
        setInvalid (minimumValue, maximumValue) {
            if (minimumValue === undefined || maximumValue === undefined) {
                return;
            }
            else if (parseInt(maximumValue, 10) < parseInt(minimumValue, 10)) {
                console.warn("Please check your configuration or dienst manager, the minimum value can not be bigger than maximum value");
                this.invalid = true;
                return;
            }

            this.invalid = false;
        },
        /**
         * Emits the current rule to whoever is listening.
         * @param {*} value the value to put into the rule
         * @returns {void}
         */
        emitCurrentRule (value) {
            let result = value;

            if (Array.isArray(value)) {
                result = [];
                value.forEach(v => {
                    if (v) {
                        result.push(v);
                    }
                });
            }
            this.$emit("ruleChanged", {
                snippetId: this.snippetId,
                rule: {
                    attrName: this.attrName,
                    operator: this.operator,
                    result
                }
            });
        },
        toggleInfo () {
            this.showInfo = !this.showInfo;
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        v-if="!invalid"
    >
        <div class="snippetSliderRangeContainer">
            <div class="left">
                <label for="slider-input-min">{{ label }}</label>
            </div>
            <div class="right">
                <div class="info-icon">
                    <span
                        :class="['glyphicon glyphicon-info-sign', showInfo ? 'opened' : '']"
                        @click="toggleInfo()"
                        @keydown.enter="toggleInfo()"
                    >&nbsp;</span>
                </div>
            </div>
        </div>
        <div class="sliderRangeWrapper">
            <div class="sliderInputContainer">
                <label for="slider-input-max" />
                <input
                    id="slider-input-max"
                    ref="inputMaxNumber"
                    class="slider-input-max"
                    type="number"
                    :disabled="disable"
                    :step="step"
                    :min="minimumValue"
                    :max="maximumValue"
                    :placeholder="maxVal"
                    @blur="checkInput"
                    @keyup.enter="checkInput"
                >
                <label for="slider-input-min" />
                <input
                    id="slider-input-min"
                    ref="inputMinNumber"
                    class="slider-input-min"
                    type="number"
                    :disabled="disable"
                    :step="step"
                    :min="minimumValue"
                    :max="maximumValue"
                    :placeholder="minVal"
                    @blur="checkInput"
                    @keyup.enter="checkInput"
                >
            </div>
            <div class="sliderRangeContainer">
                <div class="slider-range-track">
                    &nbsp;
                </div>
                <label for="slider1" />
                <input
                    id="slider1"
                    v-model="minVal"
                    class="slider-range-min"
                    type="range"
                    :class="disable ? 'disabled':''"
                    :disabled="disable"
                    :step="step"
                    :min="minimumValue"
                    :max="maximumValue"
                >
                <label for="slider2" />
                <input
                    id="slider2"
                    v-model="maxVal"
                    class="slider-range-max"
                    type="range"
                    :class="disable ? 'disabled':''"
                    :disabled="disable"
                    :step="step"
                    :min="minimumValue"
                    :max="maximumValue"
                >
                <div class="values">
                    <span class="max">{{ maximumValue }}</span>
                    <span class="min">{{ minimumValue }}</span>
                </div>
            </div>
        </div>
        <div
            v-show="showInfo"
            class="bottom"
        >
            <div class="info-text">
                <span>{{ infoText }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    .snippetSliderRangeContainer {
        padding: 5px;
        margin-bottom: 10px;
        height: 20px;
    }
    .info-icon {
        float: right;
        font-size: 16px;
        color: #ddd;
    }
    .info-icon .opened {
        color: #000;
    }
    .info-icon:hover {
        cursor: pointer;
        color: #a5a09e;
    }
    .info-text {
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 10px;
        padding: 15px 10px;
        margin-top: 15px;
    }
    .bottom {
        clear: left;
        width: 100%;
        padding: 0 5px;
    }
    .snippetSliderRangeContainer .left {
        float: left;
        width: 90%;
    }
    .snippetSliderRangeContainer .right {
        position: absolute;
        right: 10px;
    }
    .sliderRangeWrapper {
        position: relative;
        width: 100%;
        background-color: #fff;
        padding: 0 5px;
        margin: auto;
        position: relative;
        height: 80px;
    }
    .sliderRangeContainer {
        position: relative;
        width: 100%;
        height: 60px;
    }
    .sliderInputContainer {
        position: relative;
        width: 100%;
        height: 16px;
    }
    .values {
        position: relative;
        margin: auto;
        font-size: 12px;
        color: #000;
    }
    input[type="range"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        apearance: none;
        width: 100%;
        outline: none;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        background-color: transparent;
        pointer-events: none;
    }
    input[type=number]:focus,
    input[type=range]:focus {
        outline: none;
    }
    .slider-range-track {
        width: 100%;
        height: 15px;
        background-color: #ddd;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        border-radius: 0px;
    }
    input[type="range"]::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        height: 3px;
        width: 100%;
        cursor: pointer;
        animate: 0.2s;
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
        background-color: #fff;
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
        background-color: #fff;
        cursor: pointer;
        border-radius: 50%;
        pointer-events: auto;
    }
    input[type="range"]::-ms-thumb {
        -appearance: none;
        height: 15px;
        width: 15px;
        background-color: #fff;
        cursor: pointer;
        border-radius: 50%;
        pointer-events: auto;
    }
    input[type="range"]:active::-ms-thumb {
        background-color: #fff;
        border: 1px solid #3177b1;
    }
    input[type="range"]:active::-moz-range-thumb {
        background-color: #fff;
        border: 1px solid #3177b1;
    }
    input[type="range"]:active::-webkit-slider-thumb {
        background-color: #fff;
        border: 1px solid #3177b1;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        text-align: center;
        font-size: 12px;
        -moz-appearance: textfield;
        outline: none;
        width: 60px;
        float: right;
        margin-bottom: 10px;
        padding-top: 5px;
        margin-left: 2px;
    }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    span {
        &.min {
            float: left;
            position: absolute;
            left: 0;
            top: 45px;
        }
        &.max {
            float: right;
            position: absolute;
            right: 0;
            top: 45px;
        }
    }
    input[type="range"].disabled::-webkit-slider-thumb {
        background-color: #b9b5b5;
    }
</style>
