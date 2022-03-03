<script>
import {mapActions} from "vuex";
import actions from "../store/actionsMouseHover";

export default {
    name: "MouseHover",
    mounted () {
        this.initialize();
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
