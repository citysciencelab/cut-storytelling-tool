import isochronesPointSource from "./isochronesPointSource";
import isochronesPointStyle from "./isochronesPointStyle";
import VectorLayer from "ol/layer/Vector.js";

export default new VectorLayer({
    source: isochronesPointSource,
    style: isochronesPointStyle,
    name: "isochrones_point_layer",
    alwaysOnTop: true
});
