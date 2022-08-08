import StyleModel from "./style.js";
import {Style, Fill, Stroke} from "ol/style.js";
import {drawHatch} from "./polygonStyleHatch";

const PolygonStyleModel = StyleModel.extend(/** @lends PolygonStyleModel.prototype */{
    /**
     * @description Class to create ol.style.Style
     * @class PolygonStyleModel
     * @extends StyleModel
     * @memberof VectorStyle.Style
     * @constructs
     * @property {ol/feature} feature Feature to be styled.
     * @property {object} styles styling properties to overwrite defaults
     * @property {Boolean} isClustered Flag to show if feature is clustered.
     */
    defaults: {
        // for stroke
        "polygonStrokeColor": [0, 0, 0, 1],
        "polygonStrokeWidth": 1,
        "polygonStrokeCap": "round",
        "polygonStrokeJoin": "round",
        "polygonStrokeDash": undefined,
        "polygonStrokeDashOffset": 0,
        "polygonStrokeMiterLimit": 10,
        // for fill
        "polygonFillColor": [10, 200, 100, 0.5],
        "polygonFillHatch": undefined
    },

    initialize: function (feature, styles, isClustered) {
        this.setFeature(feature);
        this.setIsClustered(isClustered);
        this.overwriteStyling(styles);
    },

    /**
     * This function returns a style for each feature.
     * @returns {ol/style} - The created style.
     */
    getStyle: function () {
        const stroke = new Stroke({
                lineCap: this.get("polygonStrokeCap"),
                lineJoin: this.get("polygonStrokeJoin"),
                lineDash: this.get("polygonStrokeDash"),
                lineDashOffset: this.get("polygonStrokeDashOffset"),
                miterLimit: this.get("polygonStrokeMiterLimit"),
                color: this.get("polygonStrokeColor"),
                width: this.get("polygonStrokeWidth")
            }),
            polygonFillColor = this.get("polygonFillColor"),
            polygonFillHatch = this.get("polygonFillHatch"),
            fill = new Fill({color:
                polygonFillHatch
                    ? this.getPolygonFillHatch(polygonFillHatch)
                        .getContext("2d")
                        .fillStyle
                    : polygonFillColor
            });

        return new Style({stroke, fill});
    },

    /**
     * Generates a polygon fill pattern.
     * @param {object} params parameters as defined in style.json.md#Polygon.polygonFillHatch
     * @returns {HTMLCanvasElement} contains polygon fill pattern
     */
    getPolygonFillHatch: function ({
        pattern = "diagonal",
        size = 30,
        lineWidth = 10,
        backgroundColor = [0, 0, 0, 1],
        patternColor = [255, 255, 255, 1]
    }) {
        const canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");

        canvas.width = size;
        canvas.height = size;

        context.fillStyle = `rgba(${backgroundColor.join(",")})`;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.lineWidth = lineWidth;
        context.strokeStyle = `rgba(${patternColor.join(",")})`;

        drawHatch(context, size, pattern);

        context.fillStyle = context.createPattern(canvas, "repeat");

        return canvas;
    },

    rotateContextCenter: function (context, size, degrees = 90) {
        context.translate(0.5 * size, 0.5 * size);
        context.rotate(degrees * (Math.PI / 180));
        context.translate(-0.5 * size, -0.5 * size);
    },

    getPolygonFillHatchLegendDataUrl: function () {
        const originalCanvas = this.getPolygonFillHatch(this.get("polygonFillHatch")),
            strokeColor = this.returnColor(this.get("polygonStrokeColor"), "hex"),
            strokeWidth = parseInt(this.get("polygonStrokeWidth"), 10),
            strokeOpacity = this.get("polygonStrokeColor")[3].toString() || 0,
            legendCanvas = document.createElement("canvas"),
            legendContext = legendCanvas.getContext("2d"),
            halfStroke = strokeWidth / 2,
            doubleStroke = strokeWidth * 2;

        legendCanvas.width = originalCanvas.width + doubleStroke;
        legendCanvas.height = originalCanvas.height + doubleStroke;

        legendContext.drawImage(
            originalCanvas,
            strokeWidth,
            strokeWidth
        );

        legendContext.lineCap = "round";
        legendContext.lineJoin = "round";
        legendContext.strokeStyle = strokeColor;
        legendContext.lineWidth = strokeWidth;
        legendContext.globalAlpha = strokeOpacity;

        legendContext.strokeRect(
            halfStroke,
            halfStroke,
            legendCanvas.width - strokeWidth,
            legendCanvas.height - strokeWidth
        );

        return legendCanvas.toDataURL();
    },

    /**
     * Returns input color to destinated color.
     * possible values for dest are "rgb" and "hex".
     * color has to come as hex (e.g. "#ffffff" || "#fff") or as array (e.g [255,255,255,0]) or as String ("[255,255,255,0]")
     * @param {Number[]|String} color The color to return.
     * @param {String} dest Destination color type.
     * @returns {String|Number[]} - The converted color.
     */
    returnColor: function (color, dest) {
        let src,
            newColor = color,
            pArray = [];

        if (Array.isArray(newColor)) {
            src = "rgb";
        }
        else if (typeof newColor === "string" && newColor.indexOf("#") === 0) {
            src = "hex";
        }
        else if (typeof newColor === "string" && newColor.indexOf("#") === -1) {
            src = "rgb";

            pArray = newColor.replace("[", "").replace("]", "").replace(/ /g, "").split(",");
            newColor = [
                pArray[0], pArray[1], pArray[2], pArray[3]
            ];
        }

        if (src === "hex" && dest === "rgb") {
            newColor = this.hexToRgb(newColor);
        }
        else if (src === "rgb" && dest === "hex") {
            newColor = this.rgbToHex(newColor[0], newColor[1], newColor[2]);
        }

        newColor = dest === "rgb" ? this.normalizeRgbColor(newColor) : newColor;

        return newColor;
    },

    /**
     * Converts hex value to rgbarray.
     * @param {String} hex Color as hex string.
     * @returns {Number[]} - Color als rgb array.
     */
    hexToRgb: function (hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
            hexReplace = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
        let result;

        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        result = result.exec(hexReplace);

        return result ? [parseFloat(result[1], 16), parseFloat(result[2], 16), parseFloat(result[3], 16)] : null;
    },

    /**
     * Converts rgb to hex.
     * @param {Number} r Red value.
     * @param {Number} g Green Value.
     * @param {Number} b Blue value.
     * @returns {String} - Hex color string.
     */
    rgbToHex: function (r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },

    /**
     * Makes sure that one rgb color always consists of four values
     * @param {Number[]} newColor Color in rgb
     * @return {Number[]} normColor
     */
    normalizeRgbColor: function (newColor) {
        const defaultArray = [1, 1, 1, 1];

        return newColor.concat(defaultArray).slice(0, 4);
    },

    /**
     * Converts number to hex string.
     * @param {Number} c Color value as number.
     * @returns {String} - Converted color number as hex string.
     */
    componentToHex: function (c) {
        const hex = Number(c).toString(16);

        return hex.length === 1 ? "0" + hex : hex;
    }
});

export default PolygonStyleModel;
