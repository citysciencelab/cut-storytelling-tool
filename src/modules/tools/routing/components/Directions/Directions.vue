<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../../store/directions/gettersDirections";
import actions from "../../store/directions/actionsDirections";
import mutations from "../../store/directions/mutationsDirections";
import RoutingCoordinateInput from "../RoutingCoordinateInput.vue";
import RoutingDistanceDisplay from "../RoutingDistanceDisplay.vue";
import RoutingDurationDisplay from "../RoutingDurationDisplay.vue";
import DirectionsBatchProcessing from "./DirectionsBatchProcessing.vue";
import RoutingBatchProcessingCheckbox from "../RoutingBatchProcessingCheckbox.vue";
import RoutingDownload from "../RoutingDownload.vue";
import RoutingAvoidFeatures from "../RoutingAvoidFeatures.vue";
import RoutingSpeedProfileIcon from "../RoutingSpeedProfileIcon.vue";
import * as constants from "../../store/directions/constantsDirections";
import * as constantsRouting from "../../store/constantsRouting";

export default {
    name: "Directions",
    components: {
        RoutingCoordinateInput,
        RoutingDistanceDisplay,
        RoutingDurationDisplay,
        RoutingDownload,
        DirectionsBatchProcessing,
        RoutingBatchProcessingCheckbox,
        RoutingAvoidFeatures,
        RoutingSpeedProfileIcon
    },
    data () {
        return {
            constants,
            constantsRouting
        };
    },
    computed: {
        ...mapGetters("Tools/Routing/Directions", Object.keys(getters)),
        isKartenmodusSperrflaecheBearbeiten () {
            return this.kartenmodus === "AVOID_AREAS";
        },
        isKartenmodusSperrflaecheLoeschen () {
            return this.kartenmodus === "DELETE_AVOID_AREAS";
        }
    },
    async created () {
        this.initDirections();
    },
    beforeDestroy () {
        this.closeDirections();
    },
    methods: {
        ...mapMutations("Tools/Routing/Directions", Object.keys(mutations)),
        ...mapActions("Tools/Routing/Directions", Object.keys(actions)),

        changeSpeedProfile (speedProfileId) {
            this.settings.speedProfile = speedProfileId;
            this.findDirections();
        },

        changePreference (preferenceId) {
            this.settings.preference = preferenceId;
            this.findDirections();
        },

        changeSperrflaecheBearbeitenKartenmodus () {
            if (this.kartenmodus === "AVOID_AREAS") {
                this.setKartenmodus("WAYPOINTS");
            }
            else {
                this.setKartenmodus("AVOID_AREAS");
            }
            this.createInteractionFromKartenmodus();
        },

        changeSperrflaecheLoeschenKartenmodus () {
            if (this.kartenmodus === "DELETE_AVOID_AREAS") {
                this.setKartenmodus("WAYPOINTS");
            }
            else {
                this.setKartenmodus("DELETE_AVOID_AREAS");
            }
            this.createInteractionFromKartenmodus();
        },

        reset () {
            for (let i = this.waypoints.length - 1; i >= 0; i--) {
                this.removeWaypoint({index: this.waypoints[i].index});
            }
            this.directionsRouteSource.getFeatures().forEach(feature => feature.getGeometry().setCoordinates([]));
            this.setRoutingDirections(null);
            this.directionsAvoidSource.clear();
        }
    }
};
</script>

