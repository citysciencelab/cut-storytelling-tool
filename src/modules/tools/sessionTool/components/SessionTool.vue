<script>
import ToolTemplate from "../../ToolTemplate.vue";
import getComponent from "../../../../utils/getComponent";
import {mapGetters, mapMutations} from "vuex";
import getters from "../store/gettersSessionTool";
import mutations from "../store/mutationsSessionTool";
import isObject from "../../../../utils/isObject";
import {downloadBlobPerHTML5, downloadBlobPerNavigator} from "../../../../share-components/exportButton/utils/exportButtonUtils.js";
export default {
    name: "SessionTool",
    components: {
        ToolTemplate
    },
    data () {
        return {
            storePath: this.$store.state.Tools.SessionTool,
            fileName: ""
        };
    },
    computed: {
        ...mapGetters("Tools/SessionTool", Object.keys(getters))
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapMutations("Tools/SessionTool", Object.keys(mutations)),
        close () {
            this.setActive(false);
            const model = getComponent(this.storePath.id);

            if (model) {
                model.set("isActive", false);
            }
        },
        /**
         * Upload selected file.
         * @param {Event} event the native upload event
         * @returns {void}
         */
        uploadFile (event) {
            const file = event.target.files.item(0),
                fileReader = new FileReader();

            fileReader.onload = (evt) => {
                let json;

                try {
                    json = JSON.parse(evt.target.result);
                }
                catch (e) {
                    console.warn("Trying to parse given string into a json", json);
                    this.$store.dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.sessionTool.errorOnLoad"));
                }
                if (!isObject(json?.state)) {
                    return;
                }
                this.observer.forEach(({key, setter}) => {
                    if (typeof setter !== "function") {
                        return;
                    }

                    Object.entries(json.state).forEach(([jsonKey, value]) => {
                        if (jsonKey === key) {
                            setter(value);
                        }
                    });
                });
            };

            if (file) {
                fileReader.readAsText(file);
                this.fileName = file?.name ? file.name : "";
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
        },
        /**
         * Downloads a file.
         * @param {Object[]} observer the observer array from state
         * @returns {void}
         */
        downloadFile (observer) {
            const copyObject = {
                state: {}
            };

            observer.forEach(({key, getter}) => {
                if (typeof getter !== "function") {
                    return;
                }
                const result = getter();

                copyObject.state[key] = result;
            });
            this.createFile(new Blob([JSON.stringify(copyObject)], {type: "application/json;"}), "session.masterportal");
        },
        triggerUpload () {
            if (this.$refs.fileInput) {
                this.$refs.fileInput.click();
            }
        }
    }
};
</script>

<template>
    <ToolTemplate
        :title="$t(name)"
        icon="bi-funnel-fill"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <div class="session-tool">
                <div class="card">
                    <div class="card-header">
                        {{ $t('common:modules.tools.sessionTool.uploadHeader') }}
                    </div>
                    <div class="card-body">
                        <input
                            ref="fileInput"
                            class="d-none"
                            :aria-hidden="true"
                            type="file"
                            name="fileUpload"
                            @change="uploadFile"
                        >
                        <input
                            type="button"
                            class="btn btn-primary"
                            :aria-label="$t('common:modules.tools.sessionTool.buttonTextUpload')"
                            :value="$t('common:modules.tools.sessionTool.buttonTextUpload')"
                            @click="triggerUpload()"
                        >
                        <span class="ms-2">{{ fileName }}</span>
                    </div>
                </div>
                <div class="card mt-3">
                    <div class="card-header">
                        {{ $t('common:modules.tools.sessionTool.downloadHeader') }}
                    </div>
                    <div class="card-body">
                        <input
                            class="btn btn-primary"
                            type="button"
                            :value="$t('common:modules.tools.sessionTool.buttonTextDownload')"
                            @click.prevent="downloadFile(observer)"
                        >
                    </div>
                </div>
            </div>
        </template>
    </ToolTemplate>
</template>
