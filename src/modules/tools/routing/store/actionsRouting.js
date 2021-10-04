import {
    fetchRoutingNominatimGeosearch,
    fetchRoutingNominatimGeosearchReverse
} from "../utils/geosearch/routing-nominatim-geosearch";
import {getMapProjection, transform} from "masterportalAPI/src/crs";
import {fetchRoutingBkgGeosearch, fetchRoutingBkgGeosearchReverse} from "../utils/geosearch/routing-bkg-geosearch";
import * as constantsRouting from "./constantsRouting";
import i18next from "i18next";

export default {
    /**
     * Called when the routing tool is created.
     * @param {Object} context actions context object.
     * @returns {void}
     */
    async initRouting ({dispatch}) {
        await dispatch("checkNonOptionalConfigFields");
    },

    /**
     * Checks all non optional config fileds in the config.json.
     * @param {Object} context actions context object.
     * @returns {void}
     */
    checkNonOptionalConfigFields ({rootState}) {
        // Needs to use rootState because state does not contain values from config.json on the initial load
        const state = rootState.configJson.Portalconfig.menu.tools.children.routing,
            checkPaths = constantsRouting.nonOptionalConfigFields.map(field => field.split(".")),
            missing = checkPaths.filter(path => {
                const val = path.reduce((partObj, partPath) => {
                    return partObj[partPath];
                }, state);

                return val === undefined || val === null;
            });

        if (missing.length > 0) {
            throw new Error("Routing ist nicht korrekt konfiguriert. Folgende Felder fehlen: " + missing.map(m => m.join(".")).join(", "));
        }
    },
    /**
     * Async fetch Coordinates by text.
     * @param {Object} context actions context object.
     * @param {String} search searching text.
     * @returns {RoutingGeosearchResult[]} Returns parsed Array of RoutingGeosearchResults.
     */
    async fetchCoordinatesByText ({state, dispatch}, {search}) {
        let geosearchResults = [];

        if (search.length < state.geosearch.minChars) {
            return geosearchResults;
        }
        try {
            // Possible to change Geosearch by changing function depending on config
            if (state.geosearch.type === "NOMINATIM") {
                geosearchResults = await fetchRoutingNominatimGeosearch(search);
            }
            else if (state.geosearch.type === "BKG") {
                geosearchResults = await fetchRoutingBkgGeosearch(search);
            }
            else {
                throw new Error("Geosearch ist nicht korrekt konfiguriert");
            }

            // Transform WGS84 Coordinates to Local Projection
            geosearchResults.forEach(async geosearchResult => {
                const coordinatesLocal = await dispatch(
                    "Tools/Routing/transformCoordinatesWgs84ToLocalProjection",
                    [geosearchResult.getLng(), geosearchResult.getLat()],
                    {root: true}
                );

                geosearchResult.setCoordinates(coordinatesLocal);
            });
        }
        catch (err) {
            dispatch("Alerting/addSingleAlert", {
                category: this.$t("common:modules.alerting.categories.error"),
                content: i18next.$t("common:modules.tools.routing.errors.header")
            }, {root: true});
        }
        return geosearchResults;
    },

    /**
     * Async fetch Text by Coordinates.
     * @param {Object} context actions context object.
     * @param {[Number, Number]} coordinates LonLat Coordinates.
     * @returns {RoutingGeosearchResult} Returns parsed Array of RoutingGeosearchResults.
     */
    async fetchTextByCoordinates ({state, dispatch}, {coordinates}) {
        let geosearchResult = null;

        try {
            // Possible to change Geosearch by changing function depending on config
            if (state.geosearch.type === "NOMINATIM") {
                geosearchResult = await fetchRoutingNominatimGeosearchReverse(
                    coordinates
                );
            }
            else if (state.geosearch.type === "BKG") {
                geosearchResult = await fetchRoutingBkgGeosearchReverse(coordinates);
            }
            else {
                throw new Error("Geosearch ist nicht korrekt konfiguriert");
            }

            // Transform WGS84 Coordinates to Local Projection
            const coordinatesLocal = await dispatch(
                "Tools/Routing/transformCoordinatesWgs84ToLocalProjection",
                [geosearchResult.getLng(), geosearchResult.getLat()],
                {root: true}
            );

            geosearchResult.setCoordinates(coordinatesLocal);
        }
        catch (err) {
            // dispatch("Alerting/addSingleAlert", {
            //     category: i18next.t("common:modules.alerting.categories.error"),
            //     content: "Fehler bei Abfrage der Adresse"
            // }, {root: true});
        }
        return geosearchResult;
    },

    /**
     * Transforms the given coordinates from the local projection to the wgs84 projections
     * @param {Object} context actions context object.
     * @param {[Number, Number]} coordinates to project
     * @returns {[Number, Number]} projected wgs84 coordinates
     */
    transformCoordinatesLocalToWgs84Projection ({rootGetters}, coordinates) {
        return transform(
            getMapProjection(rootGetters["Map/map"]),
            "EPSG:4326",
            coordinates
        );
    },
    /**
     * Transforms the given coordinates from the wgs84 projection to the local projections
     * @param {Object} context actions context object.
     * @param {[Number, Number]} coordinates to project
     * @returns {[Number, Number]} projected local coordinates
     */
    transformCoordinatesWgs84ToLocalProjection ({rootGetters}, coordinates) {
        return transform(
            "EPSG:4326",
            getMapProjection(rootGetters["Map/map"]),
            coordinates
        );
    }
};
