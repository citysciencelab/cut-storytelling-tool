<script>
import MainNav from "./MainNav.vue";
import MapRegion from "./MapRegion.vue";
// import MapModuleDebug from "./modules/map/components/MapModuleDebug.vue";
import isDevMode from "./utils/isDevMode";
import axios from "axios";

export default {
    name: "App",
    components: {
        MainNav,
        MapRegion
        // ,MapModuleDebug
    },
    data: () => ({isDevMode}),
    created () {
        // Add interceptors to show the loader as described here https://github.com/axios/axios#interceptors
        axios.interceptors.request.use(config => {
            Radio.trigger("Util", "showLoader");

            return config;
        }, error => Promise.reject(error));

        axios.interceptors.response.use(response => {
            Radio.trigger("Util", "hideLoader");

            return response;
        }, error => Promise.reject(error));
    }
};
</script>

<template>
    <div
        id="masterportal-container"
        class="masterportal-container"
    >
        <!-- layout at its heart is two elements - navigation bar and map with elements on it -->
        <MainNav />
        <MapRegion class="map-region" />
        <!-- <MapModuleDebug v-if="isDevMode" /> -->

        <!-- keep loader last so it's above it all -->
        <!--
            NOTE currently doesn't work in all browser since vue renders too late;
            after everything goes through vue, this should be usable again
            <Loader />
        -->
    </div>
</template>

<style lang="less" scoped>
    @import "~variables";

    #masterportal-container {
        display: flex;
        flex-direction: column;
        flex-flow: column;

        position: relative;

        height: 100%;
        width: 100%;

        font-family: @font_family_default;
        font-size: @font_size_default;

        .map-region {
            display: flex;
            flex-grow: 1;
            height:calc(100% - 50px);
        }
    }
</style>
