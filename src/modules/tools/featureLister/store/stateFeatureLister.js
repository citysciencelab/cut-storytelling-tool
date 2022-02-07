/**
 * User type definition
 * @typedef {Object} FeatureListerState
 * @property {Boolean} active if true, featureLister will be rendered
 * @property {String} id id of the FeatureLister component
 * @property {String} name displayed as title (config-param)
 * @property {String} glyphicon icon next to title (config-param)
 * @property {Boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {Boolean} resizableWindow if true, window is resizable (config-param)
 * @property {Boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {Boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 * @property {Number} maxFeatures default value for maxFeatures that can be overwritten in config
 * @property {Array} layerlist array of layers in the format {id, name, features}
 * @property {String} layerid id of visibleLayer to be displayed
 * @property {Object} layerFeatures layer object from layerlist with required layerid
 * @property {Array} headers list of headings in list
 * @property {String} featureid id of feature to be displayed
 * @property {Object} featureProps properties of feature with searched featureid
 * @property {Object} highlightedFeature feature to be highlighted
 * @property {Object} highlightedFeatureStyle style of highlighted feature
 * @property {Object} highlightVectorRulesPolygon default style for highlighting polygons
 * @property {Object} highlightVectorRulesPointLine default style for highlighting lines and points
 */
const state = {
    // defaults for config.json parameters
    name: "common:modules.tools.featureLister.title",
    glyphicon: "glyphicon-th-list",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: false,
    maxFeatures: 20,
    // featureLister state
    active: false,
    id: "featureLister",
    layerlist: [],
    layerId: "",
    layer: {},
    layerListView: true,
    gfiFeaturesOfLayer: [],
    featureCount: "",
    shownFeatures: "",
    visibleLayers: [],
    featureListView: false,
    detailView: false,
    headers: [],
    featureid: "",
    featureProps: {},
    highlightedFeature: null,
    highlightedFeatureStyle: null,
    highlightVectorRulesPolygon: {
        "fill": {
            "color": [255, 0, 255, 0.9]
        },
        "stroke": {
            "width": 4,
            "color": [0, 0, 204, 0.9]
        }
    },
    highlightVectorRulesPointLine: {
        "stroke": {
            "width": 8,
            "color": [255, 0, 255, 0.9]
        },
        "image": {
            "scale": 2
        }
    }
};

export default state;
