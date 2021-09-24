<script>
export default {
    name: "RoutingBatchProcessingCheckbox",
    props: {
        batchProcessing: {
            type: Object,
            required: true
        }
    }
};
</script>

<template>
    <label class="pointer mb-0 d-flex">
        <input
            v-model="batchProcessing.active"
            class="mt-0 d-flex flex-column align-self-center"
            type="checkbox"
        />
        <span class="ml-2">
            {{ $t('common:modules.tools.routing.batchProcessing.header') }}
        </span>
    </label>
</template>

<style scoped>
.pointer {
    cursor: pointer;
}

.mt-0 {
    margin-top: 0;
}
.mb-0 {
    margin-bottom: 0;
}

.ml-2 {
    margin-left: 0.5rem;
}

.d-flex {
    display: flex;
}

.flex-column {
    flex-direction: column;
}

.align-self-center {
    align-self: center;
}
</style>
