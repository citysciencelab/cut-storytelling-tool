<script>
import {mapActions, mapGetters} from "vuex";
import actions from "../store/actionsMouseHover";

export default {
    name: "MouseHover",
    computed: {
        ...mapGetters("Map", ["ol2DMap"])
    },
    mounted () {
        this.$nextTick(function () {
            this.initialize(this.ol2DMap);
        });
    },
    methods: {
        ...mapActions("MouseHover", Object.keys(actions))
    }
};

</script>

<template>
    <div class="MouseHover">
        <!-- nothing -->
    </div>
</template>
