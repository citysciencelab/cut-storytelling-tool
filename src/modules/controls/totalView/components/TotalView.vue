<script>
import {mapGetters, mapActions} from "vuex";
import ControlIcon from "../../ControlIcon.vue";
import TableStyleControl from "../../TableStyleControl.vue";

/**
 * TotalView adds a control that lets the user reset the
 * view's state to the initial zoom and center coordinates.
 */
export default {
    name: "TotalView",
    props: {
        /** icon name for the control icon */
        icon: {
            type: String,
            default: "skip-backward-fill"
        },
        /** icon name for the control icon in style table */
        tableIcon: {
            type: String,
            default: "house-door-fill"
        }
    },
    computed: {
        ...mapGetters(["uiStyle"]),
        ...mapGetters("Maps", ["initialCenter", "initialZoomLevel", "center", "zoom"]),

        component () {
            return this.uiStyle === "TABLE" ? TableStyleControl : ControlIcon;
        },
        iconToUse () {
            return this.uiStyle === "TABLE" ? this.tableIcon : this.icon;
        },
        /**
         * Map was moved.
         * @returns {Boolean} true if map is not in initial zoom/center.
         */
        mapMoved () {
            if (this.center) {
                return this.initialCenter[0] !== Math.round(this.center[0]) ||
                    this.initialCenter[1] !== Math.round(this.center[1]) ||
                    this.initialZoomLevel !== this.zoom;
            }
            return false;
        }
    },
    methods: {
        ...mapActions("Maps", ["resetView"]),

        startResetView: function () {
            this.resetView();
        }
    }
};
</script>

<template>
    <div class="back-forward-buttons">
        <component
            :is="component"
            id="start-totalview"
            class="total-view-button"
            :title="$t('common:modules.controls.totalView.titleButton')"
            :disabled="!mapMoved"
            :icon-name="iconToUse"
            :on-click="startResetView"
        />
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
</style>
