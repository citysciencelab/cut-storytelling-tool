/**
 * @typedef {Number} MapMode
 **/

/**
 * Enum for map mode.
 * @readonly
 * @enum {Number}
 */
export const MapMode = {
    "MODE_2D": 0,
    "MODE_3D": 1,
    "MODE_OB": 2
};

/**
 * Returns the dedicated enum value.
 * @param {String} mode  as String, may be e.g. '2D' or '0' for 2D
 * @returns {MapMode} the dedicated enum value
 */
export function toMapMode (mode) {
    if (typeof mode === "string") {
        switch (mode.toLowerCase()) {
            case "2d":
            case String(MapMode.MODE_2D): {
                return MapMode.MODE_2D;
            }
            case "3d":
            case String(MapMode.MODE_3D): {
                return MapMode.MODE_3D;
            }
            case "oblique":
            case String(MapMode.MODE_OB): {
                return MapMode.MODE_OB;
            }
            default: {
                return MapMode.MODE_2D;
            }
        }
    }
    return MapMode.MODE_2D;
}
