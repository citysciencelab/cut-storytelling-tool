import {Draw} from "ol/interaction.js";
import isochronesPointStyle from "./isochronesPointStyle";
import isochronesPointSource from "./isochronesPointSource";

export default new Draw({
    source: isochronesPointSource,
    type: "Point",
    style: isochronesPointStyle
    // allow only left click
    // condition: e => e.pointerEvent.buttons === 1
});
