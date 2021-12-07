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
            value: this.prechecked
        };
    },
    watch: {
        value (newVal) {
            if (newVal) {
                this.value = this.getValueInRange(newVal, true);
            }
        }
    },
    created () {
        this.value = this.getValueInRange(this.value, false);
        this.setInvalid(this.minimumValue, this.maximumValue);
        this.setMinOnly(this.minimumValue, this.maximumValue);
        this.setMaxOnly(this.minimumValue, this.maximumValue);
        this.setMinMaxValue(this.minimumValue, this.maximumValue);
    },
    methods: {
        /**
         * Checking if the input key is in valid format and void invalid format (number)
         * @param {Event} evt - keypress event
         * @returns {Boolean} true if the input is in valid format (number)
         */
        checkkeyInteger (evt) {
            const charCode = evt.which ? evt.which : evt.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 45) {
                store.dispatch("Alerting/addSingleAlert", i18next.t("common:snippets.slider.incorrectEntry"));
                evt.stopPropagation();
                return false;
            }

            return true;
        },

        /**
         * Checking if the input field is empty and set the value to the minimum value
         * @param {Event} evt - input event
         * @returns {void}
         */
        checkEmpty (evt) {
            if (evt?.target?.value === "") {
                this.value = this.minimumValue;
            }
        },

        /**
         * Checking if the input number is in range
         * @param {Number} data the input number
         * @param {Boolean} flag to decide if show the alerting box
         * @returns {Number} the original input number or converted number
         */
        getValueInRange (data, flag) {
            let value = parseInt(data, 10);

            if (this.invalid) {
                return false;
            }

            if (value < this.minimumValue) {
                value = this.minimumValue;
                if (flag) {
                    this.getAlertRangeText();
                }
            }
            else if (value > this.maximumValue) {
                value = this.maximumValue;
                this.getAlertRangeText();
                if (flag) {
                    this.getAlertRangeText();
                }
            }

            return value;
        },

        /**
         * Getting slider range error text in alerting box
         * @returns {void}
         */
        getAlertRangeText () {
            store.dispatch("Alerting/addSingleAlert", i18next.t("common:snippets.slider.outOfRangeErrorMessage", {
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
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        v-if="!invalid"
    >
        <label for="slider-single">{{ label }}</label>
        <input
            v-model="value"
            class="input-single"
            type="text"
            :name="label"
            @keypress="checkkeyInteger"
            @input="checkEmpty"
        >
        <input
            v-model="value"
            class="slider-single"
            type="range"
            :min="minimumValue"
            :max="maximumValue"
        >
        <span class="min">{{ minimumValue }}</span>
        <span class="max">{{ maximumValue }}</span>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    input[type="text"] {
        width: 60px;
        float: right;
        margin-bottom: 10px;
        text-align: center;
        padding-top: 5px;
    }
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type="text"] {
        -moz-appearance: textfield;
    }
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
        margin-top: 5px;
        &.min {
            float: left;
        }
        &.max {
            float: right;
        }
    }
</style>
