<template>
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :initial-width="initialWidth"
        :initial-width-mobile="initialWidthMobile"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody />
    </ToolTemplate>
</template>

<script>
import ToolTemplate from "../../ToolTemplate.vue";
export default {
    name: "WfsTransaction",
    components: {ToolTemplate}
};
</script>

<style scoped>

</style>
