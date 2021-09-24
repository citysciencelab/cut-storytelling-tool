<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import mutations from "../../store/directions/mutationsDirections";
import RoutingBatchProcessing from "../RoutingBatchProcessing.vue";
import {RoutingTaskHandler} from "../../utils/classes/routing-task-handler";

export default {
    name: "DirectionsBatchProcessing",
    components: {
        RoutingBatchProcessing
    },
    props: {
        settings: {
            type: Object,
            required: true
        }
    },
    data: function () {
        return {
            isProcessing: false,
            countFailed: 0
        };
    },
    computed: {
        ...mapGetters("Tools/Routing", ["taskHandler"])
    },
    methods: {
        ...mapMutations("Tools/Routing/Directions", Object.keys(mutations)),
        ...mapMutations("Tools/Routing", ["setTaskHandler"]),
        ...mapActions("Tools/Routing/Directions", ["fetchDirections", "resetRoutingDirectionsResults"]),
        ...mapActions("Alerting", ["addSingleAlert"]),
        addFiles (files) {
            files.forEach(file => {
                const reader = new FileReader();

                reader.onload = async f => {
                    this.isProcessing = true;
                    this.setTaskHandler(null);
                    this.countFailed = 0;

                    this.resetRoutingDirectionsResults();

                    try {
                        this.setIsLoadingDirections(true);
                        const result = await this.parseCsv(f.target.result);

                        if (result) {
                            this.downloadResults(file.name, result);
                        }
                        this.setIsLoadingDirections(false);
                        if (this.countFailed !== 0) {
                            this.addSingleAlert({
                                category: i18next.t("common:modules.alerting.categories.error"),
                                content: i18next.t("common:modules.tools.routing.directions.batchProcessing.errorSomeFailed", {countFailed: this.coundFailed})
                            });
                        }
                    }
                    catch (e) {
                        this.addSingleAlert({
                            category: i18next.t("common:modules.alerting.categories.error"),
                            content: e.message
                        });
                    }

                    this.countFailed = 0;
                    this.isProcessing = false;
                    this.setTaskHandler(null);
                };

                reader.readAsText(file);
            });
        },
        async downloadResults (filename, downloadObjects) {
            const csv = Object.keys(downloadObjects[0]).join(";") + "\n" + downloadObjects.map(obj => Object.values(obj).join(";")).join("\n"),
                downloadFilename = this.createDownloadFilename(filename);

            if (Radio.request("Util", "isInternetExplorer")) {
                window.navigator.msSaveOrOpenBlob(new Blob([csv]), downloadFilename);
            }
            else {
                const url = `data:text/plain;charset=utf-8,${encodeURIComponent(csv)}`,
                    a = document.createElement("a");

                a.href = url;
                a.download = downloadFilename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        },
        createDownloadFilename (filename) {
            const parts = filename.split("."),
                partsOhneExtension = parts.slice(0, parts.length - 1);

            return partsOhneExtension.join(".") + ".csv";
        },
        parseCsv (filecontent) {
            return new Promise(async (resolve, reject) => {

                const content = filecontent.replace(/[\r]/g, "").trim(),
                    lines = content.split("\n"),
                    anzahl = lines.length,
                    tasks = [];

                if (content.length === 0 || anzahl === 0) {
                    reject(i18next.t("common:modules.tools.routing.directions.batchProcessing.errorNoEntries"));
                }
                if (anzahl > this.settings.batchProcessing.limit) {
                    reject(i18next.t("common:modules.tools.routing.directions.batchProcessing.errorToManyEntriesInFile", {limit: this.settings.batchProcessing.limit}));
                }

                for (let i = 0; i < anzahl; i++) {
                    const line = lines[i],
                        lineParts = line.split(";");

                    if (lineParts.length === 0) {
                        continue;
                    }

                    if (lineParts.length !== 5) {
                        reject(i18next.t("common:modules.tools.routing.directions.batchProcessing.errorToManyEntriesInRow", {row: i}));
                    }

                    if (!this.isNumber(Number(lineParts[1])) || !this.isNumber(Number(lineParts[2])) || !this.isNumber(Number(lineParts[3])) || !this.isNumber(Number(lineParts[4]))) {
                        reject(i18next.t("common:modules.tools.routing.directions.batchProcessing.errorRowContainsEntriesNoNumber", {row: i}));
                    }

                    tasks.push(() => this.parseLineParts(lineParts));
                }
                this.setTaskHandler(new RoutingTaskHandler(
                    tasks,
                    this.settings.batchProcessing.maximumConcurrentRequests,
                    (allResults, newResult) => allResults.push(newResult),
                    (results) => resolve(results)
                ));
            });
        },
        async parseLineParts (lineParts) {
            const id = lineParts[0],
                startLon = Number(lineParts[1]),
                startLat = Number(lineParts[2]),
                endeLon = Number(lineParts[3]),
                endeLat = Number(lineParts[4]),
                result = {
                    ID: id,
                    "X-Wert_Start": startLon,
                    "Y-Wert_Start": startLat,
                    "X-Wert_End": endeLon,
                    "Y-Wert_End": endeLat,
                    "Zeit(min)": null,
                    "Entfernung(m)": null,
                    Profil: this.settings.speedProfile
                };

            try {
                const directionsResult = await this.fetchDirections({
                    wgs84Coords: [
                        [startLon, startLat],
                        [endeLon, endeLat]
                    ],
                    instructions: false
                });

                result["Entfernung(m)"] = directionsResult.distance.toFixed(2);
                result["Zeit(min)"] = (directionsResult.duration / 60).toFixed(2);
            }
            catch (error) {
                this.countFailed = this.countFailed + 1;
            }
            return result;
        },
        isNumber (num) {
            return !isNaN(num) && typeof num === "number";
        }
    }
};
</script>

<template>
    <RoutingBatchProcessing
        :settings="settings"
        :progress="taskHandler ? taskHandler.progress : 0"
        :isProcessing="isProcessing"
        :strukturText="$t('common:modules.tools.routing.directions.batchProcessing.structure')"
        beispielText="1;8.12;50.67;9.12;51.67"
        @filesadded="addFiles($event)"
        @cancelProcess="taskHandler.cancelRun()"
    ></RoutingBatchProcessing>
</template>
