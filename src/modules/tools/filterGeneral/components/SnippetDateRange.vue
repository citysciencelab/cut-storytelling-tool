<script>
import InterfaceOL from "../interfaces/interface.ol.js";
import IntervalRegister from "../utils/intervalRegister.js";
import moment from "moment";

export default {
    name: "SnippetDateRange",
    props: {
        attrName: {
            type: [String, Array],
            required: true
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
            default: "YYYY-MM-DD"
        },
        label: {
            type: String,
            required: false,
            default: ""
        },
        maxValue: {
            type: [String, Array],
            required: false,
            default: undefined
        },
        minValue: {
            type: [String, Array],
            required: false,
            default: undefined
        },
        operator: {
            type: String,
            required: false,
            default: "EQ"
        },
        prechecked: {
            type: Array,
            required: false,
            default: () => []
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
            fromDate: Array.isArray(this.prechecked) && this.prechecked.length === 2 ? this.convertDateFormat(this.prechecked[0]) : null,
            interface: null,
            invalid: false,
            initialMin: Array.isArray(this.minValue) ? this.convertDateFormat(this.minValue[0]) : this.convertDateFormat(this.minValue),
            maxFrom: Array.isArray(this.minValue) ? this.convertDateFormat(this.minValue[1]) : this.convertDateFormat(this.maxValue),
            minFrom: Array.isArray(this.minValue) ? this.convertDateFormat(this.minValue[0]) : this.convertDateFormat(this.minValue),
            maxUntil: Array.isArray(this.maxValue) ? this.convertDateFormat(this.maxValue[1]) : this.convertDateFormat(this.maxValue),
            minUntil: Array.isArray(this.maxValue) ? this.convertDateFormat(this.maxValue[0]) : this.convertDateFormat(this.minValue),
            untilDate: Array.isArray(this.prechecked) && this.prechecked.length === 2 ? this.convertDateFormat(this.prechecked[1]) : null,
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
            return this.info ? this.info : this.$t("modules.tools.filterGeneral.dateRangeInfo");
        }
    },
    watch: {
        disabled (value) {
            this.disable = typeof value === "boolean" ? value : true;
        }
    },
    created () {
        if (this.isInvalid()) {
            this.invalid = true;
            return;
        }
        this.interface = new InterfaceOL(new IntervalRegister(), {
            getFeaturesByLayerId: false,
            isFeatureInMapExtent: false
        });
        this.checkPrechecked();
        this.checkMinMax();
        this.disableFrom = this.disabled;
        this.disableUntil = this.disabled;
    },
    methods: {
        /**
         * Checks if something is wrong configured, throws an console.warn message if so.
         * @returns {Boolean} returns true if something is configured wrong, false if everything is ok
         */
        isInvalid () {
            if (
                ((this.prechecked.length !== 2 && this.prechecked.length !== 0) && Array.isArray(this.prechecked))
                || (this.minValue && this.maxValue && !Array.isArray(this.minValue) && !Array.isArray(this.maxValue) && moment(this.minValue, this.format) > moment(this.maxValue, this.format))
            ) {
                console.warn("Please check your configurations. Make sure to check if maxValue is not earlier than minValue and if prechecked is an array based on 2 date strings or is empty");
                return true;
            }
            else if ((Array.isArray(this.minValue) && this.minValue.length < 2) && (Array.isArray(this.maxValue) && this.maxValue.length < 2)) {
                console.warn("You must configure an start and end date if you use Arrays for maxValue or minValue");
                return true;
            }
            return false;
        },
        /**
         * Parse given param to date string.
         * @param {*} date param which should be parsed to date format
         * @returns {*|String} string or given param
         */
        convertDateFormat (date) {
            return typeof date !== "undefined" && typeof date === "string" ? moment(date, this.format).format("YYYY-MM-DD") : date;
        },
        /**
         * Set min or max or both for the first datepicker.
         * @param {String} attribute the param to fetch min max values
         * @param {Boolean} min set true if only min is required. If both are false, min max returns.
         * @param {Boolean} max set true if only max is required. If both are false, min max returns.
         * @returns {void}
         */
        setMinMaxFromDate (attribute, min = false, max = false) {
            this.interface.getMinMax(this.service, attribute, minMaxObj => {
                const minFormated = this.convertDateFormat(minMaxObj?.min),
                    maxFormated = this.convertDateFormat(minMaxObj?.max);

                this.minFrom = minFormated ? minFormated : this.minFrom;
                this.maxFrom = maxFormated ? maxFormated : this.maxFrom;
                // If user configured prechecked dates which are not between min and max
                this.checkPrechecked();
            }, onerror => {
                console.warn(onerror);
            }, min, max);
        },
        /**
         * Set min or max or both for the second datepicker.
         * @param {String} attribute the attribute to fetch min max values
         * @param {Boolean} min set true if only min is required. If both are false, min max returns.
         * @param {Boolean} max set true if only max is required. If both are false, min max returns.
         * @returns {void}
         */
        setMinMaxUntilDate (attribute, min = false, max = false) {
            this.interface.getMinMax(this.service, attribute, minMaxObj => {
                const minFormated = this.convertDateFormat(minMaxObj?.min),
                    maxFormated = this.convertDateFormat(minMaxObj?.max);

                this.minUntil = minFormated ? minFormated : this.minUntil;
                this.maxUntil = maxFormated ? maxFormated : this.maxUntil;
                this.initialMin = this.minUntil;
                // If user configured prechecked dates which are not between min and max
                this.checkPrechecked();
            }, onerror => {
                console.warn(onerror);
            }, min, max);
        },
        /**
         * Check min max for the 'until' and 'from' field.
         * @returns {void}
         */
        checkMinMax () {
            let attributeFrom, attributeUntil, attribute;

            if (Array.isArray(this.attrName)) {
                attributeFrom = this.attrName[0];
                attributeUntil = this.attrName[1];
            }
            else {
                // If is String
                attribute = this.attrName;
            }

            if (!this.minValue && !this.maxValue) {
                this.setMinMaxFromDate(attribute ? attribute : attributeFrom);
                this.setMinMaxUntilDate(attribute ? attribute : attributeUntil);
            }
            else if (!this.minValue) {
                if (attribute) {
                    this.setMinMaxFromDate(attribute, true, false);
                    return;
                }
                this.setMinMaxFromDate(attributeFrom, true, false);
                this.setMinMaxUntilDate(attributeUntil, true, false);
            }
            else if (!this.maxValue) {
                if (attribute) {
                    this.setMinMaxUntilDate(attribute, false, true);
                    return;
                }
                this.setMinMaxFromDate(attributeFrom, false, true);
                this.setMinMaxUntilDate(attributeUntil, false, true);
            }
            this.disable = false;
        },
        /**
         * Change the min value of the until field.
         * @returns {void}
         */
        changeMin () {
            if (this.fromDate && (moment(this.fromDate) > moment(this.initialMin))) {
                this.minUntil = this.fromDate;
                if (this.fromDate > this.untilDate) {
                    this.untilDate = this.fromDate;
                }
            }
            else {
                this.minUntil = this.initialMin;
            }
        },
        checkPrechecked () {
            if (!Array.isArray(this.prechecked)) {
                this.invalid = true;
                console.warn("Precheked is not an array. It should be either an an array of 2 date strings or empty");
                return;
            }
            else if (this.prechecked.length !== 2) {
                return;
            }
            const precheckedBeginn = moment(this.prechecked[0], this.format),
                precheckedEnd = moment(this.prechecked[1], this.format);

            if (!precheckedBeginn.isValid() && !precheckedEnd.isValid) {
                return;
            }

            if (typeof this.minFrom !== "undefined" && typeof this.maxFrom !== "undefined") {
                if (precheckedBeginn < moment(this.minFrom, "YYYY-MM-DD")) {
                    this.fromDate = this.minFrom;
                }
                else if (precheckedBeginn > moment(this.maxFrom, "YYYY-MM-DD")) {
                    this.fromDate = this.maxFrom;
                }
            }
            if (typeof this.minUntil !== "undefined" && typeof this.maxUntil !== "undefined") {
                if (precheckedEnd < moment(this.minUntil, "YYYY-MM-DD")) {
                    this.untilDate = this.minUntil;
                }
                else if (precheckedEnd > moment(this.maxUntil, "YYYY-MM-DD")) {
                    this.untilDate = this.maxUntil;
                }
            }
        },
        toggleInfo () {
            this.showInfo = !this.showInfo;
        }
    }
};
</script>

