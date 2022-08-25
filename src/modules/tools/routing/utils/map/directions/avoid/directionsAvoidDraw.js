import {Draw} from "ol/interaction.js";
import directionsAvoidStyle from "./directionsAvoidStyle";
import directionsAvoidSource from "./directionsAvoidSource";

export default new Draw({
    source: directionsAvoidSource,
    type: "Polygon",
    style: directionsAvoidStyle
    // allow only left click
    // condition: e => e.pointerEvent.buttons === 1
});
