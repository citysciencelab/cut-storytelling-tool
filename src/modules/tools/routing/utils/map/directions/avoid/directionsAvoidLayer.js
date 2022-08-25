import directionsAvoidSource from "./directionsAvoidSource";
import directionsAvoidStyle from "./directionsAvoidStyle";
import VectorLayer from "ol/layer/Vector.js";

export default new VectorLayer({
    source: directionsAvoidSource,
    style: directionsAvoidStyle,
    name: "directions_avoid_layer",
    alwaysOnTop: true
});
