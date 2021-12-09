<script>
export default {
    name: "SnippetDropdown"
};
</script>

<template>
    <div>
        <label for="selecbox">Choose an Option: </label>

        <select id="selectbox">
            <option
                value="option1"
                selected
            >
                option1
            </option>
            <option value="option2">
                option2
            </option>
            <option value="option3">
                option3
            </option>
            <option value="option4">
                option4
            </option>
        </select>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    select {
        box-sizing: border-box;
        outline: 0;
        position: relative;
        width: 100%;
    }
</style>
