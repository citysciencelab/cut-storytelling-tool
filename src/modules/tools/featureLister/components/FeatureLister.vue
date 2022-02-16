<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import getters from "../store/gettersFeatureLister";
import actions from "../store/actionsFeatureLister";
import mutations from "../store/mutationsFeatureLister";
import ToolTemplate from "../../ToolTemplate.vue";
import getComponent from "../../../../utils/getComponent";
import VectorLayer from "ol/layer/Vector.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../../../utils/isPhoneNumber.js";
import beautifyKey from "../../../../utils/beautifyKey";
import {isWebLink} from "../../../../utils/urlHelper";
import {isEmailAddress} from "../../../../utils/isEmailAddress";

export default {
    name: "FeatureLister",
    components: {
        ToolTemplate
    },
    computed: {
        ...mapGetters("Tools/FeatureLister", Object.keys(getters)),
        ...mapGetters("Map", [
            "visibleLayerList"
        ]),
        visibleVectorLayers: function () {
            const vectorLayers = [],
                rawVectorLayers = [];

            this.visibleLayerList.forEach(layer => {
                if (layer instanceof VectorLayer && layer.get("typ") === "WFS") { // TODO: Ist es richtig nur auf WFS zu gehen?
                    const layerSource = layer.getSource();

                    vectorLayers.push({name: layer.get("name"), id: layer.get("id"), features: layerSource.getFeatures(), geometryType: layerSource.getFeatures()[0] ? layerSource.getFeatures()[0].getGeometry().getType() : null}); // TODO: Anpassen auf Bike and Ride Parkplätze (geschachtelte Features)
                    rawVectorLayers.push(layer);
                }
            });
            this.setVisibleLayers(rawVectorLayers);
            return vectorLayers;
        }
    },
    created () {
        this.$on("close", this.close);
    },
    methods: {
        ...mapActions("Tools/FeatureLister", Object.keys(actions)),
        ...mapMutations("Tools/FeatureLister", Object.keys(mutations)),
        beautifyKey,
        isWebLink,
        isPhoneNumber,
        getPhoneNumberAsWebLink,
        isEmailAddress,
        removeVerticalBar (value) {
            return value.replaceAll("|", "<br>");
        },
        makeOberstufenprofileBold (value) {
            const oldProfiles = value;
            let newProfiles = "";

            oldProfiles.replaceAll("|", "<br>");

            newProfiles = oldProfiles.split("|").map(teilstring => teilstring.split(";")).map(([first, last]) => [`<b>${first}</b>`, last].join("; ")).join("<br>");

            return newProfiles;
        },
        /**
         * Closes this tool window by setting active to false
         * @returns {void}
         */
        close () {
            this.setActive(false);

            // TODO replace trigger when Menu is migrated
            // set the backbone model to active false for changing css class in menu (menu/desktop/tool/view.toggleIsActiveClass)
            // else the menu-entry for this tool is always highlighted
            const model = getComponent(this.$store.state.Tools.FeatureLister.id);

            if (model) {
                model.set("isActive", false);
            }
            this.resetToThemeChooser();
        }
    }
};
</script>

