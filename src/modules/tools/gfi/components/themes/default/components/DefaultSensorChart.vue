<script>
import {
    getQueryLink,
    getObservations,
    convertObservationsToLinechart
} from "../../../../utils/staTools.js";
import Linechart from "../../../../../../../share-components/charts/components/Linechart.vue";

export default {
    name: "DefaultSensorChart",
    components: {
        Linechart
    },
    props: {
        type: {
            type: String,
            required: false,
            default: ""
        },
        label: {
            type: String,
            required: false,
            default: ""
        },
        query: {
            type: String,
            required: false,
            default: ""
        },
        format: {
            type: String,
            required: false,
            default: ""
        },
        staObject: {
            type: Object,
            required: false,
            default: null
        },
        options: {
            type: Object,
            required: false,
            default: null
        },
        chartOptions: {
            type: Object,
            required: false,
            default: null
        }
    },
    data: () => {
        return {
            linechartData: null,
            linechartDataOptions: {}
        };
    },
    watch: {
        staObject (newVal) {
            if (newVal) {
                this.linechartData = null;
                this.initChart();
            }
        }
    },
    mounted () {
        if (this.staObject) {
            this.linechartData = null;
            this.initChart();
        }
    },
    methods: {
        initChart () {
            const url = getQueryLink(this.staObject["@iot.selfLink"], this.query);

            this.linechartDataOptions = Object.assign({
                legend: {
                    display: false
                }
            }, this.chartOptions);

            getObservations(url, observations => {
                // onsuccess
                const label = this.label ? this.label : this.staObject.name;

                this.linechartData = convertObservationsToLinechart(observations, label, this.format, this.options);
            }, () => {
                // onstart
            }, () => {
                // oncomplete
            }, error => {
                // onerror
                console.error(error);
            });
        }
    }
};
</script>

<template>
    <div>
        <Linechart
            v-if="linechartData"
            :given-options="linechartDataOptions"
            :data="linechartData"
        />
    </div>
</template>


<style lang="less" scoped>
</style>
