import directionsWaypointsSource from "../../utils/map/directions/waypoints/directionsWaypointsSource";
import directionsWaypointsLayer from "../../utils/map/directions/waypoints/directionsWaypointsLayer";
import directionsWaypointsModifyInteraction from "../../utils/map/directions/waypoints/directionsWaypointsModify";
import directionsWaypointsSnapInteraction from "../../utils/map/directions/waypoints/directionsWaypointsSnap";
import directionsWaypointsDrawInteraction from "../../utils/map/directions/waypoints/directionsWaypointsDraw";

import directionsRouteSource from "../../utils/map/directions/route/directionsRouteSource";
import directionsRouteLayer from "../../utils/map/directions/route/directionsRouteLayer";
import directionsRouteModifyInteraction from "../../utils/map/directions/route/directionsRouteModify";
import directionsRouteSnapInteraction from "../../utils/map/directions/route/directionsRouteSnap";

import directionsAvoidSource from "../../utils/map/directions/avoid/directionsAvoidSource";
import directionsAvoidLayer from "../../utils/map/directions/avoid/directionsAvoidLayer";
import directionsAvoidModifyInteraction from "../../utils/map/directions/avoid/directionsAvoidModify";
import directionsAvoidSnapInteraction from "../../utils/map/directions/avoid/directionsAvoidSnap";
import directionsAvoidDrawInteraction from "../../utils/map/directions/avoid/directionsAvoidDraw";
import directionsAvoidSelectInteraction from "../../utils/map/directions/avoid/directionsAvoidSelect";

import stateRouting from "../stateRouting";

export default {
    // Map State
    directionsWaypointsSource,
    directionsWaypointsLayer,

    directionsRouteSource,
    directionsRouteLayer,

    directionsAvoidSource,
    directionsAvoidLayer,
    // Draw Parameter
    directionsWaypointsModifyInteraction,
    directionsWaypointsSnapInteraction,
    directionsWaypointsDrawInteraction,

    directionsRouteModifyInteraction,
    directionsRouteSnapInteraction,

    directionsAvoidModifyInteraction,
    directionsAvoidSnapInteraction,
    directionsAvoidDrawInteraction,
    directionsAvoidSelectInteraction,

    // Directions Parameter
    waypoints: [],
    routingAvoidFeaturesOptions: [],
    // Routing Directions Result
    routingDirections: null,
    mapListenerAdded: false,
    isLoadingDirections: false,
    mapInteractionMode: "WAYPOINTS",
    settings: stateRouting.directionsSettings
};
