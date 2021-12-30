<script>
export default {
    name: "SnippetCheckbox",
    props: {
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        info: {
            type: String,
            required: false,
            default: ""
        },
        label: {
            type: String,
            required: false,
            default: ""
        },
        operator: {
            type: String,
            required: false,
            default: "EQ"
        },
        prechecked: {
            type: Boolean,
            required: false,
            default: false
        },
        visible: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data () {
        return {
            checked: this.prechecked,
            showInfo: false
        };
    },
    computed: {
        infoText: function () {
            return this.info ? this.info : this.$t("modules.tools.filterGeneral.checkBoxInfo");
        }
    },
    methods: {
        toggleInfo () {
            this.showInfo = !this.showInfo;
        }
    }
};
</script>

<template>
    <div
        v-show="visible"
        class="snippetCheckboxContainer"
    >
        <div class="left">
            <input
                id="checkbox"
                v-model="checked"
                class="snippetCheckbox"
                type="checkbox"
                name="checkbox"
                :disabled="disabled"
            >
            <label for="checkbox">{{ label }} </label>
        </div>
        <div class="right">
            <div class="info-icon">
                <span
                    :class="['glyphicon glyphicon-info-sign', showInfo ? 'opened' : '']"
                    @click="toggleInfo()"
                    @keydown.enter="toggleInfo()"
                >&nbsp;</span>
            </div>
        </div>
        <div
            v-show="showInfo"
            class="bottom"
        >
            <div class="info-text">
                <span>{{ infoText }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    .snippetCheckboxContainer {
        padding: 5px;
        margin-bottom: 10px;
        height: auto;
    }
    .snippetCheckboxContainer .info-icon {
        float: right;
        font-size: 16px;
        color: #ddd;
    }
    .snippetCheckboxContainer .info-icon .opened {
        color: #000;
    }
    .snippetCheckboxContainer .info-icon:hover {
        cursor: pointer;
        color: #a5a09e;
    }
    .snippetCheckboxContainer .info-text {
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 10px;
        padding: 15px 10px;
    }
    .glyphicon-info-sign:before {
        content: "\E086";
    }
    .snippetCheckboxContainer .bottom {
        clear: left;
        width: 100%;
    }
    .snippetCheckboxContainer .left {
        float: left;
        width: 90%;
    }
    .snippetCheckboxContainer .right {
        position: absolute;
        right: 10px;
    }
</style>
