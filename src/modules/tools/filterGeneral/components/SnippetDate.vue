<script>
import InterfaceOL from "../interfaces/interface.ol.js";
import IntervalRegister from "../utils/intervalRegister.js";
import isObject from "../../../../utils/isObject";
import moment from "moment";

export default {
    name: "SnippetDate",
    props: {
        attrName: {
            type: String,
            required: false,
            default: ""
        },
        format: {
            type: String,
            required: false,
            default: "DD.MM.YYYY"
        },
        label: {
            type: String,
            required: false,
            default: ""
        },
        maxValue: {
            type: String,
            required: false,
            default: undefined
        },
        minValue: {
            type: String,
            required: false,
            default: undefined
        },
        operator: {
            type: String,
            required: false,
            default: "EQ"
        },
        prechecked: {
            type: String,
            required: false,
            default: ""
        },
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data () {
        return {
            max: this.convertDateFormat(this.maxValue),
            min: this.convertDateFormat(this.minValue),
            minOnly: false,
            maxOnly: false,
            value: this.convertDateFormat(this.prechecked),
            interface: {},
            invalid: false,
            service: {
                type: "WFS",
                url: "https://geodienste.hamburg.de/HH_WFS_Baustellen",
                typename: "tns_steckbrief_visualisierung"
            }
        };
    },
    watch: {
        value (newVal) {
            if (newVal) {
                this.value = this.getValueInRange(newVal);
            }
        }
    },
    created () {
        this.value = this.getValueInRange(this.value);
        this.setMinOnly(this.min, this.max);
        this.setMaxOnly(this.min, this.max);
        this.setInvalid(this.min, this.max);
        this.setMinMaxValue(this.min, this.max);
    },
    methods: {
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
         * converts the format of the given date to an ISO date format "YYYY-MM-DD"
         * @param {Date} date the date to be converted
         * @returns {Date} the formatted date
         */
        convertDateFormat (date) {
            return date ? moment(date, this.format).format("YYYY-MM-DD") : date;
        },

        /**
         * Checking if the input field is empty and set the value to the minimum value
         * @param {Event} evt - input event
         * @returns {void}
         */
        checkEmpty (evt) {
            if (evt?.target?.value === "") {
                this.value = this.min;
            }
        },

        /**
         * setting the parameter minimumValue and maximumValue
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
                    this.min = moment(minimumValue === undefined && isObject(minMaxObj) && Object.prototype.hasOwnProperty.call(minMaxObj, "min") ? minMaxObj.min : minimumValue, "DD.MM.YYYY").format("YYYY-MM-DD");
                    this.max = moment(maximumValue === undefined && isObject(minMaxObj) && Object.prototype.hasOwnProperty.call(minMaxObj, "max") ? minMaxObj.max : maximumValue, "DD.MM.YYYY").format("YYYY-MM-DD");
                    this.setInvalid(this.min, this.max);
                    this.value = this.getValueInRange(this.value);
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
                this.invalid = true;
                return;
            }
            else if (moment(maximumValue) < moment(minimumValue)) {
                console.warn("Please check your configuration or dienst manager, the end date could not be ealier than the begin date!");
                this.invalid = true;
                return;
            }
            else if (!moment(maximumValue).isValid() || !moment(minimumValue).isValid()) {
                console.warn("Please check your configuration or dienst manager, the min and max date value should be a valid date!");
                this.invalid = true;
                return;
            }
            this.invalid = false;
        },

        /**
         * check if the given date is between min and max date
         * and set it if it is outside min and max
         * @param {Date} date the prechecked date
         * @returns {Date|Boolean} the original input date or converted date or false
         */
        getValueInRange (date) {
            let value = date;

            if (this.invalid) {
                return false;
            }

            if (moment(value) < moment(this.min)) {
                value = this.min;
            }
            else if (moment(value) > moment(this.max)) {
                value = this.max;
            }

            return value;
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        v-if="!invalid"
        class="snippetDateContainer"
    >
        <label for="dateInput">{{ label }}</label>
        <input
            id="dateInput"
            v-model="value"
            class="snippetDate"
            type="date"
            name="dateInput"
            :max="max"
            :min="min"
            @input="checkEmpty"
        >
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    label {
        text-transform: capitalize;
        margin: 0;
    }
    input {
        box-sizing: border-box;
        outline: 0;
        position: relative;
        width: 100%;
    }
    input[type="date"]::-webkit-calendar-picker-indicator {
        background: transparent;
        bottom: 0;
        color: transparent;
        cursor: pointer;
        height: auto;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: auto;
    }
</style>
