<script>
export default {
    name: "RoutingLoadingSpinner"
};
</script>

<template>
    <div class="spinner" />
</template>

<style scoped>

.spinner {
    display: inline-block;
    height: 20px;
    width: 20px;

    border: 3px solid #AAAAAA;

    animation: loaderSpinAnimation 1s 0.1s ease-in-out infinite both;
    border-radius: 50%;
    border-top-color: #777777;
    content: "";
    transition: border-color 0.25s;
}

</style>
