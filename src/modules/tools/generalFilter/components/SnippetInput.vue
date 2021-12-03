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

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    input {
        box-sizing: border-box;
        outline: 0;
        position: relative;
        width: 100%;
    }
</style>
