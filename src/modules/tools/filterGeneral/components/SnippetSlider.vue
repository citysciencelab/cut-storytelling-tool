<script>
import store from "../../../../app-store";
import InterfaceOL from "../interfaces/interface.ol.js";
import IntervalRegister from "../utils/intervalRegister.js";
import isObject from "../../../../utils/isObject";

export default {
    name: "SnippetSlider",
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
            default: "EQ"
        },
        prechecked: {
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
                url: "https://geodienste.hamburg.de/HH_WFS_Regionaler_Bildungsatlas_Bev_Stadtteil",
                typename: "regionaler_bildungsatlas_bevoelkerung_stadtteile"
            },
            showInfo: false,
            step: this.decimalStep,
            value: this.prechecked
        };
    },
    computed: {
        infoText: function () {
            return this.info ? this.info : this.$t("modules.tools.filterGeneral.sliderInfo");
        }
    },
    watch: {
        value (newVal) {
            if (newVal) {
                this.value = this.getValueInRange(newVal, true);
                if (newVal === this.value) {
                    this.$refs.inputNumber.value = this.value;
                }
            }
        },
        disabled (value) {
            this.disable = typeof value === "boolean" ? value : true;
        }
    },
    created () {
        this.value = this.getValueInRange(this.value, false);
        this.step = this.getStep(this.step);
        this.setInvalid(this.minimumValue, this.maximumValue);
        this.setMinOnly(this.minimumValue, this.maximumValue);
        this.setMaxOnly(this.minimumValue, this.maximumValue);
        this.setMinMaxValue(this.minimumValue, this.maximumValue);
        this.disable = false;
    },
    mounted () {
        this.$refs.inputNumber.value = this.value;
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
                this.$refs.inputNumber.value = this.value;
            }
            else {
                const value = this.getValueInRange(evt?.target?.value, true);

                if (evt?.target?.value !== value.toString()) {
                    this.$refs.inputNumber.value = this.value;
                }
                else {
                    this.value = this.$refs.inputNumber.value;
                    this.$refs.inputNumber.blur();
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
                    this.value = this.getValueInRange(this.value, false);
                    this.disable = false;
                }, onerror => {
                    this.disable = false;
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
        class="snippetSliderContainer"
    >
        <div class="right">
            <div class="info-icon">
                <span
                    :class="['glyphicon glyphicon-info-sign', showInfo ? 'opened' : '']"
                    @click="toggleInfo()"
                    @keydown.enter="toggleInfo()"
                >&nbsp;</span>
            </div>
        </div>
        <label
            class="left"
            for="input-single"
        >{{ label }}</label>
        <input
            ref="inputNumber"
            class="input-single"
            type="number"
            :min="minimumValue"
            :max="maximumValue"
            :name="label"
            :disabled="disable"
            :placeholder="value"
            @blur="checkInput"
            @keyup.enter="checkInput"
        >
        <div class="slider-input-container">
            <input
                id="input-single"
                v-model="value"
                class="slider-single"
                type="range"
                :class="disable ? 'disabled':''"
                :step="step"
                :disabled="disable"
                :min="minimumValue"
                :max="maximumValue"
            >
        </div>
        <span class="min">{{ minimumValue }}</span>
        <span class="max">{{ maximumValue }}</span>
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
    .snippetSliderContainer {
        padding: 5px;
        margin-bottom: 10px;
        height: auto;
    }
    .snippetSliderContainer input {
        clear: left;
        width: 100%;
        box-sizing: border-box;
        outline: 0;
        position: relative;
        margin-bottom: 5px;
    }
    .snippetSliderContainer .info-icon {
        float: right;
        font-size: 16px;
        color: #ddd;
    }
    .snippetSliderContainer .info-icon .opened {
        color: #000;
    }
    .snippetSliderContainer .info-icon:hover {
        cursor: pointer;
        color: #a5a09e;
    }
    .snippetSliderContainer .info-text {
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 10px;
        padding: 15px 10px;
    }
    .snippetSliderContainer .bottom {
        clear: left;
        width: 100%;
    }
    .snippetSliderContainer .left {
        float: left;
        width: 90%;
    }
    .snippetSliderContainer .right {
        position: absolute;
        right: 10px;
    }
    input[type="number"] {
        text-align: center;
        font-size: 12px;
        -moz-appearance: textfield;
        width: 60px;
        float: right;
        margin-bottom: 10px;
        padding-top: 5px;
        margin-top: 2px;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type="range"] {
        -webkit-appearance: none;
        background-color: #ddd;
        height: 15px;
        overflow: hidden;
        width: 100%;
    }

    input[type="range"]::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        height: 15px;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: #ffffff;
        border-radius: 50%;
        box-shadow: -210px 0 0 200px #3177b1;
        cursor: pointer;
        height: 15px;
        width: 15px;
        border: 0;
    }

    input[type="range"]::-moz-range-thumb {
        background: #ffffff;
        border-radius: 50%;
        box-shadow: -1010px 0 0 1000px #3177b1;
        cursor: pointer;
        height: 15px;
        width: 15px;
        border: 0;
    }

    input[type="range"]::-moz-range-track {
        background-color: #ddd;
    }
    input[type="range"]::-moz-range-progress {
        background-color: #3177b1;
        height: 15px
    }
    input[type="range"]::-ms-fill-upper {
        background-color: #ddd;
    }
    input[type="range"]::-ms-fill-lower {
        background-color: #3177b1;
    }
    span {
        &.min {
            float: left;
        }
        &.max {
            float: right;
        }
    }
    input[type="range"].disabled {
        -webkit-appearance: none;
        background-color: grey;
        height: 15px;
        overflow: hidden;
        width: 100%;
    }

    input[type="range"].disabled::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: #ddd;
        border-radius: 50%;
        box-shadow: -210px 0 0 200px grey;
        cursor: pointer;
        height: 15px;
        width: 15px;
        border: 0;
    }

    input[type="range"].disabled::-moz-range-thumb {
        background: #ddd;
        border-radius: 50%;
        box-shadow: -1010px 0 0 1000px grey;
        cursor: pointer;
        height: 15px;
        width: 15px;
        border: 0;
    }
    input[type="range"].disabled::-moz-range-track {
        background-color: grey;
    }
    input[type="range"].disabled::-moz-range-progress {
        background-color: grey;
        height: 15px
    }
    input[type="range"].disabled::-ms-fill-upper {
        background-color: grey;
    }
    input[type="range"].disabled::-ms-fill-lower {
        background-color: grey;
    }
</style>
