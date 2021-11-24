<script>
import {mapGetters, mapMutations} from "vuex";
import ControlIcon from "../../ControlIcon.vue";
import mapCollection from "../../../../core/dataStorage/mapCollection";

/**
 * The BackForward control element allows stepping back
 * and forth through view states regarding zoom and center.
 */
export default {
    name: "BackForward",
    components: {
        ControlIcon
    },
    props: {
        /** glyphicon name of the forward button */
        glyphiconFor: {
            type: String,
            default: "glyphicon-step-forward"
        },
        /** glyphicon name of the backward button */
        glyphiconBack: {
            type: String,
            default: "glyphicon-step-backward"
        }
    },
    computed: {
        ...mapGetters("controls/backForward", ["forthAvailable", "backAvailable"]),
        ...mapGetters("Map", ["mapId", "mapMode"])
    },
    mounted () {
        mapCollection.getMap(this.mapId, this.mapMode).on("moveend", this.memorizeMap);
    },
    beforeDestroy () {
        mapCollection.getMap(this.mapId, this.mapMode).un("moveend", this.memorizeMap);
    },
    methods: {
        ...mapMutations(
            "controls/backForward",
            ["forward", "backward", "memorize"]
        ),
        memorizeMap () {
            this.memorize(mapCollection.getMap(this.mapId, this.mapMode).getView());
        },
        moveForward () {
            this.forward(mapCollection.getMap(this.mapId, this.mapMode));
        },
        moveBackward () {
            this.backward(mapCollection.getMap(this.mapId, this.mapMode));
        }
    }
};
</script>

<template>
    <div class="back-forward-buttons">
        <ControlIcon
            class="forward"
            :title="$t(`common:modules.controls.backForward.stepForward`)"
            :disabled="!forthAvailable"
            :icon-name="glyphiconFor"
            :on-click="moveForward"
        />
        <ControlIcon
            class="backward"
            :title="$t(`common:modules.controls.backForward.stepBackward`)"
            :disabled="!backAvailable"
            :icon-name="glyphiconBack"
            :on-click="moveBackward"
        />
    </div>
</template>

<style lang="less" scoped>
</style>
