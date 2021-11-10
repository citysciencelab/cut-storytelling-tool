import {Stroke, Style} from "ol/style.js";
import stateRouting from "../../../../store/stateRouting";

/**
 * Creates Direction Route Style Function
 * @param {ol/Feature} feature for the current style
 * @returns {ol/Style} style function
 */
export default function createDirectionsRouteStyle (feature) {
    const styleSetting = stateRouting.directionsSettings.styleRoute,
        isHighlight = feature.get("isHighlight");

    if (isHighlight) {
        return new Style({
            stroke: new Stroke({
                color: [...styleSetting.partHighlightColor, 1.0],
                width: styleSetting.partHighlightWidth
            })
        });
    }

    return [
        new Style({
            stroke: new Stroke({
                color: [...styleSetting.highlightColor, 1.0],
                width: styleSetting.highlightWidth
            })
        }),
        new Style({
            stroke: new Stroke({
                color: [...styleSetting.fillColor, 1.0],
                width: styleSetting.width
            })
        })
    ];
}
