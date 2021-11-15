import Map3dModel from "../../../modules/core/map3d";
import ObliqueMap from "../../../modules/core/obliqueMap";
// import mapCollection from "../dataStorage/mapCollection";

/**
 * Create the map in differnt modes (2D, 3D and oblique)
 * @param {Object} configJs The config.js file.
 * @returns {void}
 */
export default function createMaps (configJs) {
    if (window.Cesium) {
        Radio.trigger("Map", "setMap3dModel", new Map3dModel());
    }
    if (configJs?.obliqueMap) {
        Radio.trigger("Map", "setObliqueMap", new ObliqueMap({}));
    }
}
