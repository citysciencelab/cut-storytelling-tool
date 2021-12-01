<script>
export default {
    name: "SnippetSlider"
};
</script>

<template>
    <div>
        <label for="slider">slider: </label>
        <input
            type="range"
            min="1"
            max="100"
            value="50"
        >
    </div>
</template>

<style lang="less" scoped>
    @import "~/css/mixins.less";
    input {
        box-sizing: border-box;
        outline: 0;
        position: relative;
        width: 100%;
    }
</style>
