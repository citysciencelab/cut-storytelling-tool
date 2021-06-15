<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersWmst";
import mutations from "../store/mutationsWmst";

export default {
    name: "TimeSlider",
    props: {
        layerId: {
            type: String,
            default: ""
        }
    },
    data: () => ({playing: false, sliderValue: 0}),
    computed: {
        ...mapGetters("Wmst", Object.keys(getters))
    },
    watch: {
        defaultValue () {
            this.sliderValue = this.defaultValue;
        },
        sliderValue () {
            Radio.trigger("WMST", "updateTime", this.sliderValue); // TODO: Add id so that only the correct layeer gets updated
        }
    },
    created () {
        this.sliderValue = this.defaultValue;
    },
    methods: {
        ...mapActions("Wmst", ["toggleSwiper"]),
        ...mapMutations("Wmst", Object.keys(mutations)),
        animate () {
            // TODO: Klärung: Wie würde ein Nutzer dieses Bedienelement erwarten? -> Abklären, wie dies zu implementieren ist! Im bsp is forward einfach der nächste, backward einfach einen zurück und play das richtige Filmchen --> Film hört am Ende auf und beginnt nicht neu bei 0
            if (this.playing) {
                const index = this.nextIndex(true);

                if (index === this.timeRange.length) {
                    this.playing = false;
                }
                this.sliderValue = this.timeRange[index];
            }
        },
        nextIndex (forward) {
            const next = forward ? 1 : -1;

            // If the value is changed by user input instead of the "play"-function, the value is a String.
            return this.timeRange.indexOf(typeof this.sliderValue === "number" ? this.sliderValue : parseInt(this.sliderValue, 10)) + next;
        },
        play () {
            let interval;

            this.playing = !this.playing;

            if (this.playing) {
                // TODO: Wait for answer of service before next call if possible
                interval = setInterval(this.animate, 1000);
            }
            else {
                clearInterval(interval);
            }
        },
        setSliderValue (value) {
            this.sliderValue = value;
        }
    }
};
</script>

<template>
    <div class="timeSlider-wrapper centered-box-wrapper">
        <div class="timeSlider-innerWrapper">
            <!-- TODO: Integrate me like it is specified! -->
            <button @click="toggleSwiper(layerId)">
                Click Me
            </button>
            <!-- TODO: Add another "label" for the slider here that shows the information verticaly -->
        </div>
        <div class="timeSlider-innerWrapper-interactions">
            <fieldset>
                <!-- TODO: aria-label incl. translations for buttons -->
                <button
                    class="btn btn-sm btn-block"
                    @click="setSliderValue(timeRange[nextIndex(false)])"
                >
                    <i class="glyphicon glyphicon-backward" />
                </button>
                <button
                    class="btn btn-sm btn-block"
                    @click="play"
                >
                    <i
                        :class="{
                            'glyphicon': true,
                            'glyphicon-play': !playing,
                            'glyphicon-stop': playing
                        }"
                    />
                </button>
                <button
                    class="btn btn-sm btn-block"
                    @click="setSliderValue(timeRange[nextIndex(true)])"
                >
                    <i class="glyphicon glyphicon-forward" />
                </button>
            </fieldset>
            <fieldset>
                <label>{{ sliderValue }}</label>
            </fieldset>
            <fieldset>
                <input
                    class="timeSlider-rangeSlider"
                    type="range"
                    :value="sliderValue"
                    :min="min"
                    :max="max"
                    :step="step"
                    aria-label="slide time"
                    @change="setSliderValue($event.target.value)"
                >
            </fieldset>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "~variables";

.timeSlider-wrapper {
    @base-space: 0.25em;

    position: absolute;
    bottom: 6em;
    left: 50%;
    z-index: 3;

    display: flex;
    flex-direction: column;
    background: white;
    box-shadow: @tool_box_shadow;

    .timeSlider-innerWrapper {
        margin-top: calc(@base-space * 3);
    }

    .timeSlider-innerWrapper-interactions {
        @border-style: 1px solid black;

        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 28em;
        margin: calc(@base-space * 3);
        border: 1px solid black;

        & > fieldset {
            display: flex;

            button {
                margin: @base-space;
            }
            input {
                margin-right: @base-space;
            }
            label {
                border-left: @border-style;
                border-right: @border-style;
                margin: 0;
                padding: calc(@base-space * 3);
            }
        }
    }
}
</style>
