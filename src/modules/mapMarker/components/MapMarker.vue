<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "MapMarker",
    computed: {
        ...mapGetters("Map", ["mapId", "mapMode"])
    },
    created () {
        this.setMapId(this.mapId);
        this.setMapMode(this.mapMode);
    },
    mounted () {
        this.initialize();
    },
    methods: {
        ...mapActions("MapMarker", ["initialize", "activateByUrlParam", "placingPointMarker"]),
        ...mapMutations("MapMarker", ["setMapId", "setMapMode"])
    }
};

</script>

<template>
    <div class="MapMarker">
        <!-- nothing -->
    </div>
</template>
