/**
 * @typedef {object} ZoomToState
 * @type {object}
 * @property {object} config Configuration parameters set in config.js; for further information look into doc/config.js.md
 * @property {boolean} deprecatedParameters Declares whether one of the deprecated parameters 'zoomToFeature' or 'zoomToGeometry' have been used for configuration and values have to be retrieved differently; should be removed in version 3.0.0
 */
const state = {
    config: null,
    deprecatedParameters: false

};

export default state;
