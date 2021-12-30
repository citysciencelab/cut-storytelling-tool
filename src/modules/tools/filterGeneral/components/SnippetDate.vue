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
            disable: true,
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
            },
            showInfo: false
        };
    },
    computed: {
        infoText: function () {
            return this.info ? this.info : this.$t("modules.tools.filterGeneral.dateInfo");
        }
    },
    watch: {
        value (newVal) {
            if (newVal) {
                this.value = this.getValueInRange(newVal);
            }
        },
        disabled (value) {
            this.disable = typeof this.disabled === "boolean" ? value : true;
        }
    },
    created () {
        this.value = this.getValueInRange(this.value);
        this.setMinOnly(this.min, this.max);
        this.setMaxOnly(this.min, this.max);
        this.setInvalid(this.min, this.max);
        this.setMinMaxValue(this.min, this.max);
        this.disable = false;
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
        class="snippetDateContainer"
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
        <div class="input-container">
            <label
                class="left"
                for="dateInput"
            >{{ label }}</label>
            <input
                id="dateInput"
                v-model="value"
                class="snippetDate"
                type="date"
                name="dateInput"
                :max="max"
                :min="min"
                :disabled="disable"
                @input="checkEmpty"
            >
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
    .snippetDateContainer {
        padding: 5px;
        margin-bottom: 10px;
        height: auto;
    }
    .snippetDateContainer input {
        clear: left;
        width: 100%;
        box-sizing: border-box;
        outline: 0;
        position: relative;
        margin-bottom: 5px;
    }
    .snippetDateContainer .info-icon {
        float: right;
        font-size: 16px;
        color: #ddd;
    }
    .snippetDateContainer .info-icon .opened {
        color: #000;
    }
    .snippetDateContainer .info-icon:hover {
        cursor: pointer;
        color: #a5a09e;
    }
    .snippetDateContainer .info-text {
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 10px;
        padding: 15px 10px;
    }
    .snippetDateContainer .bottom {
        clear: left;
        width: 100%;
    }
    .snippetDateContainer .left {
        float: left;
        width: 90%;
    }
    .snippetDateContainer .right {
        position: absolute;
        right: 10px;
    }
    label {
        text-transform: capitalize;
        margin: 0;
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
