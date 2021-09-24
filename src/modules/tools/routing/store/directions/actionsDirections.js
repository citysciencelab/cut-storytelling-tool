import {RoutingWaypoint} from "../../utils/classes/routing-waypoint";
import {fetchRoutingOrsDirections} from "../../utils/directions/routing-ors-directions";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";

export default {
    /**
     * Finds the Route for the current waypoints.
     * @param {Object} context actions context object.
     * @returns {void}
     */
    async findDirections ({state, getters, commit, dispatch, rootGetters}) {
        if (getters.directionsCoordinates.length < 2) {
            return;
        }
        const {waypoints, directionsRouteSource} = state,
            map = rootGetters["Map/map"],
            wgs84Coords = await dispatch("getDirectionsCoordinatesWgs84"),
            lineStringFeature = await dispatch("getRouteFeature");

        commit("setIsLoadingDirections", true);
        await dispatch("resetRoutingDirectionsResults");

        try {
            const result = await dispatch("fetchDirections", {wgs84Coords: wgs84Coords, instructions: true});

            if (JSON.stringify(wgs84Coords) !== JSON.stringify(await dispatch("getDirectionsCoordinatesWgs84"))) {
                return;
            }

            lineStringFeature
                .getGeometry()
                .setCoordinates(result.getLineString());
            waypoints.forEach((waypoint, index) => {
                waypoint.setIndexDirectionsLineString(
                    result.getLineStringWaypointIndex()[index]
                );
            });
            map.getView().fit(directionsRouteSource.getExtent());
            commit("setRoutingDirections", result);
        }
        catch (err) {
            dispatch("Alerting/addSingleAlert", {
                category: i18next.t("common:modules.alerting.categories.error"),
                content: err.message
            }, {root: true});
        }
        commit("setIsLoadingDirections", false);
    },

    async resetRoutingDirectionsResults ({dispatch, commit}) {
        const lineStringFeature = await dispatch("getRouteFeature");

        commit("setRoutingDirections", null);
        lineStringFeature
            .getGeometry()
            .setCoordinates([]);
    },

    async fetchDirections ({state, getters, dispatch}, {wgs84Coords, instructions}) {
        const {settings} = state,
            {selectedAvoidSpeedProfileOptions} = getters,
            avoidPolygons = await dispatch("getAvoidPolygonsWgs84");

        if (settings.type === "ORS") {
            return fetchRoutingOrsDirections({
                coordinates: wgs84Coords,
                language: i18next.language,
                transformCoordinatesToLocal: coordinates => dispatch(
                    "Tools/Routing/transformCoordinatesWgs84ToLocalProjection",
                    coordinates,
                    {root: true}
                ),
                speedProfile: settings.speedProfile,
                avoidSpeedProfileOptions: selectedAvoidSpeedProfileOptions,
                preference: settings.preference,
                avoidPolygons: avoidPolygons,
                instructions: instructions
            });
        }
        throw new Error("fetchDirections Type ist nicht korrekt konfiguriert");
    },

    getRouteFeature ({state}) {
        const {directionsRouteSource} = state;

        return directionsRouteSource.getFeatures().find(feature => !feature.get("isHighlight"));
    },

    getHighlightFeature ({state}) {
        const {directionsRouteSource} = state;

        return directionsRouteSource.getFeatures().find(feature => feature.get("isHighlight"));
    },

    async unHighlightRoute ({dispatch}) {
        const highlightFeature = await dispatch("getHighlightFeature");

        highlightFeature.getGeometry().setCoordinates([]);
    },

    async highlightRoute ({dispatch, state}, {vonWaypointIndex, bisWaypointIndex, coordsIndex}) {
        const {waypoints} = state,
            routeFeature = await dispatch("getRouteFeature"),
            highlightFeature = await dispatch("getHighlightFeature"),
            lineIndex = coordsIndex ? coordsIndex.slice(0) : [
                waypoints[vonWaypointIndex].getIndexDirectionsLineString(),
                waypoints[bisWaypointIndex].getIndexDirectionsLineString()
            ];

        highlightFeature.getGeometry().setCoordinates(
            routeFeature.getGeometry().getCoordinates().slice(...lineIndex)
        );
    },

    async zoomToRoute ({dispatch, state, rootGetters}, {vonWaypointIndex, bisWaypointIndex, coordsIndex}) {
        const {waypoints} = state,
            map = rootGetters["Map/map"],
            routeFeature = await dispatch("getRouteFeature"),
            lineIndex = coordsIndex ? coordsIndex.slice(0) : [
                waypoints[vonWaypointIndex].getIndexDirectionsLineString(),
                waypoints[bisWaypointIndex].getIndexDirectionsLineString()
            ],
            linestringFeature = new Feature({
                geometry: new LineString(routeFeature.getGeometry().getCoordinates().slice(...lineIndex))
            });

        map.getView().fit(linestringFeature.getGeometry().getExtent());
    },

    async getDirectionsCoordinatesWgs84 ({getters, dispatch}) {
        const coordinates = [];

        for (const coords of getters.directionsCoordinates) {
            coordinates.push(
                await dispatch(
                    "Tools/Routing/transformCoordinatesLocalToWgs84Projection",
                    coords,
                    {root: true}
                )
            );
        }
        return coordinates;
    },

    async getAvoidPolygonsWgs84 ({state, dispatch}) {
        const {directionsAvoidSource} = state,
            sourceFeatures = directionsAvoidSource.getFeatures(),
            polygonFeature = {type: "MultiPolygon", coordinates: []};

        for (const sourceFeature of sourceFeatures) {
            const sourceCoordinates = sourceFeature.getGeometry().getCoordinates(),
                wgsPolygon = [];

            for (const coordinates of sourceCoordinates) {
                const wgsCoordinates = [];

                for (const coordinate of coordinates) {
                    wgsCoordinates.push(
                        await dispatch(
                            "Tools/Routing/transformCoordinatesLocalToWgs84Projection",
                            coordinate,
                            {root: true}
                        )
                    );
                }
                wgsPolygon.push(wgsCoordinates);
            }
            polygonFeature.coordinates.push(wgsPolygon);
        }
        return polygonFeature;
    },

    initDirections ({rootGetters, state, dispatch, commit}) {
        const {
                directionsWaypointsLayer,
                directionsRouteLayer,
                directionsAvoidLayer,
                directionsWaypointsDrawInteraction,
                directionsAvoidDrawInteraction,
                directionsAvoidSelectInteraction,
                mapListenerAdded
            } = state,
            map = rootGetters["Map/map"];

        dispatch("initWaypoints");

        if (!mapListenerAdded) {
            directionsWaypointsDrawInteraction.on("drawend", event => dispatch("onDirectionsWaypointsDrawEnd", event)
            );
            directionsAvoidDrawInteraction.on("drawend", event => dispatch("onDirectionsAvoidDrawEnd", event)
            );
            directionsAvoidSelectInteraction.on("select", event => dispatch("onDirectionsAvoidSelect", event));
            dispatch("createDirectionsWaypointsModifyInteractionListener");
            dispatch("createDirectionsAvoidModifyInteractionListener");
            dispatch("createDirectionsRouteModifyInteractionListener");
            commit("setMapListenerAdded", true);
        }

        map.addLayer(directionsRouteLayer);
        map.addLayer(directionsWaypointsLayer);
        map.addLayer(directionsAvoidLayer);

        dispatch("createInteractionFromKartenmodus");
    },

    createInteractionFromKartenmodus ({state, dispatch}) {
        const {kartenmodus} = state;

        if (kartenmodus === "WAYPOINTS") {
            dispatch("createDirectionsWaypointsDrawInteraction");
        }
        else if (kartenmodus === "AVOID_AREAS") {
            dispatch("createDirectionsAvoidDrawInteraction");
        }
        else if (kartenmodus === "DELETE_AVOID_AREAS") {
            dispatch("createDirectionsAvoidSelectInteraction");
        }
    },

    closeDirections ({rootGetters, state, dispatch}) {
        const {directionsWaypointsLayer, directionsRouteLayer, directionsAvoidLayer} = state,

            map = rootGetters["Map/map"];

        map.removeLayer(directionsRouteLayer);
        map.removeLayer(directionsWaypointsLayer);
        map.removeLayer(directionsAvoidLayer);

        dispatch("removeMapInteractions");
    },

    createDirectionsWaypointsModifyInteractionListener ({state, dispatch}) {
        const {directionsWaypointsModifyInteraction} = state;

        let changedFeature;

        directionsWaypointsModifyInteraction.on("modifystart", event => {
            event.features.getArray().forEach(feature => {
                feature.getGeometry().once("change", () => {
                    changedFeature = feature;
                });
            });
        });

        directionsWaypointsModifyInteraction.on("modifyend", async () => {
            const {waypoints} = state,
                waypoint = waypoints[changedFeature.get("routingId")],
                coordinates = await dispatch(
                    "Tools/Routing/transformCoordinatesLocalToWgs84Projection",
                    changedFeature.getGeometry().getCoordinates(),
                    {root: true}
                ),
                geoSearchResult = await dispatch(
                    "Tools/Routing/fetchTextByCoordinates",
                    {
                        coordinates
                    },
                    {root: true}
                );

            waypoint.setDisplayName(
                geoSearchResult ? geoSearchResult.getDisplayName() : null
            );
            dispatch("findDirections");
        });
    },

    createDirectionsAvoidModifyInteractionListener ({state, dispatch}) {
        const {directionsAvoidModifyInteraction} = state;

        directionsAvoidModifyInteraction.on("modifyend", async () => {

            dispatch("findDirections");
        });
    },

    // returns number or undefined
    findWaypointBetweenLineStringIndex ({state}, {lineStringIndex}) {
        const {waypoints} = state;

        for (let i = 0; i < waypoints.length; i++) {
            const waypoint = waypoints[i],
                nextWaypoint = waypoints[i + 1];

            if (
                !nextWaypoint ||
                waypoint.getIndexDirectionsLineString() === null ||
                nextWaypoint.getIndexDirectionsLineString() === null
            ) {
                break;
            }
            if (
                lineStringIndex >= waypoint.getIndexDirectionsLineString() &&
                lineStringIndex < nextWaypoint.getIndexDirectionsLineString()
            ) {
                return i;
            }
        }
        return null;
    },

    createDirectionsRouteModifyInteractionListener ({
        state,
        dispatch
    }) {
        const {directionsRouteModifyInteraction} = state;

        directionsRouteModifyInteraction.on("modifyend", async event => {
            const {routingDirections} = state,
                newCoordinates = event.features
                    .getArray()[0]
                    .getGeometry()
                    .getCoordinates(),
                oldLineString = routingDirections.getLineString();

            for (let i = 0; i < oldLineString.length; i++) {
                if (
                    oldLineString[i][0] === newCoordinates[i][0] &&
                    oldLineString[i][1] === newCoordinates[i][1]
                ) {
                    continue;
                }
                const newCoordinate = newCoordinates[i],
                    nextIndex = await dispatch(
                        "findWaypointBetweenLineStringIndex",
                        {
                            lineStringIndex: i
                        }
                    ),
                    waypoint = await dispatch("addWaypoint", {
                        index: nextIndex + 1
                    }),
                    wgs84Coordinates = await dispatch(
                        "Tools/Routing/transformCoordinatesLocalToWgs84Projection",
                        newCoordinate,
                        {root: true}
                    ),
                    geoSearchResult = await dispatch(
                        "Tools/Routing/fetchTextByCoordinates",
                        {
                            coordinates: wgs84Coordinates
                        },
                        {root: true}
                    );

                waypoint.setCoordinates(newCoordinate);
                waypoint.setDisplayName(geoSearchResult.getDisplayName());
                break;
            }
            dispatch("findDirections");
        });
    },

    /**
     * Adds a new Waypoint to the Array.
     * @param {Object} state the state of searchByCoord-module
     * @param {Object} payload payload object.
     * @returns {RoutingWaypoint} added waypoint
     */
    addWaypoint ({state}, {index, feature, displayName}) {
        let waypointIndex = index;

        if (!index && index !== 0) {
            waypointIndex = state.waypoints.length;
        }
        if (feature) {
            // If feature is set the call comes from the map and we try to find a
            // waypoint without coordinates first before adding it
            const waypointWithoutCoordinates = state.waypoints.find(
                waypoint => waypoint.getCoordinates().length === 0
            );

            if (waypointWithoutCoordinates) {
                waypointWithoutCoordinates.setCoordinates(
                    feature.getGeometry().getCoordinates()
                );
                if (displayName) {
                    waypointWithoutCoordinates.setDisplayName(displayName);
                }
                // Drawend is called before feature is added to directionsWaypointsSource
                // We delete the drawn Feature and only copy the Coordinates
                setTimeout(() => {
                    state.directionsWaypointsSource.removeFeature(feature);
                });
                return waypointWithoutCoordinates;
            }
        }
        const waypoint = new RoutingWaypoint({
            index: waypointIndex,
            feature,
            displayName,
            source: state.directionsWaypointsSource
        });

        state.waypoints.splice(waypointIndex, 0, waypoint);
        // Fix Index on Waypoints after new Waypoint
        for (let i = waypointIndex + 1; i < state.waypoints.length; i++) {
            state.waypoints[i].setIndex(i);
        }
        return waypoint;
    },
    removeWaypoint ({state, dispatch, commit}, {index, reload = false}) {
        const {waypoints, directionsWaypointsSource, directionsRouteSource} = state;

        if (waypoints.length === 2) {
            waypoints[index].reset();
            directionsRouteSource.getFeatures().forEach(feature => feature.getGeometry().setCoordinates([]));
            commit("setRoutingDirections", null);
            return;
        }
        if (waypoints[index].addedToSource) {
            directionsWaypointsSource.removeFeature(waypoints[index].getFeature());
        }
        for (let i = index; i < waypoints.length; i++) {
            waypoints[i].setIndex(waypoints[i].getIndex() - 1);
        }
        waypoints.splice(index, 1);
        if (reload) {
            dispatch("findDirections");
        }
    },
    moveWaypointDown ({state, dispatch}, index) {
        const {waypoints} = state,
            newIndex = index + 1,
            waypoint = waypoints[index],
            waypointUnder = waypoints[newIndex];

        if (index < 0 || newIndex >= waypoints.length) {
            return;
        }

        waypoints.splice(index, 2, waypoints[newIndex], waypoints[index]);
        waypoint.setIndex(newIndex);
        waypointUnder.setIndex(index);
        dispatch("findDirections");
    },
    moveWaypointUp ({state, dispatch}, index) {
        const {waypoints} = state,
            newIndex = index - 1,
            waypoint = waypoints[index],
            waypointUnder = waypoints[newIndex];

        if (index < 0 || newIndex === waypoints.length) {
            return;
        }

        waypoints.splice(newIndex, 2, waypoints[index], waypoints[newIndex]);
        waypoint.setIndex(newIndex);
        waypointUnder.setIndex(index);
        dispatch("findDirections");
    },

    /**
     * Initializes the Waypoint Array with the minimum Waypoints.
     * @param {Object} context actions context object.
     * @returns {void}
     */
    initWaypoints ({dispatch, state}) {
        for (let i = state.waypoints.length; i < 2; i++) {
            dispatch("addWaypoint", {index: i});
        }
    },

    /**
     * Executed when User clicks on the Map to add a Waypoint
     * @param {Object} context actions context object.
     * @param {Object} event OL OnDrawEvent.
     * @returns {void}
     */
    async onDirectionsWaypointsDrawEnd ({dispatch}, event) {
        const coordinates = await dispatch(
                "Tools/Routing/transformCoordinatesLocalToWgs84Projection",
                event.feature.getGeometry().getCoordinates(),
                {root: true}
            ),
            geoSearchResult = await dispatch(
                "Tools/Routing/fetchTextByCoordinates",
                {
                    coordinates
                },
                {root: true}
            );

        await dispatch("addWaypoint", {
            feature: event.feature,
            displayName: geoSearchResult
                ? geoSearchResult.getDisplayName()
                : null
        });
        dispatch("findDirections");
    },

    /**
     * Executed when User adds a new polygon to avoid on the Map
     * @param {Object} context actions context object.
     * @param {Object} event OL OnDrawEvent.
     * @returns {void}
     */
    async onDirectionsAvoidDrawEnd ({dispatch}) {
        // OpenLayers calls drawend before the feature is added to the source so we wait one interation
        setTimeout(() => dispatch("findDirections"), 0);
    },
    /**
     * Executed when User adds a new polygon to avoid on the Map
     * @param {Object} context actions context object.
     * @param {Object} event OL OnSelectEvent.
     * @returns {void}
     */
    onDirectionsAvoidSelect ({state, dispatch}, event) {
        const {directionsAvoidSource} = state;

        for (const feature of event.selected) {
            directionsAvoidSource.removeFeature(feature);
        }
        setTimeout(() => dispatch("findDirections"), 0);
    },

    /**
     * Creates a new draw interaction depending on state to either draw
     * lines or polygons. The method will first remove any prior draw
     * interaction created by this tool.
     * @returns {void}
     */
    createDirectionsWaypointsDrawInteraction ({state, dispatch, rootGetters}) {
        dispatch("removeMapInteractions");
        const {
                directionsWaypointsModifyInteraction,
                directionsWaypointsSnapInteraction,
                directionsWaypointsDrawInteraction,
                directionsRouteModifyInteraction,
                directionsRouteSnapInteraction
            } = state,

            map = rootGetters["Map/map"];

        map.addInteraction(directionsRouteModifyInteraction);
        map.addInteraction(directionsRouteSnapInteraction);

        map.addInteraction(directionsWaypointsDrawInteraction);
        map.addInteraction(directionsWaypointsModifyInteraction);
        map.addInteraction(directionsWaypointsSnapInteraction);
    },
    /**
     * Removes the draw interaction. This includes aborting any current
     * unfinished drawing, removing the interaction from the map, and
     * removing the interaction from the store.
     * @returns {void}
     */
    removeDirectionsWaypointsDrawInteraction ({state, rootGetters}) {
        const {
                directionsWaypointsDrawInteraction,
                directionsWaypointsModifyInteraction,
                directionsWaypointsSnapInteraction,
                directionsRouteModifyInteraction,
                directionsRouteSnapInteraction
            } = state,

            map = rootGetters["Map/map"];

        directionsWaypointsDrawInteraction.abortDrawing();

        map.removeInteraction(directionsRouteModifyInteraction);
        map.removeInteraction(directionsRouteSnapInteraction);

        map.removeInteraction(directionsWaypointsDrawInteraction);
        map.removeInteraction(directionsWaypointsModifyInteraction);
        map.removeInteraction(directionsWaypointsSnapInteraction);
    },

    /**
     * Creates a new draw interaction for polygons to avoid.
     * @returns {void}
     */
    createDirectionsAvoidDrawInteraction ({state, dispatch, rootGetters}) {
        dispatch("removeMapInteractions");
        const {
                directionsAvoidModifyInteraction,
                directionsAvoidSnapInteraction,
                directionsAvoidDrawInteraction
            } = state,

            map = rootGetters["Map/map"];

        map.addInteraction(directionsAvoidDrawInteraction);
        map.addInteraction(directionsAvoidModifyInteraction);
        map.addInteraction(directionsAvoidSnapInteraction);
    },
    /**
     * Removes the draw interaction for polygons to avoid.
     * @returns {void}
     */
    removeDirectionsAvoidDrawInteraction ({state, rootGetters}) {
        const {
                directionsAvoidModifyInteraction,
                directionsAvoidSnapInteraction,
                directionsAvoidDrawInteraction
            } = state,

            map = rootGetters["Map/map"];

        directionsAvoidDrawInteraction.abortDrawing();

        map.removeInteraction(directionsAvoidModifyInteraction);
        map.removeInteraction(directionsAvoidSnapInteraction);
        map.removeInteraction(directionsAvoidDrawInteraction);
    },

    /**
     * Creates a new select interaction to delete avoid areas.
     * @returns {void}
     */
    createDirectionsAvoidSelectInteraction ({state, dispatch, rootGetters}) {
        dispatch("removeMapInteractions");
        const {directionsAvoidSelectInteraction} = state,

            map = rootGetters["Map/map"];

        map.addInteraction(directionsAvoidSelectInteraction);
    },
    /**
     * Removes the select interaction for deletion of avoid areas.
     * @returns {void}
     */
    removeDirectionsAvoidSelectInteraction ({state, rootGetters}) {
        const {directionsAvoidSelectInteraction} = state,

            map = rootGetters["Map/map"];

        map.removeInteraction(directionsAvoidSelectInteraction);
    },
    /**
     * Removes the directions interactions.
     * @returns {void}
     */
    removeMapInteractions ({dispatch}) {
        dispatch("removeDirectionsWaypointsDrawInteraction");
        dispatch("removeDirectionsAvoidDrawInteraction");
        dispatch("removeDirectionsAvoidSelectInteraction");
    }
};