<template>
    <div
        v-if="!invalid"
        v-show="visible"
        class="snippetDateRangeContainer"
    >
        <div class="left">
            <label for="date-from-input-container">
                {{ label }}
            </label>
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
        <div class="date-input-container">
            <div
                id="date-from-input-container"
                class="date-from-input-container"
            >
                <label for="inputDateFrom">{{ Array.isArray(attrName) ? attrName[0].toLowerCase() : attrName + " From: " }}</label>
                <input
                    id="inputDateFrom"
                    v-model="fromDate"
                    name="inputDateFrom"
                    class="snippetDateRangeFrom"
                    type="date"
                    :min="minFrom"
                    :max="maxFrom"
                    :disabled="disable"
                    @change="changeMin"
                >
            </div>
            <div
                id="date-to-input-container"
                class="date-to-input-container"
            >
                <label for="inputDateUntil">{{ Array.isArray(attrName) ? attrName[1].toLowerCase() : attrName + " To:" }}</label>
                <input
                    id="inputDateUntil"
                    v-model="untilDate"
                    name="inputDateUntil"
                    class="snippetDateRangeUntil"
                    type="date"
                    :min="minUntil"
                    :max="maxUntil"
                    :disabled="disable"
                >
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
    .snippetDateRangeContainer {
        padding: 5px;
        margin-bottom: 10px;
        height: auto;
    }
    .snippetDateRangeContainer input {
        clear: left;
        width: 100%;
        box-sizing: border-box;
        outline: 0;
        position: relative;
        margin-bottom: 5px;
    }
    .snippetDateRangeContainer .info-icon {
        float: right;
        font-size: 16px;
        color: #ddd;
    }
    .snippetDateRangeContainer .info-icon .opened {
        color: #000;
    }
    .snippetDateRangeContainer .info-icon:hover {
        cursor: pointer;
        color: #a5a09e;
    }
    .snippetDateRangeContainer .info-text {
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 10px;
        padding: 15px 10px;
    }
    .snippetDateRangeContainer .bottom {
        clear: left;
        width: 100%;
    }
    .snippetDateRangeContainer .left {
        float: left;
        width: 90%;
    }
    .snippetDateRangeContainer .right {
        position: absolute;
        right: 10px;
    }
    input[type='range'] {
        width: 10.5rem;
    }
    label {
        text-transform: capitalize;
        margin: 0;
    }
    .snippetDateRangeContainer > div {
        margin-bottom: 0.5rem;
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
