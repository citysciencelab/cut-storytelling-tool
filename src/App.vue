<script>
import MainNav from "./MainNav.vue";
import MapRegion from "./MapRegion.vue";
// import MapModuleDebug from "./modules/map/components/MapModuleDebug.vue";
import isDevMode from "./utils/isDevMode";
import Footer from "./modules/footer/components/Footer.vue";

export default {
    name: "App",
    components: {
        MainNav,
        MapRegion,
        Footer
        // ,MapModuleDebug
    },
    data: () => ({isDevMode})
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
        <Footer />
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
