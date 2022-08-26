import directionsWaypointsSource from "./directionsWaypointsSource";
import directionsWaypointsStyle from "./directionsWaypointsStyle";
import VectorLayer from "ol/layer/Vector.js";

export default new VectorLayer({
    source: directionsWaypointsSource,
    style: directionsWaypointsStyle,
    name: "directions_waypoints_layer",
    alwaysOnTop: true
});
