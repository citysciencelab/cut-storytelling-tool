<script>
import {mapActions, mapMutations, mapGetters} from "vuex";
import actions from "../store/actionsMouseHover";
import mutations from "../store/mutationsMouseHover";
import getters from "../store/gettersMouseHover";

export default {
    name: "MouseHover",
    computed: {
        ...mapGetters("Map", ["ol2DMap", "visibleLayerList"]),
        ...mapGetters("MouseHover", Object.keys(getters))
    },
    mounted () {
        this.$nextTick(function () {
            this.setVisibleLayerList(this.visibleLayerList);
            this.initialize(this.ol2DMap);
        });
    },
    methods: {
        ...mapActions("MouseHover", Object.keys(actions)),
        ...mapMutations("MouseHover", Object.keys(mutations))
    }
};
</script>

<template>
    <div
        id="mousehover-overlay"
        class="tooltip top in"
        role="tooltip"
    >
        <div
            v-if="infoBox"
            class="tooltip-inner mouseHover in"
        >
            <div
                v-for="(text, x) in infoBox"
                :key="x"
            >
                <span
                    v-for="(info, i) in text"
                    :key="i"
                ><p
                     v-if="i === 0"
                     class="title"
                 >{{ info }}</p>
                    <p
                        v-else
                    >{{ info }}</p>
                </span>
            </div>
            <span
                v-if="pleaseZoom"
                class="info"
            >
                <p>{{ $t("mouseHover.infoText") }}</p>
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~/css/mixins.scss";
$color_1: #777;
$background_color_1: rgb(255, 255, 255);

.tooltip {
    pointer-events: none;
}
.mouseHover {
    font-size: 12px;
    text-align: left;
    max-width: inherit;
    padding: 8px;
    background-color: $background_color_1;
    color: $color_1;
    white-space: pre;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    .title {
        font-size: 14px;
        font-weight: bold;
    }
    .info {
        font-size: 14px;
        font-style: italic;
    }
}
.text {
    padding: 8px;
}

.tooltip.bottom {
    margin-top: 8px;
}
.tooltip.top {
    margin-top: -8px;
}
</style>
