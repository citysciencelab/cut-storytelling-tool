import {RoutingWaypoint} from "../../utils/classes/routing-waypoint";

import isochronesPointSource from "../../utils/map/isochrones/point/isochronesPointSource";
import isochronesPointLayer from "../../utils/map/isochrones/point/isochronesPointLayer";
import isochronesPointDrawInteraction from "../../utils/map/isochrones/point/isochronesPointDraw";
import isochronesPointModifyInteraction from "../../utils/map/isochrones/point/isochronesPointModify";
import isochronesPointSnapInteraction from "../../utils/map/isochrones/point/isochronesPointSnap";

import isochronesAreaSource from "../../utils/map/isochrones/area/isochronesAreaSource";
import isochronesAreaLayer from "../../utils/map/isochrones/area/isochronesAreaLayer";

import stateRouting from "../stateRouting";

export default {
    isochronesPointSource,
    isochronesPointLayer,
    isochronesPointDrawInteraction,
    isochronesPointModifyInteraction,
    isochronesPointSnapInteraction,
    isochronesAreaSource,
    isochronesAreaLayer,
    mapListenerAdded: false,
    waypoint: new RoutingWaypoint({
        index: 0,
        source: isochronesPointSource
    }),
    // Routing Isochrones Result
    routingIsochrones: null,
    isLoadingIsochrones: false,
    routingAvoidFeaturesOptions: [],

    settings: stateRouting.isochronesSettings
};
