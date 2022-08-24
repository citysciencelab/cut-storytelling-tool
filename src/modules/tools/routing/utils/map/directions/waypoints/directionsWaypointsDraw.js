import {Draw} from "ol/interaction.js";
import directionsWaypointsStyle from "./directionsWaypointsStyle";
import directionsWaypointsSource from "./directionsWaypointsSource";

export default new Draw({
    source: directionsWaypointsSource,
    type: "Point",
    style: directionsWaypointsStyle
    // allow only left click
    // condition: e => e.pointerEvent.buttons === 1
});
