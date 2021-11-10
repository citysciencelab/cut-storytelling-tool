import {Fill, Stroke, Style} from "ol/style.js";
import stateRouting from "../../../../store/stateRouting";

/**
 * Creates Direction Waypoint Style
 * @param {ol/Feature} feature for the current style
 * @returns {ol/Style} style
 */
export default function createIsochronesAreaStyle (feature) {
    const styleSetting = stateRouting.isochronesSettings.styleIsochrones,
        color = feature.get("color");

    // general style
    return new Style({
        fill: new Fill({
            color: [...color, styleSetting.opacity]
        }),
        stroke: new Stroke({
            color: [...color, 1.0],
            width: styleSetting.lineWidth
        })
    });
}