<template>
    <div id="routing-directions">
        <RoutingSpeedProfileIcon
            v-for="option in constantsRouting.speedProfileOptions"
            :key="option"
            class="pointer mr-4"
            :speedProfileId="option"
            :fillColor="option === settings.speedProfile ? '#ec0d0d' : '#000000'"
            :tooltip="$t('common:modules.tools.routing.speedprofiles.' + option)"
            @click.native="changeSpeedProfile(option)"
        ></RoutingSpeedProfileIcon>

        <hr />

        <template v-if="settings.batchProcessing.enabled">
            <RoutingBatchProcessingCheckbox :batchProcessing="settings.batchProcessing"></RoutingBatchProcessingCheckbox>

            <hr />
        </template>

        <template v-if="settings.batchProcessing.enabled && settings.batchProcessing.active">
            <DirectionsBatchProcessing :settings="settings"></DirectionsBatchProcessing>
        </template>
        <template v-else>
            <form
                class="form-horizontal"
                role="form"
            >
                <RoutingCoordinateInput
                    v-for="(waypoint, index) of waypoints"
                    :key="index"
                    :countWaypoints="waypoints.length"
                    :waypoint="waypoint"
                    @moveWaypointUp="moveWaypointUp(waypoint.index)"
                    @moveWaypointDown="moveWaypointDown(waypoint.index)"
                    @removeWaypoint="removeWaypoint({index: waypoint.index, reload: true})"
                    @searchResultSelected="findDirections()"
                ></RoutingCoordinateInput>
            </form>

            <div class="d-flex justify-content-between mt-4">
                <div class="d-flex">
                    <span> {{ $t('common:modules.tools.routing.directions.restrictedAreas') }}:</span>

                    <svg
                        class="ml-2 pointer"
                        width="20px"
                        height="20px"
                        viewBox="0 0 30 30"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xml:space="preserve"
                        xmlns:serif="http://www.serif.com/"
                        fill-rule="evenodd"
                        @click="changeSperrflaecheBearbeitenKartenmodus()"
                    >
                        <title>{{ $t('common:modules.tools.routing.directions.editRestrictedAreas') }}</title>
                        <path
                            :fill="isKartenmodusSperrflaecheBearbeiten ? '#f00' : '#000'"
                            d="M3,0c1.656,0 3,1.344 3,3c0,1.656 -1.344,3 -3,3c-1.656,0 -3,-1.344 -3,-3c0,-1.656 1.344,-3 3,-3Zm0,1.5c0.828,0 1.5,0.672 1.5,1.5c0,0.828 -0.672,1.5 -1.5,1.5c-0.828,0 -1.5,-0.672 -1.5,-1.5c0,-0.828 0.672,-1.5 1.5,-1.5Z"
                        />
                        <path
                            :fill="isKartenmodusSperrflaecheBearbeiten ? '#f00' : '#000'"
                            d="M27,4c1.656,0 3,1.344 3,3c0,1.656 -1.344,3 -3,3c-1.656,0 -3,-1.344 -3,-3c0,-1.656 1.344,-3 3,-3Zm0,1.5c0.828,0 1.5,0.672 1.5,1.5c0,0.828 -0.672,1.5 -1.5,1.5c-0.828,0 -1.5,-0.672 -1.5,-1.5c0,-0.828 0.672,-1.5 1.5,-1.5Z"
                        />
                        <path
                            :fill="isKartenmodusSperrflaecheBearbeiten ? '#f00' : '#000'"
                            d="M27,20c1.656,0 3,1.344 3,3c0,1.656 -1.344,3 -3,3c-1.656,0 -3,-1.344 -3,-3c0,-1.656 1.344,-3 3,-3Zm0,1.5c0.828,0 1.5,0.672 1.5,1.5c0,0.828 -0.672,1.5 -1.5,1.5c-0.828,0 -1.5,-0.672 -1.5,-1.5c0,-0.828 0.672,-1.5 1.5,-1.5Z"
                        />
                        <path
                            :fill="isKartenmodusSperrflaecheBearbeiten ? '#f00' : '#000'"
                            d="M3,24c1.656,0 3,1.344 3,3c0,1.656 -1.344,3 -3,3c-1.656,0 -3,-1.344 -3,-3c0,-1.656 1.344,-3 3,-3Zm0,1.5c0.828,0 1.5,0.672 1.5,1.5c0,0.828 -0.672,1.5 -1.5,1.5c-0.828,0 -1.5,-0.672 -1.5,-1.5c0,-0.828 0.672,-1.5 1.5,-1.5Z"
                        />
                        <path
                            d="M3,6l0,18"
                            fill="none"
                            :stroke="isKartenmodusSperrflaecheBearbeiten ? '#f00' : '#000'"
                            stroke-width="1px"
                        /><path
                            d="M27,10l0,10"
                            fill="none"
                            :stroke="isKartenmodusSperrflaecheBearbeiten ? '#f00' : '#000'"
                            stroke-width="1px"
                        /><path
                            d="M24,23l-18,4"
                            fill="none"
                            :stroke="isKartenmodusSperrflaecheBearbeiten ? '#f00' : '#000'"
                            stroke-width="1px"
                        /><path
                            d="M24,7l-18,-4"
                            fill="none"
                            :stroke="isKartenmodusSperrflaecheBearbeiten ? '#f00' : '#000'"
                            stroke-width="1px"
                        /></svg>


                    <svg
                        class="ml-2 pointer"
                        width="20px"
                        height="20px"
                        viewBox="0 0 30 30"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        xml:space="preserve"
                        xmlns:serif="http://www.serif.com/"
                        fill-rule="evenodd"
                        @click="changeSperrflaecheLoeschenKartenmodus()"
                    >
                        <title>{{ $t('common:modules.tools.routing.directions.editRestrictedAreas') }}</title>
                        <path
                            :fill="isKartenmodusSperrflaecheLoeschen ? '#f00' : '#000'"
                            d="M3,0c1.656,0 3,1.344 3,3c0,1.656 -1.344,3 -3,3c-1.656,0 -3,-1.344 -3,-3c0,-1.656 1.344,-3 3,-3Zm0,1.5c0.828,0 1.5,0.672 1.5,1.5c0,0.828 -0.672,1.5 -1.5,1.5c-0.828,0 -1.5,-0.672 -1.5,-1.5c0,-0.828 0.672,-1.5 1.5,-1.5Z"
                        />
                        <path
                            :fill="isKartenmodusSperrflaecheLoeschen ? '#f00' : '#000'"
                            d="M27,4c1.656,0 3,1.344 3,3c0,1.656 -1.344,3 -3,3c-1.656,0 -3,-1.344 -3,-3c0,-1.656 1.344,-3 3,-3Zm0,1.5c0.828,0 1.5,0.672 1.5,1.5c0,0.828 -0.672,1.5 -1.5,1.5c-0.828,0 -1.5,-0.672 -1.5,-1.5c0,-0.828 0.672,-1.5 1.5,-1.5Z"
                        />
                        <path
                            :fill="isKartenmodusSperrflaecheLoeschen ? '#f00' : '#000'"
                            d="M27,20c1.656,0 3,1.344 3,3c0,1.656 -1.344,3 -3,3c-1.656,0 -3,-1.344 -3,-3c0,-1.656 1.344,-3 3,-3Zm0,1.5c0.828,0 1.5,0.672 1.5,1.5c0,0.828 -0.672,1.5 -1.5,1.5c-0.828,0 -1.5,-0.672 -1.5,-1.5c0,-0.828 0.672,-1.5 1.5,-1.5Z"
                        />
                        <path
                            :fill="isKartenmodusSperrflaecheLoeschen ? '#f00' : '#000'"
                            d="M3,24c1.656,0 3,1.344 3,3c0,1.656 -1.344,3 -3,3c-1.656,0 -3,-1.344 -3,-3c0,-1.656 1.344,-3 3,-3Zm0,1.5c0.828,0 1.5,0.672 1.5,1.5c0,0.828 -0.672,1.5 -1.5,1.5c-0.828,0 -1.5,-0.672 -1.5,-1.5c0,-0.828 0.672,-1.5 1.5,-1.5Z"
                        />
                        <path
                            d="M3,6l0,18"
                            fill="none"
                            :stroke="isKartenmodusSperrflaecheLoeschen ? '#f00' : '#000'"
                            stroke-width="1px"
                        /><path
                            d="M27,10l0,10"
                            fill="none"
                            :stroke="isKartenmodusSperrflaecheLoeschen ? '#f00' : '#000'"
                            stroke-width="1px"
                        /><path
                            d="M24,23l-18,4"
                            fill="none"
                            :stroke="isKartenmodusSperrflaecheLoeschen ? '#f00' : '#000'"
                            stroke-width="1px"
                        /><path
                            d="M24,7l-18,-4"
                            fill="none"
                            :stroke="isKartenmodusSperrflaecheLoeschen ? '#f00' : '#000'"
                            stroke-width="1px"
                        /><path
                            d="M23.044,19.067l-15.588,-9l-0.5,0.866l15.588,9l0.5,-0.866Z"
                            fill="#f00"
                        /><path
                            d="M22.544,10.067l-15.588,9l0.5,0.866l15.588,-9l-0.5,-0.866Z"
                            fill="#f00"
                        /></svg>
                </div>

                <div class="d-flex">
                    <span
                        class="glyphicon glyphicon-trash pointer ml-4"
                        :title="$t('common:modules.tools.routing.resetSettings')"
                        @click="reset()"
                    />
                    <span
                        class="glyphicon glyphicon-plus pointer ml-4"
                        :title="$t('common:modules.tools.routing.addWaypoint')"
                        @click="addWaypoint({index: waypoints.length -1})"
                    />
                </div>
            </div>
        </template>

        <hr />

        <select
            id="routing-directions-preference"
            class="form-control input-sm"
            @change="changePreference($event.target.value)"
        >
            <option
                v-for="option in constants.preferenceOptions"
                :id="option"
                :key="'routing-directions-preference-' + option"
                :value="option"
                :selected="option === settings.preference"
                :disabled="isInputDisabled"
            >
                {{ $t('common:modules.tools.routing.directions.preference.' + option) }}
            </option>
        </select>

        <hr />

        <RoutingAvoidFeatures
            :settings="settings"
            :activeAvoidFeaturesOptions="routingAvoidFeaturesOptions"
            :disabled="isInputDisabled"
            @input="findDirections()"
        ></RoutingAvoidFeatures>

        <template v-if="!(settings.batchProcessing.enabled && settings.batchProcessing.active)">
            <hr />

            <div v-if="routingDirections">
                <div
                    class="d-flex justify-content-between"
                >
                    <RoutingSpeedProfileIcon
                        :speedProfileId="settings.speedProfile"
                        fillColor="#000000"
                        :tooltip="$t('common:modules.tools.routing.speedprofiles.' + settings.speedProfile)"
                    ></RoutingSpeedProfileIcon>
                    <RoutingDurationDisplay :duration="routingDirections.duration"></RoutingDurationDisplay>
                    <RoutingDistanceDisplay :distance="routingDirections.distance"></RoutingDistanceDisplay>
                </div>

                <hr class="mb-0" />

                <template v-for="(segment, segmentIndex) of routingDirections.segments">
                    <div
                        :key="'segment_header_' + segmentIndex"
                        class="d-flex pointer step pl-2 py-4"
                        @mouseover="highlightRoute({vonWaypointIndex: segmentIndex, bisWaypointIndex: segmentIndex + 1})"
                        @mouseout="unHighlightRoute()"
                    >
                        <div
                            class="d-flex"
                            @click="segment.displayDetails = !segment.displayDetails"
                        >
                            <span>{{ segmentIndex === 0 ? 'A' : segmentIndex }}</span>

                            <b>
                                <span
                                    v-if="segment.displayDetails"
                                    class="pointer glyphicon glyphicon-chevron-down"
                                ></span>
                                <span
                                    v-else
                                    class="pointer glyphicon glyphicon-chevron-right"
                                ></span>
                            </b>
                        </div>

                        <div
                            class="d-flex flex-column ml-2 w-100"
                            @click="zoomToRoute({vonWaypointIndex: segmentIndex, bisWaypointIndex: segmentIndex + 1})"
                        >
                            <b>{{ waypoints[segmentIndex].getDisplayName() }}</b>
                            <div
                                class="d-flex justify-content-between"
                            >
                                <RoutingDurationDisplay :duration="segment.duration"></RoutingDurationDisplay>
                                <RoutingDistanceDisplay :distance="segment.distance"></RoutingDistanceDisplay>
                            </div>
                        </div>
                    </div>

                    <hr
                        :key="'segment_divider_' + segmentIndex"
                        class="m-0"
                    />

                    <div
                        v-if="segment.displayDetails"
                        :key="'segment_content_' + segmentIndex"
                    >
                        <template
                            v-for="(step, stepIndex) of segment.steps"
                        >
                            <div
                                v-if="stepIndex !== segment.steps.length - 1"
                                :key="'segment_' + segmentIndex + '_step_' + stepIndex"
                                class="ml-4 d-flex flex-column"
                                @mouseover="highlightRoute({coordsIndex: step.getWaypoints()})"
                                @mouseout="unHighlightRoute()"
                                @click="zoomToRoute({coordsIndex: step.getWaypoints()})"
                            >
                                <div class="d-flex flex-column pointer step pl-2 py-4">
                                    <span>{{ step.instruction }}</span>
                                    <div
                                        class="d-flex justify-content-between"
                                    >
                                        <RoutingDurationDisplay :duration="step.duration"></RoutingDurationDisplay>
                                        <RoutingDistanceDisplay :distance="step.distance"></RoutingDistanceDisplay>
                                    </div>
                                </div>
                                <hr class="w-100 m-0" />
                            </div>
                        </template>
                    </div>
                </template>

                <div
                    class="d-flex pointer step pl-2 py-4"
                    @mouseover="highlightRoute({
                        coordsIndex: [
                            waypoints[waypoints.length - 1].getIndexDirectionsLineString() - 1,
                            waypoints[waypoints.length - 1].getIndexDirectionsLineString() + 1
                        ]
                    })"
                    @mouseout="unHighlightRoute()"
                    @click="zoomToRoute({
                        coordsIndex: [
                            waypoints[waypoints.length - 1].getIndexDirectionsLineString() - 1,
                            waypoints[waypoints.length - 1].getIndexDirectionsLineString() + 1
                        ]
                    })"
                >
                    <span>B</span>
                    <b class="ml-4">{{ waypoints[waypoints.length - 1].getDisplayName() }}</b>
                </div>

                <hr class="mt-0">

                <RoutingDownload></RoutingDownload>
            </div>
        </template>
    </div>
