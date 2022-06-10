<script>
export default {
    name: "RoutingLoadingSpinner"
};
</script>

<template>
    <div class="spinner" />
</template>

<style lang="scss" scoped>
@import "~variables";

.spinner {
    display: inline-block;
    height: 20px;
    width: 20px;

    border: 3px solid $light_grey;

    animation: loaderSpinAnimation 1s 0.1s ease-in-out infinite both;
    border-radius: 50%;
    border-top-color: $dark_grey;
    content: "";
    transition: border-color 0.25s;
}

</style>
