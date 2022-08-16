<script>
import moment from "moment";
import {
    downloadBlobPerNavigator,
    downloadBlobPerHTML5
} from "../utils/exportButtonUtils.js";

export default {
    name: "ExportButtonGeoJSON",
    props: {
        title: {
            type: String,
            required: false,
            default: "common:button.download"
        },
        data: {
            type: String,
            required: false,
            default: ""
        },
        filename: {
            type: [String, Boolean],
            required: false,
            default: false
        },
        postfixFormat: {
            type: String,
            required: false,
            default: "_YYYY-MM-DD_HH-mm-ss"
        }
    },
    data () {
        return {
            downloadDisabled: false
        };
    },
    methods: {
        /**
         * enables the button
         * @post the button is enabled
         * @returns {void}
         */
        enableDownload () {
            this.downloadDisabled = false;
        },
        /**
         * disables the button
         * @post the button is disabled
         * @returns {void}
         */
        disableDownload () {
            this.downloadDisabled = true;
        },
        /**
         * enables the button after a short timeout (for better ui)
         * @post the button is enabled after a short timeout
         * @returns {void}
         */
        enableDownloadAfterTimeout () {
            setTimeout(() => {
                this.downloadDisabled = false;
            }, 2200);
        },
        /**
         * handles the given error message according to portal standards
         * @post the error message is processed
         * @param {String} msg the error message to use on the console (alert uses standard from translation)
         * @returns {void}
         */
        handleDownloadError (msg) {
            console.warn(msg);
            this.$store.dispatch("Alerting/addSingleAlert", i18next.t("common:modules.exportButton.error.download"));
        },
        /**
         * triggers the download based on the given props
         * @post the download has been triggered or an error is processed
         * @returns {void}
         */
        download () {
            if (this.downloadDisabled) {
                return;
            }
            const filename = typeof this.filename === "string" ? this.createFilename(this.filename, this.postfixFormat) : false;

            this.disableDownload();

            if (typeof this.data === "string") {
                this.createFile(new Blob([this.data], {type: "application/json;"}), filename);
            }
            else {
                this.handleDownloadError("ExportButtonGeoJSON: no data, handler or url was given to download something");
                this.enableDownload();
            }
        },
        /**
         * Creates a file based on given blob.
         * @param {Blob} blob the blob to create the file on
         * @param {String} fileName the file name
         * @returns {void}
         */
        createFile (blob, fileName) {
            const succeed = downloadBlobPerNavigator(blob, fileName);

            if (!succeed) {
                downloadBlobPerHTML5(blob, fileName);
            }

            this.enableDownloadAfterTimeout();
        },
        /**
         * creates a filename using the given prefix and postfixFormat
         * @param {String} prefix the prefix to begin the filename with
         * @param {String} postfixFormat the format to hand over to moment to create the end of the filename with
         * @returns {String} a concatination of prefix and postfixFormat
         */
        createFilename (prefix, postfixFormat) {
            if (postfixFormat) {
                return String(prefix) + moment().format(String(postfixFormat));
            }
            return String(prefix);
        }
    }
};
</script>

<template>
    <button
        v-if="!downloadDisabled"
        type="button"
        class="btn btn-primary exportButton"
        @click="download()"
    >
        <span
            id="bootstrap-icon"
            class="bootstrap-icon"
        >
            <i class="bi-cloud-arrow-down-fill" />
        </span>
        {{ $t(title) }}
    </button>
    <button
        v-else
        type="button"
        class="btn btn-primary exportButton"
        disabled
    >
        <span
            id="bootstrap-icon"
            class="bootstrap-icon spin-animation"
        >
            <i class="bi-cloud-arrow-down-fill" />
        </span>
        {{ $t(title) }}
    </button>
</template>

<style lang="scss" scoped>
    @keyframes exportButtonLoaderSpinAnimation {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .exportButton {
        outline:none;
    }
    .exportButton > .spin-animation {
        animation: exportButtonLoaderSpinAnimation 1s 0.1s ease-in-out infinite both;
    }
    .exportButton > .bi-cloud-arrow-down-fill {
        margin-right: 5px;
    }
</style>