</template>

<style lang="less" scoped>
@import "~variables";
#routing-directions {
  min-width: 350px;
}
.d-flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}
.justify-content-end {
    justify-content: flex-end;
}
.justify-content-between {
    justify-content: space-between;
}
.align-self-center {
    align-self: center;
}

.m-0 {
    margin-left: 0;
    margin-top: 0;
    margin-right: 0;
    margin-bottom: 0;
}
.mt-0 {
    margin-top: 0;
}
.mb-0 {
    margin-bottom: 0;
}
.mb-2 {
    margin-bottom: 0.5rem;
}

.mr-4 {
    margin-right: 1rem;
}

.ml-2 {
  margin-left: 0.5rem;
}
.ml-4 {
  margin-left: 1rem;
}
.mt-4 {
    margin-top: 1rem;
}
.pointer {
  cursor: pointer;
}

.pl-0 {
    padding-left: 0;
}
.pl-2 {
    padding-left: 0.5rem
}
.pr-0 {
    padding-right: 0;
}
.pt-4 {
    padding-top: 1rem;
}
.pb-4 {
    padding-bottom: 1rem;
}
.py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.w-100 {
    width: 100%;
}

.step {
    border-left: 2px solid transparent;
}
.step:hover {
    border-left: 2px solid rgb(255, 44, 0);
}
</style>
