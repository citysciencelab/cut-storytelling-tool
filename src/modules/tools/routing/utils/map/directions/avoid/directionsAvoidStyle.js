import {Circle, Fill, Stroke, Style} from "ol/style.js";
import stateRouting from "../../../../store/stateRouting";

/**
 * Creates Direction Avoid Areas Style
 * @returns {ol/Style} style
 */
export default function createDirectionsAvoidAreasStyle () {
    const styleSetting = stateRouting.directionsSettings.styleAvoidAreas;

    return new Style({
        fill: new Fill({
            color: [...styleSetting.fillColor, styleSetting.opacity]
        }),
        stroke: new Stroke({
            color: [...styleSetting.lineColor, 1.0],
            width: styleSetting.lineWidth
        }),
        image: new Circle({
            radius: styleSetting.pointRadius,
            stroke: new Stroke({
                color: [...styleSetting.lineColor, 1.0],
                width: styleSetting.pointLineWidth
            }),
            fill: new Fill({
                color: [...styleSetting.fillColor, styleSetting.opacity]
            })
        })
    });
}
