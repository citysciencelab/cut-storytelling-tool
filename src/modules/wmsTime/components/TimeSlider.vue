<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersWmsTime";
import mutations from "../store/mutationsWmsTime";

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
        ...mapGetters("WmsTime", Object.keys(getters)),
        ...mapGetters("Map", ["map"])
    },
    watch: {
        defaultValue () {
            this.sliderValue = this.defaultValue;
        },
        sliderValue () {
            // TODO: Test with two WMS-T
            if (this.timeRange.indexOf(this.sliderValue) === -1) {
                // If possible, find the next higher (or if not existent, lower) value inside the timeRange.
                const valTooHigh = this.timeRange[this.timeRange.length - 1] < this.sliderValue,
                    index = this.timeRange.findIndex(val => valTooHigh ? val < this.sliderValue : val > this.sliderValue);

                this.sliderValue = this.timeRange[index];
            }
            Radio.trigger("WMS-T", "updateTime", this.layerId, this.sliderValue);
        }
    },
    created () {
        this.sliderValue = this.defaultValue;
    },
    methods: {
        ...mapActions("WmsTime", ["toggleSwiper"]),
        ...mapMutations("WmsTime", Object.keys(mutations)),
        animate () {
            setTimeout(() => {
                const index = this.nextIndex();

                if (index === this.timeRange.length) {
                    this.playing = false;
                    return;
                }
                this.sliderValue = this.timeRange[index];
            }, 1000);
        },
        nextIndex (forward = true) {
            // If the value is changed through a user input instead of the "play"-function, the value is a String.
            return this.timeRange.indexOf(typeof this.sliderValue === "number" ? this.sliderValue : parseInt(this.sliderValue, 10)) + (forward ? 1 : -1);
        },
        moveOne (forward) {
            this.sliderValue = this.timeRange[this.nextIndex(forward)];
        },
        play () {
            this.playing = !this.playing;

            if (this.playing) {
                // Initial play
                this.animate();
                // Play whenever the layer has finished rendering
                this.map.on("rendercomplete", this.animate);
            }
            else {
                this.map.un("rendercomplete", this.animate);
            }
        }
    }
};
</script>

<template>
    <div class="timeSlider-wrapper centered-box-wrapper">
        <div class="timeSlider-innerWrapper">
            <button
                :id="'timeSlider-activate-layerSwiper-' + layerId"
                :class="['btn', 'btn-sm', swiper.active ? 'btn-primary' : 'btn-lgv-grey']"
                @click="toggleSwiper(layerId)"
            >
                {{ $t("common:modules.wmsTime.timeSlider.buttons.layerSwiper") }}
            </button>
        </div>
        <div class="timeSlider-innerWrapper-interactions">
            <fieldset>
                <button
                    class="btn btn-sm btn-lgv-grey"
                    :aria-label="$t('common:modules.wmsTime.timeSlider.buttons.backward')"
                    :disabled="nextIndex(false) === -1"
                    @click="moveOne(false)"
                >
                    <i class="glyphicon glyphicon-backward" />
                </button>
                <button
                    class="btn btn-sm btn-lgv-grey"
                    :aria-label="$t('common:modules.wmsTime.timeSlider.buttons.play')"
                    @click="play"
                >
                    <i
                        :class="['glyphicon', playing ? 'glyphicon-stop' : 'glyphicon-play']"
                    />
                </button>
                <button
                    class="btn btn-sm btn-lgv-grey"
                    :aria-label="$t('common:modules.wmsTime.timeSlider.buttons.forward')"
                    :disabled="nextIndex() === timeRange.length"
                    @click="moveOne(true)"
                >
                    <i class="glyphicon glyphicon-forward" />
                </button>
            </fieldset>
            <fieldset>
                <label :for="'timeSlider-input-range-' + layerId">{{ sliderValue }}</label>
            </fieldset>
            <fieldset>
                <!-- TODO: Probable bug with the input 'range' -> Lowest value can not be selected, one value over the maximum can be selected. -> -1 @ max gets rid of one bug caused by this -->
                <input
                    :id="'timeSlider-input-range-' + layerId"
                    type="range"
                    :value="sliderValue"
                    :min="min"
                    :max="max - 1"
                    :step="step"
                    :aria-label="$t('common:modules.wmsTime.timeSlider.inputRangeLabel')"
                    @input="sliderValue = $event.target.value"
                >
            </fieldset>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import "~variables";

.timeSlider-wrapper {
    @base-margin: 0.25em;
    @bigger-margin: calc(@base-margin * 3);

    position: absolute;
    bottom: 6em;
    left: 50%;
    z-index: 3;

    display: flex;
    flex-direction: column;
    background: white;
    box-shadow: @tool_box_shadow;

    .timeSlider-innerWrapper {
        display: flex;
        justify-content: flex-start;
        // No margin on bottom
        margin: @bigger-margin @bigger-margin 0;
    }

    .timeSlider-innerWrapper-interactions {
        @border-style: 1px solid black;

        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 28em;
        margin: @bigger-margin;
        border: 1px solid black;

        > fieldset {
            display: flex;

            button {
                margin: @base-margin;
            }
            input {
                margin-right: @base-margin;
            }
            label {
                border-left: @border-style;
                border-right: @border-style;
                margin: 0;
                padding: @bigger-margin;
            }
        }
    }
}
</style>
