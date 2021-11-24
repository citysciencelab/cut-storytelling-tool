<script>
export default {
    name: "SnippetButton"
};
</script>

<template>
    <div>
        <input
            type="button"
            :value="$t('button.confirm')"
        >
    </div>
</template>

<style lang="less" scoped>
    @import "~/css/mixins.less";
</style>
