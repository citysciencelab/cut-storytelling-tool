<script>
export default {
    name: "SnippetInput"
};
</script>

<template>
    <div>
        <label for="input">Input: </label>
        <input
            id="input"
            type="text"
            name="input"
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
