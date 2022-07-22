/**
 * Gets all visible layers with children from group layers.
 * @param {Object[]} visibleLayers The visible layers.
 * @returns {Object[]} All visible layers.
 */
export function getVisibleLayersWithGroupLayersChildren (visibleLayers) {
    const visibleLayersWithGroupLayersChildren = [];

    visibleLayers.forEach(layer => {
        if (layer.get("layers") && typeof layer.get("layers").getArray === "function") {
            layer.get("layers").getArray().forEach(childLayer => visibleLayersWithGroupLayersChildren.push(childLayer));
        }
        else {
            visibleLayersWithGroupLayersChildren.push(layer);
        }
    });

    return visibleLayersWithGroupLayersChildren;
}

/**
 * Gets the visible wms layer at the current resolution.
 * @param {Number} resolution The current resolution.
 * @returns {Object[]} The visible wms layers.
 */
export function getVisibleWmsLayersAtResolution (resolution) {
    const visibleLayers = mapCollection.getMap("2D").getLayers().getArray().filter(layer => layer.getVisible()),
        visibleLayersWithGroupLayersChildren = getVisibleLayersWithGroupLayersChildren(visibleLayers),
        visibleLayersWms = visibleLayersWithGroupLayersChildren.filter(layer => {
            return (layer.get("typ") === "WMS") && (resolution <= layer.get("maxResolution") && resolution >= layer.get("minResolution"));
        });

    return visibleLayersWms;
}
