import isochronesAreaSource from "./isochronesAreaSource";
import isochronesAreaStyle from "./isochronesAreaStyle";
import VectorLayer from "ol/layer/Vector.js";

export default new VectorLayer({
    source: isochronesAreaSource,
    style: isochronesAreaStyle,
    name: "isochrones_area_layer",
    alwaysOnTop: true,
    opacity: 0.65
});
