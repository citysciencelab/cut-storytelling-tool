import OverlaySynchronizer from "olcs/OverlaySynchronizer.js";

/**
 * Represents a FixedOverlaySynchronizer.
 */
class FixedOverlaySynchronizer extends OverlaySynchronizer {
    /* eslint-disable no-useless-constructor */
    /**
     * This object takes care of one-directional synchronization of
     * Openlayers WMS raster layers to the given Cesium globe. This Synchronizer
     * assumes that the given WMS supports EPSG Code 4326 (WGS84)
     * @param {!ol.Map} map -
     * @param {!Cesium.Scene} scene -
     * @constructor
     * @extends {olcs.AbstractSynchronizer.<Cesium.ImageryLayer>}
     * @api
     * @struct
     */
    constructor (map, scene) {
        super(map, scene);
    }

    /**
     * @api
     * @returns {void}
     */
    addOverlays () {
        /* eslint no-underscore-dangle: ["error", { "allow": ["overlays_"] }]*/
        this.overlays_.forEach((overlay) => {
            this.addOverlay(overlay);
        });
    }

    /** Only adds overlay if map3d is enabeld.
     * @param {ol.Collection.Event} event the event containing the overlay
     * @returns {void}
     */
    addOverlayFromEvent_ (event) {
        const map3d = Radio.request("Map", "getMap3d");

        if (map3d && map3d.getEnabled()) {
            const overlay = /** @type {ol.Overlay} */ event.element;

            if (overlay.getId() !== undefined) {
                this.addOverlay(overlay);
            }
        }
    }
}

export default FixedOverlaySynchronizer;

/* eslint-enable no-useless-constructor */
