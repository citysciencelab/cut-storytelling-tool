<script>
import {mapActions, mapMutations, mapGetters} from "vuex";
import actions from "../store/actionsMouseHover";
import mutations from "../store/mutationsMouseHover";

export default {
    name: "MouseHover",
    computed: {
        ...mapGetters("Map", ["ol2DMap", "visibleLayerList"])
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
    <div class="MouseHover">
        <!-- nothing -->
    </div>
</template>
