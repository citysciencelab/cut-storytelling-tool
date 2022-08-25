import VectorSource from "ol/source/Vector.js";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";

export default new VectorSource({
    features: [
        new Feature({
            geometry: new LineString([]),
            isHighlight: false
        }),
        new Feature({
            geometry: new LineString([]),
            isHighlight: true
        })
    ]
});
