<script>
import {mapActions} from "vuex";
import {createEmpty as createEmptyExtent, extend, getCenter as getCenterExtent} from "ol/extent";
import {isWebLink} from "../../../utils/urlHelper.js";
import {isPhoneNumber, getPhoneNumberAsWebLink} from "../../../utils/isPhoneNumber.js";
import {isEmailAddress} from "../../../utils/isEmailAddress.js";

export default {
    name: "ListItem",
    props: {
        identifier: {
            type: String,
            required: true
        },
        tableHeads: {
            type: Object,
            required: true
        },
        tableData: {
            type: Array,
            required: true
        },
        geometryName: {
            type: String,
            default: ""
        },
        onRowClickCallback: {
            type: Function,
            required: false,
            default: () => { /* noop */ }
        },
        maxZoom: {
            type: Number,
            required: false,
            default: 5
        },
        multiSelect: {
            type: Boolean,
            required: false,
            default: false
        },
        // generates a pagination if resultsPerPage>0 and tableData.length>resultsPerPage
        resultsPerPage: {
            type: Number,
            required: false,
            default: 0
        }
    },
    data: () => ({
        visiblePage: 0,
        selected: new Set(),
        lastInteractedIndex: null
    }),
    computed: {
        visibleTableData () {
            if (this.resultsPerPage <= 0 ||
                this.tableData.length < this.resultsPerPage) {
                return this.tableData;
            }

            return this.tableData.slice(
                this.resultsPerPage * this.visiblePage,
                this.resultsPerPage * (this.visiblePage + 1)
            );
        },
        pageCount () {
            return this.resultsPerPage > 0 && this.tableData.length > this.resultsPerPage
                ? Math.ceil(this.tableData.length / this.resultsPerPage)
                : 1;
        }
    },
    methods: {
        ...mapActions("MapMarker", ["placingPointMarker"]),
        /**
         * @param {Number} index index to toggle in selection set
         * @returns {void}
         */
        toggleSelection (index) {
            this.lastInteractedIndex = index;
            if (this.selected.has(index)) {
                const setWithoutIndex = new Set(this.selected);

                setWithoutIndex.delete(index);
                this.selected = setWithoutIndex;
            }
            else {
                this.selected = new Set([...this.selected, index]);
            }
        },
        /**
         * Executes row click effects. When multiSelect is on, windows-like file
         * selection behaviour is available; that is, holding STRG will toggle a
         * file selection, shift will select a range from the last interacted
         * element, and simply clicking a list item will select it exclusively.
         * @param {String[]} data arbitrary data; may be a feature for setCenter
         * @param {Event} event selection event
         * @returns {void}
         */
        onRowClick (data, event) {
            if (this.multiSelect) {
                const index = this.tableData.findIndex(e => e === data);

                if (event.ctrlKey) {
                    this.toggleSelection(index);
                }
                else if (event.shiftKey) {
                    const selectionList = [],
                        min = Math.min(index, this.lastInteractedIndex),
                        max = Math.max(index, this.lastInteractedIndex);

                    for (let i = min; i <= max; i++) {
                        selectionList.push(i);
                    }

                    this.selected = new Set(selectionList);
                    this.lastInteractedIndex = index;
                }
                else {
                    this.selected = new Set([index]);
                    this.lastInteractedIndex = index;
                }
            }
            else {
                this.zoomToResult(data);
            }
        },
        zoomToResult (data) {
            const zoomData = data
                ? [data]
                : this.tableData.filter((_, i) => this.selected.has(i));

            // if a geometryName is given, the data resembles a zoomable feature
            if (this.geometryName) {
                this.setCenter(zoomData);
            }
            this.onRowClickCallback(zoomData);
        },
        /**
         * Takes the selected coordinates and centers the map to the new position.
         * @param {Array.<String[]>} features clicked feature to zoom to
         * @returns {void}
         */
        setCenter (features) {
            const geometries = features.map(feature => feature.getGeometry()),
                extent = createEmptyExtent();

            for (let i = 0; i < features.length; i++) {
                const pointCoordinate = getCenterExtent(
                    geometries[i].getExtent()
                );

                pointCoordinate.keepPreviousMarker = i !== 0;
                this.placingPointMarker(pointCoordinate);
            }

            for (let i = 0; i < features.length; i++) {
                extend(extent, geometries[i].getExtent());
            }

            Radio.trigger("Map", "zoomToExtent", {
                extent,
                options: {
                    maxZoom: this.maxZoom,
                    padding: [5, 5, 5, 5]
                }
            });
        },
        isWebLink,
        isPhoneNumber,
        getPhoneNumberAsWebLink,
        isEmailAddress,
        removeVerticalBar (value) {
            return typeof value === "string" ? value.replace("|", ", ") : "";
        },
        replaceBoolean (value) {
            if (typeof value === "string") {
                if (value === "true") {
                    return value.replace("true", i18next.t("common:share-components.list.replace.true"));
                }
                if (value === "No") {
                    return value.replace("No", i18next.t("common:share-components.list.replace.No"));
                }
            }
            return "";
        },
        setVisiblePage (index) {
            this.visiblePage = index;
        }
    }
};
</script>

