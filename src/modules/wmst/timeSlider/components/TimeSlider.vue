<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import actions from "../store/actionsTimeSlider";
import getters from "../store/gettersTimeSlider";
import mutations from "../store/mutationsTimeSlider";

export default {
    name: "TimeSlider",
    data: () => ({direction: "stop", inputValue: 0, sliderValue: 0}),
    computed: {
        ...mapGetters("Wmst/TimeSlider", Object.keys(getters))
    },
    watch: {
        defaultValue () {
            this.inputValue = this.sliderValue = this.defaultValue;
        },
        inputValue () {
            Radio.trigger("WMST", "updateTime", this.inputValue);
        }
    },
    methods: {
        ...mapMutations("Wmst/TimeSlider", Object.keys(mutations)),
        ...mapActions("Wmst/TimeSlider", Object.keys(actions)),
        animate () {
            // TODO: Klärung: Wie würde ein Nutzer dieses Bedienelement erwarten? -> Abklären, wie dies zu implementieren ist!
            if (this.direction !== "stop") {
                let index = this.timeRange.indexOf(this.inputValue);

                if (this.direction === "forward") {
                    index = index + 1 < this.timeRange.length ? index + 1 : 0;
                }
                if (this.direction === "backward") {
                    index = (index > 0 ? index : this.timeRange.length) - 1;
                }

                this.inputValue = this.sliderValue = this.timeRange[index];
            }
        },
        changeDirection (value) {
            let direction = value;

            // TODO: setInterval, clearInterval diggi

            if (value === "") { // TODO: button put :(
                direction = this.direction === "stop" ? "play" : "stop";
            }

            this.direction = direction;
            this.animate();
        },
        inputValueChanged (value) {
            if (this.timeRange.indexOf(value) > -1) {
                this.inputValue = this.sliderValue = value;
            }
            else {
                this.inputValue = this.sliderValue = this.defaultValue;
                console.warn("TimeSlider: The selected value is outside of the possible range or is not a valid input for the selected layer!");
            }
        },
        sliderValueChanged (value) {
            // TODO: Later on: If value is not inside timeRange, then, depending on the direction, the next higher / lower value needs to be received; standard direction is forward for this
            this.sliderValue = this.inputValue = value;
        }
    }
};
</script>

<template>
    <div class="timeSlider-wrapper centered-box-wrapper">
        <!-- TODO: Integration von dem Button für Swiper-->
        <fieldset class="timeSlider-button-group">
            <!-- TODO: Label inkl. Übersetzungen für die Buttons-->
            <button @click="changeDirection('backward')">
                <i class="glyphicon glyphicon-backward" />
            </button> <!-- TODO: Abgängig vom 'step' wird von max zu min gegangen -->
            <button @click="changeDirection('')">
                <i
                    :class="{
                        'glyphicon': true,
                        'glyphicon-play': direction === 'stop',
                        'glyphicon-stop': direction === 'play'
                    }"
                />
            </button>
            <button @click="changeDirection('forward')">
                <i class="glyphicon glyphicon-forward" />
            </button> <!-- TODO: Abgängig vom 'step' wird von min zu max gegangen -->
        </fieldset>
        <!-- TODO: Add proper labels -->
        <input
            class="timeSlider-currentTime"
            placeholder="Aktuelles Jahr"
            :value="inputValue"
            aria-label="Current Time"
            @change="inputValueChanged($event.target.value)"
        > <!-- TODO: Kein Input, sondern span(nend) -->
        <input
            class="timeSlider-rangeSlider"
            type="range"
            :value="sliderValue"
            :min="min"
            :max="max"
            :step="step"
            aria-label="slide time"
            @change="sliderValueChanged($event.target.value)"
        >
        <!-- TODO:
                value - A single value
                value1,value2,value3,...^a - A list of multiple values
                min/max/resolution - An interval defined by its lower and upper bounds and its resolution.
                min1/max1/res1,min2/max2/res2,...^a - A list of multiple intervals
                ^a Whitespace is allowed following commas in a list in an <Extent> element.

                TODO: Impl:
                    value -> Nur der Wert
                    value1,value2,value3,... -> Nur diese Werte
                    min/max/resolution -> Alle Werte zwischen min & max, wobei resolution die Abstandsart angibt
                    min1/max1/res1,min2/max2/res2,... -> Wie einen oben, mit dem Unterschied, das zwischen den einzelnen Bereichen nichts angezeigt wird
                -->
    </div>
</template>

<style lang="less" scoped>
@import "~variables";

@margin: 1em;

.timeSlider-wrapper {
    position: absolute;
    bottom: 4em;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;

    display: flex;
    background: white;
    box-shadow: @tool_box_shadow;

    & > * {
        margin: @margin;
    }

    // TODO: Why is the margin of the last element on the right not the above? Or is it?
    .timeSlider-button-group {
        button {
            margin: calc(@margin / 4);
        }
    }

    .timeSlider-currentTime {
        width: 6em;
    }

    .timeSlider-rangeSlider {
        width: 50%;
        margin-left: 0;
    }
}
</style>
