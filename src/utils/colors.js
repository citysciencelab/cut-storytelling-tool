/**
 * this library provides standard colors and barrier free color schemes
 * a color is always put out as a rgba color array: [r, g, b, a]
 * use "src/utils/convertColor.js" to convert the rgba array into your desired format
 * e.g.: convertColor(getPrimaryColor(), "hex") => "#005ca9"
 */

/**
 * returns the primary color for the masterportal
 * @param {Number} [alpha=1.0] the alpha channel to use
 * @returns {Number[]} an array of numbers representing rgba [r, g, b, a]
 */
function getPrimaryColor (alpha = 1.0) {
    return [0, 92, 169, alpha];
}

/**
 * returns the secondary color for the masterportal
 * @param {Number} [alpha=1.0] the alpha channel to use
 * @returns {Number[]} an array of numbers representing rgba [r, g, b, a]
 */
function getSecondaryColor (alpha = 1.0) {
    return [225, 0, 25, alpha];
}

/**
 * returns a set of 7 rgba colors to use as save barrier free color set
 * @param {Number} [alpha=1.0] the alpha channel to use for all colors
 * @returns {Array[]} an array of arrays of numbers representing rgba [r, g, b, a]
 * @see {@link https://jfly.uni-koeln.de/color/}
 */
function getColorUniversalDesign (alpha = 1.0) {
    return [
        [46, 127, 210, alpha],
        [255, 217, 102, alpha],
        [13, 86, 163, alpha],
        [255, 130, 102, alpha],
        [0, 48, 99, alpha],
        [230, 159, 0, alpha],
        [86, 180, 233, alpha]
    ];
}

/**
 * returns a set of 10 blue tones, analysed by the IfBQ of Hamburg Town to be barrier free as a group
 * @param {Number} [alpha=1.0] the alpha channel to use for all colors
 * @returns {Array[]} an array of arrays of numbers representing rgba [r, g, b, a]
 */
function getColorSchemeBlue (alpha = 1.0) {
    return [
        [0, 48, 99, alpha],
        [4, 66, 132, alpha],
        [13, 86, 163, alpha],
        [26, 106, 189, alpha],
        [46, 127, 210, alpha],
        [74, 149, 226, alpha],
        [111, 173, 237, alpha],
        [152, 200, 246, alpha],
        [181, 216, 250, alpha],
        [208, 232, 255, alpha]
    ];
}

/**
 * returns a set of 5 darker blue tones and 3 red tones and 2 yellow tones, analysed by the IfBQ of Hamburg Town to be barrier free as a group
 * @param {Number} [alpha=1.0] the alpha channel to use for all colors
 * @returns {Array[]} an array of arrays of numbers representing rgba [r, g, b, a]
 */
function getColorSchemeBluePlus (alpha = 1.0) {
    return [
        [0, 48, 99, alpha],
        [4, 66, 132, alpha],
        [13, 86, 163, alpha],
        [26, 106, 189, alpha],
        [46, 127, 210, alpha],
        [255, 88, 51, alpha],
        [255, 130, 102, alpha],
        [255, 172, 153, alpha],
        [255, 217, 102, alpha],
        [255, 230, 153, alpha]
    ];
}

/**
 * returns a set of 3 darker red tones, 3 turquoise tones and 1 gray color tone, analysed by the IfBQ of Hamburg Town to be barrier free as a group
 * this can be used as red, green and neutral for e.g. traffic lights
 * @param {Number} [alpha=1.0] the alpha channel to use for all colors
 * @returns {Array[]} an array of arrays of numbers representing rgba [r, g, b, a]
 */
function getColorSchemeTrafficLights (alpha = 1.0) {
    return [
        [147, 27, 51, alpha],
        [167, 36, 60, alpha],
        [196, 42, 73, alpha],
        [91, 176, 159, alpha],
        [120, 191, 180, alpha],
        [156, 211, 201, alpha],
        [240, 240, 240, alpha]
    ];
}

export {
    getPrimaryColor,
    getSecondaryColor,
    getColorUniversalDesign,
    getColorSchemeBlue,
    getColorSchemeBluePlus,
    getColorSchemeTrafficLights
};
