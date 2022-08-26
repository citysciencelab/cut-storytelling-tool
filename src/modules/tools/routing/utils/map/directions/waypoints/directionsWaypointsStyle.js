import {Circle, Fill, Stroke, Style, Text} from "ol/style.js";
import stateRouting from "../../../../store/stateRouting";
/**
 * Creates Direction Waypoint Style
 * @param {ol/Feature} feature for the current style
 * @returns {ol/Style} style
 */
export default function createDirectionsWaypointStyle (feature) {
    const styleSetting = stateRouting.directionsSettings.styleWaypoint,
        routingId = feature.get("routingId");

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
        }),
        text: routingId === undefined
            ? null
            : new Text({
                textAlign: "center",
                textBaseline: "middle",
                text: String(routingId + 1),
                fill: new Fill({
                    color: styleSetting.textFillColor
                }),
                stroke: new Stroke({
                    color: styleSetting.textLineColor,
                    width: styleSetting.textLineWidth
                })
            })
    });
    // };
}
