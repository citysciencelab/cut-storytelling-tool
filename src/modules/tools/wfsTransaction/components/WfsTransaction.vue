<template lang="html">
    <ToolTemplate
        :title="$t(name)"
        :icon="icon"
        :active="active"
    >
        <template #toolBody />
    </ToolTemplate>
</template>

<script>
import ToolTemplate from "../../ToolTemplate.vue";
import {mapGetters} from "vuex";

export default {
    name: "WfsTransaction",
    components: {ToolTemplate},
    computed: {
        ...mapGetters("Tools/WfsTransaction", ["active", "icon", "name"])
    }
};
</script>

<style scoped>

</style>
