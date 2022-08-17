<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getComponent from "../../../../utils/getComponent";
import ToolTemplate from "../../ToolTemplate.vue";
import getters from "../store/gettersShadowTool";
import mutations from "../store/mutationsShadowTool";
import actions from "../store/actionsShadowTool";
import SliderInput from "./SliderInput.vue";
import ToggleCheckbox from "../../../../share-components/toggleCheckbox/components/ToggleCheckbox.vue";
import moment from "moment";

export default {
    name: "ShadowTool",
    components: {
        ToolTemplate,
        SliderInput,
        ToggleCheckbox
    },
    data () {
        return {
            currentDate: moment().format("YYYY-MM-DD"),
            currentTime: moment().format("HH:mm"),
            currentYear: moment().format("YYYY"),
            currentMonth: moment().format("MM"),
            currentDay: moment().format("DD"),
            currentHour: moment().hour(),
            currentMinute: moment().minute(),
            year: null,
            month: null,
            date: moment().format("YYYY-MM-DD"),
            showDate: moment().format("YYYY-MM-DD"),
            showTime: moment().format("HH:mm"),
            displayedShadowTime: null,
            timeSliderValue: 0,
            dateSliderValue: 0,
            shadowActive: false
        };
    },
    computed: {
        ...mapGetters("Tools/ShadowTool", Object.keys(getters)),
        ...mapGetters("Language", ["layerIds", "currentLocale"])
    },
    watch: {
        /**
         * watches the status of the tool
         * starts initial processes if the tool has been activated for the first time
         * @param {Boolean} value true if the tool has been activated
         * @returns {void}
         */
        active (value) {
            this.$nextTick(() => {
                if (value) {
                    this.setActive(value);
                    this.createDate();
                }
            });
        },
        shadowActive (value) {
            if (!value) {
                document.getElementById("control").style.display = "none";
            }
            else {
                document.getElementById("control").style.display = "block";
            }

        },
        currentLocale () {
            this.checkDateFormat();
        }
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapMutations("Tools/ShadowTool", Object.keys(mutations)),
        ...mapActions("Tools/ShadowTool", Object.keys(actions)),

        close () {
            this.setActive(false);
            // The value "isActive" of the Backbone model is also set to false to change the CSS class in the menu (menu/desktop/tool/view.toggleIsActiveClass)
            const model = getComponent(this.id);

            if (model) {
                model.set("isActive", false);
            }
            this.toggleShadow(false);
        },
        createDate () {
            const year = this.shadowTime.year ? this.shadowTime.year : this.currentYear,
                checkedMonth = this.shadowTime.month.length === 1 ? "0" + this.shadowTime.month : this.shadowTime.month,
                checkedDay = this.shadowTime.day.length === 1 ? "0" + this.shadowTime.day : this.shadowTime.day,
                checkedHour = this.shadowTime.hour.length === 1 ? "0" + this.shadowTime.hour : this.shadowTime.hour,
                checkedMinute = this.shadowTime.minute.length === 1 ? "0" + this.shadowTime.minute : this.shadowTime.minute,
                month = this.shadowTime.month ? checkedMonth : this.currentMonth,
                day = this.shadowTime.day ? checkedDay : this.currentDay,
                hour = this.shadowTime.hour ? checkedHour : this.currentHour,
                minute = this.shadowTime.minute ? checkedMinute : this.currentMinute,
                showDate = [year, month, day].join("-"),
                showTime = [hour, minute].join(":");


            this.date = showDate;
            this.checkDateFormat();
            this.showTime = showTime;

            if (document.getElementById("datePicker")) {
                document.getElementById("datePicker").value = showDate;
            }

            this.syncDateSlider();
            this.initTimeSlider(hour, minute);
            this.updateShadow();
        },
        syncDateSlider () {
            const date = new Date(document.getElementById("datePicker").value);

            if (document.getElementById("datePicker")) {
                this.date = document.getElementById("datePicker").value;
                this.checkDateFormat();
                this.updateShadow();
                this.dateSliderValue = moment(date).dayOfYear();
            }
        },
        checkDateFormat () {
            const dates = this.date.split("-");

            if (this.currentLocale === "de" || this.currentLocale === "platt") {
                this.showDate = [dates[2], dates[1], dates[0]].join("-");
            }
            else {
                this.showDate = [dates[1], dates[2], dates[0]].join("-");
            }
        },
        initTimeSlider (hour, minute) {
            let initMinuteValue;

            this.shadowTime.minute = this.shadowTime.minute ? this.shadowTime.minute : "0";
            this.shadowTime.hour = this.shadowTime.hour ? this.shadowTime.hour : "0";
            if (this.shadowTime.hour !== "0" || this.shadowTime.minute !== "0") {
                initMinuteValue = Number(this.shadowTime.hour) * 60 + Number(this.shadowTime.minute);
            }
            else {
                initMinuteValue = Number(hour) * 60 + Number(minute);
            }
            this.syncTimeSlider(initMinuteValue);

        },
        syncTimeSlider (minuteValue) {
            const timeSliderValue = minuteValue,
                hours = Math.floor(timeSliderValue / 60),
                minutes = (timeSliderValue % 60).toString(),
                minutesDisplay = minutes.length === 1 ? "0" + minutes : minutes;

            this.timeSliderValue = minuteValue;
            this.showTime = hours + ":" + minutesDisplay;
            this.updateShadow();
        },
        syncDatePicker (totalDaysInYear) {
            const startDate = new Date(Number(this.currentYear), 0),
                calculateDate = new Date(startDate.setDate(Number(totalDaysInYear))), // initialize a date in `year-01-01`
                formatCalculateDate = moment(calculateDate).format("YYYY-MM-DD");

            if (document.getElementById("datePicker")) {
                this.date = formatCalculateDate;
                this.checkDateFormat();
                this.dateSliderValue = totalDaysInYear;
                document.getElementById("datePicker").value = this.date;
            }
            this.updateShadow();
        },
        toggleShadow (visible) {
            const scene = mapCollection.getMap("3D").getCesiumScene();

            this.shadowActive = visible;

            if (scene) {
                if (visible) {
                    if (!scene.sun) {
                        scene.sun = new Cesium.Sun();
                    }
                    scene.globe.shadows = Cesium.ShadowMode.RECEIVE_ONLY;
                    scene.globe.enableLighting = visible;
                    scene.shadowMap.enabled = visible;
                }
                else {
                    scene.shadowMap.enabled = visible;
                }
            }
        },
        /**
     * Combines the given timestamps for time and date together
     * @param   {timestamp} time timestamp with time
     * @param   {timestamp} date timestamd with date
     * @returns {timestamp} timestamp the combined timestamp
     */
        updateShadow () {
            this.displayedShadowTime = new Date(this.date + " " + this.showTime + ":00");
            this.setCesiumTime(this.displayedShadowTime.getTime());
        },
        /**
         * Trigger new date to map3D
         * @param {timestamp} datetime new Time
         * @fires Core#RadioTriggerMapSetShadowTime
         * @returns {void}
         */
        setCesiumTime (datetime) {

            if (typeof Cesium !== "undefined") {
                mapCollection.getMap("3D").time = Cesium.JulianDate.fromDate(moment(datetime).toDate());
            }
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <div class="d-flex justify-content-between mb-3">
                <label
                    class="form-label"
                    for="tool-shadow-checkbox"
                >
                    {{ $t('common:modules.tools.shadow.shadowDisplay') }}
                </label>
                <ToggleCheckbox
                    id="tool-shadow-checkbox"
                    ref="shadowCheckBox"
                    :default-state="isShadowEnabled"
                    :text-on="$t('common:snippets.checkbox.on')"
                    :text-off="$t('common:snippets.checkbox.off')"
                    @change="toggleShadow"
                />
            </div>
            <div
                id="control"
            >
                <div class="d-flex justify-content-between mb-3">
                    <label
                        class="form-label"
                        for="datePicker"
                    >
                        {{ $t('common:modules.tools.shadow.pickDate') }}
                    </label>
                    <input
                        id="datePicker"
                        type="date"
                        @change="syncDateSlider"
                    >
                </div>
                <SliderInput
                    id="dateSlider"
                    :valuelabel="showDate"
                    :value="dateSliderValue"
                    :min="0"
                    :step="1"
                    :disabled="false"
                    :max="366"
                    @input="syncDatePicker($event)"
                />
                <br>
                <SliderInput
                    id="timeSlider"
                    :label="$t('common:modules.tools.shadow.slideHour')"
                    :value="timeSliderValue"
                    :valuelabel="showTime"
                    :min="1"
                    :disabled="false"
                    :step="1"
                    :max="1440"
                    @input="syncTimeSlider($event)"
                />
            </div>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
    @import "~variables";

#control {
display: none
}
label {
text-align: left;
width: 300px;
line-height: 26px;
margin-bottom: 10px;
}

input {
  height: 20px;
  flex: 0 0 200px;
  margin-left: 10px;
}
</style>