<template>
    <div
        :id="`${identifier}-list`"
    >
        <table class="table table-sm">
            <thead>
                <tr>
                    <th v-if="multiSelect" />
                    <th
                        v-for="([key, title], i) of Object.entries(tableHeads)"
                        :key="key + title + i"
                    >
                        <span>
                            {{ title }}
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody :class="multiSelect ? 'multiSelect' : ''">
                <tr
                    v-for="(data, i) in visibleTableData"
                    :key="data + i"
                    :class="selected.has(i) ? 'bg-primary text-light' : ''"
                    @click="onRowClick(data, $event)"
                >
                    <td
                        v-if="multiSelect"
                    >
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                :aria-label="$t('common:share-components.list.selection')"
                                type="checkbox"
                                value=""
                                :checked="selected.has(i)"
                                @click.stop="toggleSelection(i, $event)"
                            >
                        </div>
                    </td>
                    <td
                        v-for="([key, title], j) of Object.entries(tableHeads)"
                        :key="key + title + j"
                    >
                        <template v-if="key === geometryName">
                            <button
                                type="button"
                                class="btn btn-secondary col-md-12"
                                @click.stop="zoomToResult(data)"
                            >
                                {{ $t("common:share-components.list.zoomToResult") }}
                            </button>
                        </template>
                        <template v-else-if="isWebLink(data.values_[key])">
                            <a
                                :href="data.values_[key]"
                                target="_blank"
                            >{{ data.values_[key] }}</a>
                        </template>
                        <template v-else-if="isPhoneNumber(data.values_[key])">
                            <a :href="getPhoneNumberAsWebLink(data.values_[key])">{{ data.values_[key] }}</a>
                        </template>
                        <template v-else-if="isEmailAddress(data.values_[key])">
                            <a :href="`mailto:${data.values_[key]}`">{{ data.values_[key] }}</a>
                        </template>
                        <template v-else-if="data.values_[key] === 'true' || data.values_[key] === 'No'">
                            {{ replaceBoolean(data.values_[key]) }}
                        </template>
                        <template v-else>
                            {{ removeVerticalBar(data.values_[key]) }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
        <button
            v-if="multiSelect"
            :disabled="!selected.size"
            type="button"
            class="btn btn-secondary col-md-12"
            @click.stop="zoomToResult()"
        >
            {{ $t("common:share-components.list.zoomToResults") }}
        </button>
        <nav
            v-if="pageCount > 1"
            :aria-label="$t('common:share-components.list.pagination')"
        >
            <ul class="pagination">
                <li
                    v-for="(_, index) of Array.from({length: pageCount})"
                    :key="index"
                    class="page-item"
                    @click="setVisiblePage(index)"
                    @keyup.space.stop="setVisiblePage(index)"
                >
                    <a href="#">{{ index + 1 }}</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.btn {
    white-space: nowrap;
}

tbody.multiSelect > tr:hover {
    cursor: pointer;
    background-color: $gray-200;
}

td {
    -moz-user-select: none;
    user-select: none;
}
</style>
