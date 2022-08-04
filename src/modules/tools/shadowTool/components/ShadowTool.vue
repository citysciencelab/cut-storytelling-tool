<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getComponent from "../../../../utils/getComponent";
import ToolTemplate from "../../ToolTemplate.vue";
import getters from "../store/gettersShadowTool";
import mutations from "../store/mutationsShadowTool";
import actions from "../store/actionsShadowTool";
import SliderInput from "./SliderInput.vue";
import ToggleCheckbox from "../../../../share-components/toggleCheckbox/components/ToggleCheckbox.vue";
// import {fetchFirstModuleConfig} from "../../../utils/fetchFirstModuleConfig";
import moment from "moment";
/* const configPaths = [
        "configJson.Portalconfig.tools.shadow",
        "configJson.Portalconfig.menu.shadow",
    ],
 getLegendConfig: context => {
            return fetchFirstModuleConfig(context, configPaths, "Legend");
        }, */
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
            showDate: this.currentDate,
            showTime: moment().format("HH:mm"),
            timeSliderValue: null,
            dateSliderValue: null

        };
    },
    computed: {
        ...mapGetters("Tools/ShadowTool", Object.keys(getters))
    },
    created () {
          //  this.createDate();
    },
    watch: {
        /**
         * watches the status of the tool
         * starts initial processes if the tool has been activated for the first time
         * @param {Boolean} value true if the tool has been activated
         * @returns {void}
         */
        active (value) {
            console.log(this.hour);
            this.$nextTick(() => {
                if (value) {
                    this.setActive(value);
                    this.createDate();
                    console.log('--------------------------------------------------');
                }
            })
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
        },
        createDate () {
            // check :value=
            // add validate date
            console.log(this.currentHour);
            const year = this.shadowTime.year ? this.shadowTime.year : this.currentYear,
                month = this.shadowTime.month.toString() ? (this.shadowTime.month.length ===1 ? ("0"+this.shadowTime.month) : this.shadowTime.month) : this.currentMonth,
                day = this.shadowTime.day ? (this.shadowTime.day.length ===1 ? ("0"+this.shadowTime.day) : this.shadowTime.day) : this.currentDay,
                hour = this.shadowTime.hour ? (this.shadowTime.hour.length ===1 ? ("0"+this.shadowTime.hour) : this.shadowTime.hour) : this.currentHour,
                minute = this.shadowTime.minute ? (this.shadowTime.minute.length ===1 ? ("0"+this.shadowTime.minute) : this.shadowTime.minute) : this.currentMinute,
                showDate = year+"-"+month+"-"+day,
                showTime = hour+":"+minute;
            console.log(this.shadowTime);
            console.log(document.getElementById("datePicker"));
            if (document.getElementById("datePicker")){
            console.log((year+"-"+month+"-"+day));
            document.getElementById("datePicker").value = showDate;
            console.log((hour*60+minute/100));
            // document.getElementById("timeSlider").children[2].value = (hour*60+minute)/100
            this.timeSliderValue = (hour*60+minute)/100
            console.log(moment().year(year).month(month).date(day).dayOfYear());
            this.dateSliderValue = moment().year(year).month(month).date(day).dayOfYear();
            this.showDate = showDate;
            this.showTime = showTime;
            }
        },
        syncDateSlider () {

            this.showDate = document.getElementById("datePicker").value;
            var date = new Date(document.getElementById("datePicker").value);
            console.log(moment(date).dayOfYear());
            this.dateSliderValue = moment(date).dayOfYear();
        },
        syncTimeSlider (evt) {
            //evt ??
            if (evt){
            const timeSliderValue = document.getElementById("timeSlider").children[2].value,
                  hours = Math.floor(timeSliderValue / 60),
                  minutes = timeSliderValue % 60;

            this.showTime = hours+":"+minutes;
            }
        },
        syncDatePicker (totalDaysInYear) {
            var startDate = new Date(Number(this.currentYear), 0),
                calculateDate = new Date(startDate.setDate(Number(totalDaysInYear))),  // initialize a date in `year-01-01`
                formatCalculateDate = moment(calculateDate).format('YYYY-MM-DD');
  console.log(new Date(startDate.setDate(Number(totalDaysInYear)))); // add the number of days
  console.log(moment(calculateDate).format('YYYY-MM-DD'));


            this.showDate = formatCalculateDate;
            document.getElementById("datePicker").value = this.showDate;
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
                        :text-on="$t('common:snippets.checkbox.on')"
                        :text-off="$t('common:snippets.checkbox.off')"
                        @change="toggleShadow"
                    />
                </div>
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

             <template >
            <SliderInput
                 id="timeSlider"
                :label="$t('common:modules.tools.shadow.slideHour')"
                :value="timeSliderValue"
                :valueLabel="showTime"
                :min="1"
                :disabled="false"
                :step="1"
                :max="1440"
                unit="Uhrzeit"
                @input="syncTimeSlider($event)"
            />
        </template>
             <template >
            <SliderInput
                id="dateSlider"
                :label="$t('common:modules.tools.shadow.slideDate')"
                :valueLabel="showDate"
                :value="dateSliderValue"
                :min="0"
                :step="1"
                :disabled="false"
                :max="366"
                unit=""
                @input="syncDatePicker($event)"
            />
        </template>
        </template>
    </ToolTemplate>
</template>

<style lang="scss" scoped>
    @import "~variables";

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
