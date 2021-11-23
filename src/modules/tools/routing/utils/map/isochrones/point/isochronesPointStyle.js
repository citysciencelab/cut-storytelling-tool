import {Circle, Fill, Stroke, Style} from "ol/style.js";
import stateRouting from "../../../../store/stateRouting";

/**
 * Creates Isochrones Point Style
 * @param {ol/Feature} feature for the current style
 * @returns {ol/Style} style
 */
export default function createIsochronesPointStyle () {
    const styleSetting = stateRouting.isochronesSettings.styleCenter;

    return new Style({
        image: new Circle({
            radius: styleSetting.radius,
            stroke: new Stroke({
                color: [...styleSetting.lineColor, 1.0],
                width: styleSetting.lineWidth
            }),
            fill: new Fill({
                color: [...styleSetting.fillColor, styleSetting.opacity]
            })
        })
    });
}
