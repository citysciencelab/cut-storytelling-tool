import {Snap} from "ol/interaction.js";
import directionsWaypointsSource from "./directionsWaypointsSource";

export default new Snap({source: directionsWaypointsSource});
