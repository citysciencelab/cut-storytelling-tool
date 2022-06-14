import Feature from "ol/Feature";
import {Icon, Style} from "ol/style";
import Point from "ol/geom/Point";
import calculateCenterOfExtent from "../../calculateCenterOfExtent";
import {isUrl} from "../../urlHelper";

/**
 * @param {Feature[]} features Features, which center coordinates should be styled.
 * @param {string} styleId Id of the styleModel.
 * @see {@link https://community.cesium.com/t/cors-and-billboard-image/3920/2} crossOrigin: "anonymous", is necessary for the 3D mode.
 * @returns {Feature[]} Styled features.
 */
export default function (features, styleId) {
    return features
        .map(feature => calculateCenterOfExtent(feature.getGeometry().getExtent()))
        .map((centerCoordinates, index) => new Feature({
            geometry: new Point(centerCoordinates),
            name: `featureIcon${index}`
        }))
        .map(feature => {
            let style;

            if (isUrl(styleId)) {
                console.warn("zoomTo: The usage of the configuration parameter 'imgLink' will be deprecated in v3.0.0. Please use 'styleId' instead.");
                style = new Style({
                    image: new Icon({
                        crossOrigin: "anonymous",
                        anchor: [0.5, 24],
                        anchorXUnits: "fraction",
                        anchorYUnits: "pixels",
                        src: styleId,
                        scale: 2
                    })
                });
            }
            else {
                const styleModel = Radio.request("StyleList", "returnModelById", styleId);

                style = styleModel === undefined
                    ? new Style()
                    : styleModel.createStyle(feature, false);
            }

            feature.setStyle(style);
            return feature;
        });
}