<template lang="html">
    <ToolTemplate
        id="featureLister"
        :title="$t(name)"
        :icon="glyphicon"
        :active="active"
        :render-to-window="renderToWindow"
        :resizable-window="resizableWindow"
        :deactivate-gfi="deactivateGFI"
    >
        <template #toolBody>
            <ul class="nav nav-tabs featurelist-navtabs">
                <li
                    id="featurelistThemeChooser"
                    class="active featurelist-navtabs-li text-center"
                    role="presentation"
                >
                    <a
                        href="#"
                        @click.prevent="switchToThemes()"
                    >{{ $t("modules.tools.featureLister.chooseTheme") }}</a>
                </li>
                <li
                    id="featurelistFeaturelist"
                    class="featurelist-navtabs-li text-center disabled"
                    role="presentation"
                >
                    <a
                        href="#"
                        @click.prevent="switchToList(layer)"
                    >{{ $t("modules.tools.featureLister.list") }}</a>
                </li>
                <li
                    id="featurelistFeaturedetails"
                    class="featurelist-navtabs-li text-center disabled"
                    role="presentation"
                >
                    <a
                        href="#"
                        @click.prevent="switchToDetails()"
                    >{{ $t("modules.tools.featureLister.details") }}</a>
                </li>
            </ul>
            <div
                v-if="layerListView"
                id="featurelist-themes"
                class="featurelist-themes panel panel-default"
            >
                <div
                    id="featurelist-themes-header"
                    class="panel-heading"
                >
                    {{ $t("modules.tools.featureLister.visibleVectorLayers") }}
                </div>
                <ul
                    v-for="layer in visibleVectorLayers"
                    id="featurelist-themes-ul"
                    :key="'tool-featureLister-' + layer.id"
                    class="nav nav-pills nav-stacked"
                >
                    <li
                        :id="'featurelist-layer-' + layer.id"
                        class="featurelist-themes-li"
                        role="presentation"
                    >
                        <a
                            href="#"
                            @click.prevent="switchToList(layer)"
                        >{{ layer.name }}</a>
                    </li>
                </ul>
            </div>
            <template v-if="featureListView">
                <div
                    id="featurelist-list"
                    class="panel panel-default featurelist-list"
                >
                    <div
                        id="featurelist-list-header"
                        class="panel-heading"
                    >
                        <span>{{ layer.name }}</span>
                    </div>
                    <div
                        class="table-responsive  featurelist-list-table"
                    >
                        <table
                            id="featurelist-list-table"
                            class="table table-striped table-hover table-condensed table-bordered"
                        >
                            <tbody>
                                <tr class="featurelist-list-table-tr">
                                    <th
                                        v-for="(header, index) in getHeaders"
                                        :key="'tool-featureLister-' + index"
                                        class="featurelist-list-table-th"
                                    >
                                        <span class="glyphicon glyphicon-sort-by-alphabet" />
                                        {{ header.value }}
                                    </th>
                                </tr>
                                <tr
                                    v-for="(feature, index) in getFeatureProperties"
                                    :id="index"
                                    :key="'tool-featureLister-' + index"
                                    class="featurelist-list-table-tr"
                                >
                                    <template v-if="index < shownFeatures">
                                        <td
                                            v-for="(property, i) in feature"
                                            :key="'tool-featureLister-' + i"
                                            class="featurelist-list-table-td"
                                        >
                                            {{ property }}
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div
                        class="panel-footer featurelist-list-footer"
                    >
                        <button
                            type="button"
                            class="btn btn-default navbar-btn featurelist-list-button"
                            aria-label="Left Align"
                            :disabled="featureCount <= maxFeatures || shownFeatures === featureCount"
                            @click="showMore()"
                        >
                            <span
                                class="glyphicon glyphicon-import"
                                aria-hidden="true"
                            /> {{ $t("modules.tools.featureLister.more") }}
                        </button>
                        <p
                            class="navbar-text featurelist-list-message"
                        >
                            {{ $t("modules.tools.featureLister.key", {shownFeatures, featureCount}) }}
                        </p>
                    </div>
                </div>
            </template>
            <template v-if="featureDetailView">
                <div
                    id="featurelist-details"
                    class="panel panel-default featurelist-details"
                >
                    <div
                        id="featurelist-details-header"
                        class="panel-heading"
                    >
                        <span> {{ $t("modules.tools.featureLister.detailsOfSelected") }} </span>
                    </div>
                    <ul
                        v-for="(feature, key) in getFeatureDetails"
                        :key="'tool-featureLister-' + key"
                        class="list-group featurelist-details-ul"
                    >
                        <li class="list-group-item featurelist-details-li">
                            <strong>
                                {{ beautifyKey(feature[0]) }}
                            </strong>
                        </li>
                        <li class="list-group-item featurelist-details-li">
                            <p v-if="isWebLink(feature[1])">
                                <a
                                    :href="feature[1]"
                                    target="_blank"
                                >{{ feature[1] }}</a>
                            </p>
                            <p v-else-if="isPhoneNumber(feature[1])">
                                <a :href="getPhoneNumberAsWebLink(feature[1])">{{ feature[1] }}</a>
                            </p>
                            <p v-else-if="isEmailAddress(feature[1])">
                                <a :href="`mailto:${feature[1]}`">{{ feature[1] }}</a>
                            </p>
                            <p
                                v-else-if="typeof feature[1] === 'string' && feature[1].includes(';')"
                            >
                                <span v-html="makeOberstufenprofileBold(feature[1], key)" />
                            </p>
                            <p
                                v-else-if="typeof feature[1] === 'string' && feature[1].includes('|')"
                            >
                                <span v-html="removeVerticalBar(feature[1])" />
                            </p>
                            <p
                                v-else-if="typeof feature[1] === 'string' && feature[1].includes('<br>')"
                            >
                                <span v-html="feature[1]" />
                            </p>
                            <p v-else>
                                {{ feature[1] }}
                            </p>
                        </li>
                    </ul>
                </div>
            </template>
        </template>
    </ToolTemplate>
