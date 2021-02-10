<script>
import Tool from "../../Tool.vue";

export default {
    name: "WfsSearch",
    components: {
        Tool
    }
};
</script>

<template>
    <Tool
        :title="$t(name)"
        :icon="glyphicon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivateGFI="deactivateGFI"
    >
    </Tool>
</template>

<style lang="less" scoped>
@import "~variables";
</style>
