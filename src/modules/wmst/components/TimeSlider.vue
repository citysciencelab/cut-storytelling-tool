<script>
export default {
    name: "TimeSlider"
};
</script>

<template>
    <!-- TODO: Gotta do next:
            Werte hier rein
            Werte auf versch. Arten parsen (vorher, bevor es ein Attribut wird)
            Reaktivität der Werte
            Funktionen hier
     -->

    <div class="timeSlider-wrapper centered-box-wrapper">
        <!-- TODO: Integration von dem Button für Swiper-->
        <fieldset class="timeSlider-button-group">
            <!-- TODO: Übersetzungen für die Buttons-->
            <button>
                <i class="glyphicon glyphicon-backward"></i>
            </button> <!-- TODO: Abgängig vom 'step' wird von max zu min gegangen -> Änderung des Sliders mit CSS transition -->
            <button>
                <i class="glyphicon glyphicon-play"></i>
            </button> <!-- TODO: Start der transition vs stop -> Änderung des Symbols sollte mit einer CSS transition versehen werden -->
            <button>
                <i class="glyphicon glyphicon-forward"></i>
            </button> <!-- TODO: Abgängig vom 'step' wird von min zu max gegangen -> Änderung des Sliders mit CSS transition -->
        </fieldset>
        <!-- TODO: Add proper labels -->
        <input
            class="timeSlider-currentTime"
            placeholder="Aktuelles Jahr"
            value="1970"
            aria-label="Current Time"
        > <!-- TODO: Initial ausm Dienst, dann immer aktuell halten durch computed Wert -->
        <!-- TODO: Falls der Wert durch eine Nutzereingabe geändert wird, muss dieser zunächst validiert werden -> Doch v-model? -->
        <input
            class="timeSlider-rangeSlider"
            type="range"
            min="0"
            max="100"
            aria-label="slide time"
        >
        <!-- TODO: Falls ein Wert, der nicht in der Liste ausgewählt (egal ob über input oder über range slider), dann wird zum nächsten Wert gerunden und ein Tooltip angezeigt mit der Info -->
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
    }
}
</style>