</template>


<style lang="scss" scoped>
    @import "~/css/mixins.scss";
    $color_1: gray;
$color_2: black;
$color_3: #777;
$color_4: rgb(85, 85, 85);
$background_color_1: rgb(255, 255, 255);

/***** Destop *****/
/***** Mobil *****/
.featurelist-list-table-th {
    cursor: pointer;
    >span {
        float: left;
        width: 15px;
        color: $color_1;
    }
    >.featurelist-list-table-th-sorted {
        color: $color_2;
    }
}
.featurelist-list-button {
    position: relative;
    right: 0px;
}
.featurelist-list-message {
    float: left;
    text-align: center;
    align-items: center;
}
.featurelist-details-li {
    cursor: text;
    a:link {
        color: royalblue;
        text-decoration: underline;
    }
    a:visited {
        color: royalblue;
        text-decoration: underline;
    }
    a:hover {
        color: blue;
        text-decoration: underline;
    }
    a:active {
        color: blue;
        text-decoration: underline;
    }
}
.featurelist-details-ul {
    max-height: 400px;
    overflow: auto;
    cursor: auto;
}
.featurelist-list-table-td {
    height: 15px;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.featurelist-list-table-tr {
    cursor: pointer;
}
.featurelist-details {
    display: block;
    margin-bottom: 0px;
    max-height: 440.15px;
    max-width: 426px;
    overflow: auto;
}
.featurelist-list {
    margin-bottom: 0px;
    display: block;
    max-width: 426px;
    overflow: auto;
}
.featurelist-themes {
    width: 100%;
}
.featurelist-win {
    position: absolute;
    top: 20px;
    left: 20px;
    min-width: 25%;
    margin: 60px 10px 30px 10px;
    display: none;
    background-color: $background_color_1;
    >.featurelist-win-header {
        color: $color_3;
        cursor: move;
    }
    >.featurelist-win-content {
        overflow-y: auto;
        padding: 5px;
    }
}
.featurelist-win-header {
    padding-left: 10px;
    border-bottom: 1px solid rgb(229, 229, 229);
    >.title {
        white-space: nowrap;
        min-width: 250px;
        cursor: move;
        font-size: 14px;
        padding-top: 8px;
        padding-bottom: 5px;
        color: $color_4;
    }
    >.buttons {
        color: $color_4;
        font-size: 14px;
        >span {
            padding: 8px 3px;
            &:hover {
                &:not(.win-icon) {
                    opacity: 0.7;
                    cursor: pointer;
                }
            }
        }
    }
}
.featurelist-win-content {
    >.panel-group {
        padding: 12px;
        margin-bottom: 0;
        .panel {
            margin-top: 8px;
        }
    }
}
.featurelist-heading {
    padding: 8px;
    >.featurelist-title {
        font-size: 12px;
    }
}
.featurelistModal {
    background-color: $background_color_1;
    color: $color_4;
    border-bottom: 1px solid rgb(229, 229, 229);
    padding: 10px;
    >button {
        padding: 4px 0px;
    }
    >h4 {
        >span {
            padding: 0 8px;
        }
    }
}
    .panel-heading {
        background: #f5f5f5;
        color: #333333;
        border-color: #ddd;
        cursor: pointer;
    }
.tdfeaturelist {
    padding: 3px;
    >img {
        max-height: 35px;
    }
}
.panel-featurelist {
    overflow-x: scroll;
    max-height: 300px;
    padding: 8px;
    >p {
        margin: 0;
    }
}
</style>
