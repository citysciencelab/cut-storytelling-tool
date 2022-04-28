/**
 * @typedef {object} ZoomToState
 * @type {object}
 * @property {object} config Configuration parameters set in config.js; for further information look into doc/config.js.md
 * @property {boolean} deprecatedParameters Declares whether one of the deprecated parameters 'zoomToFeature' or 'zoomToGeometry' have been used for configuration and values have to be retrieved differently; should be removed in version 3.0.0
 * @property {Array} zoomToFeatureId Url values set by user for configuration of zoomToFeatureId.
 * @property {Array} zoomToGeometry Url values set by user for configuration of zoomToGeometry.
 */
const state = {
    config: null,
    deprecatedParameters: false,
    zoomToFeatureId: undefined,
    zoomToGeometry: undefined
};

export default state;
