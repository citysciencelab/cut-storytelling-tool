import {getRenderPixel} from "ol/render";

/**
 * Manipulates the width of the target layer according to the position of the layerSwiper.
 *
 * @param {number} mapSize Size of the map.
 * @param {module:ol/render/Event} renderEvent The render event from the target layer.
 * @param {number} width The width of the clipped area.
 * @returns {void}
 */
export default function drawLayer (mapSize, renderEvent, width) {
    const {context} = renderEvent,
        topLeft = getRenderPixel(renderEvent, [width, 0]),
        topRight = getRenderPixel(renderEvent, [mapSize[0], 0]),
        bottomLeft = getRenderPixel(renderEvent, [width, mapSize[1]]),
        bottomRight = getRenderPixel(renderEvent, mapSize);

    // Clip everything that is to the left side of the swiper
    context.save();
    context.beginPath();
    context.moveTo(topLeft[0], topLeft[1]);
    context.lineTo(bottomLeft[0], bottomLeft[1]);
    context.lineTo(bottomRight[0], bottomRight[1]);
    context.lineTo(topRight[0], topRight[1]);
    context.closePath();
    context.clip();
}
